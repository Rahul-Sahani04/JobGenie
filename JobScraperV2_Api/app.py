from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from werkzeug.utils import secure_filename
from models import db, Job, User, SavedJob, JobApplication, Company, UserPreferences


app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobgenie.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize database with app
db.init_app(app)

# Import authentication blueprint
from auth import auth, token_required

# Register authentication blueprint
app.register_blueprint(auth, url_prefix='/auth')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Job Routes
@app.route('/jobs', methods=['GET'])
def get_jobs():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    query = request.args.get('query')
    location = request.args.get('location')
    job_type = request.args.get('jobType')
    experience_level = request.args.get('experienceLevel')
    remote = request.args.get('remote')

    jobs_query = Job.query

    if query:
        jobs_query = jobs_query.filter(Job.title.ilike(f'%{query}%'))
    if location:
        jobs_query = jobs_query.filter(Job.location.ilike(f'%{location}%'))
    if job_type:
        jobs_query = jobs_query.filter(Job.job_type == job_type)
    if experience_level:
        jobs_query = jobs_query.filter(Job.experience_level == experience_level)
    if remote:
        jobs_query = jobs_query.filter(Job.remote == (remote.lower() == 'true'))

    total = jobs_query.count()
    jobs = jobs_query.paginate(page=page, per_page=limit)

    return jsonify({
        'jobs': [{
            'id': job.id,
            'title': job.title,
            'company': job.company_id,
            'company_info': {
                'id': job.company.id,
                'name': job.company.name,
                'logo': job.company.logo_url,
                'website': job.company.website,
                'location': job.company.location
            } if job.company else None,
            'location': job.location,
            'description': job.description,
            'responsibilities': json.loads(job.responsibilities) if job.responsibilities else None,
            'qualifications': json.loads(job.qualifications) if job.qualifications else None,
            'salary': job.salary,
            'jobType': job.job_type,
            'experienceLevel': job.experience_level,
            'postedDate': job.posted_date.isoformat(),
            'applicationUrl': job.application_url,
            'logo': job.logo,
            'remote': job.remote
        } for job in jobs.items],
        'total': total,
        'page': page,
        'limit': limit
    })

@app.route('/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    
    return jsonify({
        'id': job.id,
        'title': job.title,
        'company': job.company_id,
        'company_info': {
            'id': job.company.id,
            'name': job.company.name,
            'logo': job.company.logo_url,
            'website': job.company.website,
            'location': job.company.location
        } if job.company else None,
        'location': job.location,
        'description': job.description,
        'responsibilities': json.loads(job.responsibilities) if job.responsibilities else None,
        'qualifications': json.loads(job.qualifications) if job.qualifications else None,
        'salary': job.salary,
        'jobType': job.job_type,
        'experienceLevel': job.experience_level,
        'postedDate': job.posted_date.isoformat(),
        'applicationUrl': job.application_url,
        'remote': job.remote
    })

# Saved Jobs Routes
@app.route('/user/saved-jobs', methods=['GET', 'POST', 'DELETE'])
@token_required
def saved_jobs(current_user):
    if request.method == 'GET':
        saved = SavedJob.query.filter_by(user_id=current_user.id).all()
        jobs = []
        for saved_job in saved:
            job = Job.query.get(saved_job.job_id)
            if job:
                jobs.append({
                    'id': job.id,
                    'title': job.title,
                    'company': job.company_id,
                    'company_info': {
                        'id': job.company.id,
                        'name': job.company.name,
                        'logo': job.company.logo_url,
                        'location': job.company.location
                    } if job.company else None,
                    'location': job.location,
                    'jobType': job.job_type,
                    'salary': job.salary,
                    'postedDate': job.posted_date.isoformat(),
                    'savedAt': saved_job.saved_at.isoformat()
                })
        return jsonify(jobs)
    
    elif request.method == 'POST':
        data = request.get_json()
        job_id = data.get('jobId')
        
        if not job_id:
            return jsonify({'message': 'Job ID is required'}), 400
            
        if SavedJob.query.filter_by(user_id=current_user.id, job_id=job_id).first():
            return jsonify({'message': 'Job already saved'}), 409
            
        saved_job = SavedJob(user_id=current_user.id, job_id=job_id)
        db.session.add(saved_job)
        db.session.commit()
        return jsonify({'message': 'Job saved successfully'})
    
    elif request.method == 'DELETE':
        job_id = request.args.get('jobId')
        if not job_id:
            return jsonify({'message': 'Job ID is required'}), 400
            
        saved_job = SavedJob.query.filter_by(user_id=current_user.id, job_id=job_id).first()
        if not saved_job:
            return jsonify({'message': 'Job not found in saved jobs'}), 404
            
        db.session.delete(saved_job)
        db.session.commit()
        return jsonify({'message': 'Job removed from saved jobs'})

# Job Applications Routes
@app.route('/user/applications', methods=['GET', 'POST'])
@token_required
def job_applications(current_user):
    if request.method == 'GET':
        applications = JobApplication.query.filter_by(user_id=current_user.id).all()
        return jsonify([{
            'id': app.id,
            'jobId': app.job_id,
            'status': app.status,
            'appliedAt': app.applied_at.isoformat(),
            'updatedAt': app.updated_at.isoformat(),
            'notes': app.notes
        } for app in applications])
    
    elif request.method == 'POST':
        data = request.get_json()
        job_id = data.get('jobId')
        notes = data.get('notes')
        
        if not job_id:
            return jsonify({'message': 'Job ID is required'}), 400
            
        if JobApplication.query.filter_by(user_id=current_user.id, job_id=job_id).first():
            return jsonify({'message': 'Already applied to this job'}), 409
            
        application = JobApplication(
            user_id=current_user.id,
            job_id=job_id,
            notes=notes
        )
        db.session.add(application)
        db.session.commit()
        
        return jsonify({
            'id': application.id,
            'jobId': application.job_id,
            'status': application.status,
            'appliedAt': application.applied_at.isoformat(),
            'updatedAt': application.updated_at.isoformat(),
            'notes': application.notes
        }), 201

@app.route('/user/applications/<int:application_id>', methods=['PUT'])
@token_required
def update_application(current_user, application_id):
    application = JobApplication.query.filter_by(
        id=application_id, 
        user_id=current_user.id
    ).first_or_404()
    
    data = request.get_json()
    if 'status' in data:
        application.status = data['status']
    if 'notes' in data:
        application.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({
        'id': application.id,
        'jobId': application.job_id,
        'status': application.status,
        'appliedAt': application.applied_at.isoformat(),
        'updatedAt': application.updated_at.isoformat(),
        'notes': application.notes
    })

# Resume Upload Route
@app.route('/user/resume', methods=['POST'])
@token_required
def upload_resume(current_user):
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{current_user.id}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        current_user.resume_url = filepath
        db.session.commit()
        
        return jsonify({
            'message': 'Resume uploaded successfully',
            'resume': filepath
        })
    
    return jsonify({'message': 'Invalid file type'}), 400

if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
    app.run(debug=True)
