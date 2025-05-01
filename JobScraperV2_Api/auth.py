from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import uuid
from datetime import datetime, timedelta
from functools import wraps
from models import db, User, UserPreferences
import json

auth = Blueprint('auth', __name__)

# JWT Configuration
JWT_SECRET = 'your-secret-key'  # In production, use environment variable
JWT_EXPIRATION = 24 * 60 * 60  # 24 hours in seconds

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user = User.query.get_or_404(data['user_id'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        except:
            return jsonify({'message': 'Could not process token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'firstName', 'lastName']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 409
    
    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        first_name=data['firstName'],
        last_name=data['lastName']
    )
    
    db.session.add(new_user)
    
    # Create user preferences if provided
    if 'preferences' in data:
        prefs = data['preferences']
        preferences = UserPreferences(
            user_id=new_user.id,
            job_types=json.dumps(prefs.get('jobTypes', [])),
            locations=json.dumps(prefs.get('locations', [])),
            experience_levels=json.dumps(prefs.get('experienceLevels', [])),
            remote=prefs.get('remote', False),
            min_salary=prefs.get('salary', {}).get('min'),
            max_salary=prefs.get('salary', {}).get('max')
        )
        db.session.add(preferences)
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating user', 'error': str(e)}), 500
    
    # Generate token
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION)
    }, JWT_SECRET)
    
    return jsonify({
        'token': token,
        'user': {
            'id': new_user.id,
            'email': new_user.email,
            'firstName': new_user.first_name,
            'lastName': new_user.last_name,
            'savedJobs': [],
            'preferences': data.get('preferences')
        }
    }), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION)
    }, JWT_SECRET)
    
    # Get user preferences
    preferences = UserPreferences.query.filter_by(user_id=user.id).first()
    prefs = None
    if preferences:
        prefs = {
            'jobTypes': json.loads(preferences.job_types or '[]'),
            'locations': json.loads(preferences.locations or '[]'),
            'experienceLevels': json.loads(preferences.experience_levels or '[]'),
            'remote': preferences.remote,
            'salary': {
                'min': preferences.min_salary,
                'max': preferences.max_salary
            } if preferences.min_salary and preferences.max_salary else None
        }
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'savedJobs': [sj.job_id for sj in user.saved_jobs],
            'preferences': prefs,
            'resume': user.resume_url
        }
    })

@auth.route('/user/profile', methods=['GET', 'PUT'])
@token_required
def user_profile(current_user):
    if request.method == 'GET':
        preferences = UserPreferences.query.filter_by(user_id=current_user.id).first()
        prefs = None
        if preferences:
            prefs = {
                'jobTypes': json.loads(preferences.job_types or '[]'),
                'locations': json.loads(preferences.locations or '[]'),
                'experienceLevels': json.loads(preferences.experience_levels or '[]'),
                'remote': preferences.remote,
                'salary': {
                    'min': preferences.min_salary,
                    'max': preferences.max_salary
                } if preferences.min_salary and preferences.max_salary else None
            }
        
        return jsonify({
            'id': current_user.id,
            'email': current_user.email,
            'firstName': current_user.first_name,
            'lastName': current_user.last_name,
            'savedJobs': [sj.job_id for sj in current_user.saved_jobs],
            'preferences': prefs,
            'resume': current_user.resume_url
        })
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        if 'firstName' in data:
            current_user.first_name = data['firstName']
        if 'lastName' in data:
            current_user.last_name = data['lastName']
        
        if 'preferences' in data:
            prefs = data['preferences']
            preferences = UserPreferences.query.filter_by(user_id=current_user.id).first()
            
            if not preferences:
                preferences = UserPreferences(user_id=current_user.id)
                db.session.add(preferences)
            
            preferences.job_types = json.dumps(prefs.get('jobTypes', []))
            preferences.locations = json.dumps(prefs.get('locations', []))
            preferences.experience_levels = json.dumps(prefs.get('experienceLevels', []))
            preferences.remote = prefs.get('remote', False)
            if 'salary' in prefs and prefs['salary']:
                preferences.min_salary = prefs['salary'].get('min')
                preferences.max_salary = prefs['salary'].get('max')
        
        try:
            db.session.commit()
            return jsonify({'message': 'Profile updated successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Error updating profile', 'error': str(e)}), 500