from app import app, db
from models import User, Job, Company, UserPreferences, SavedJob, JobApplication
from datetime import datetime, timedelta
import uuid
from werkzeug.security import generate_password_hash
import json

def seed_database():
    with app.app_context():
        print("Clearing existing data...")
        try:
            # Drop tables in correct order to avoid foreign key constraints
            JobApplication.query.delete()
            SavedJob.query.delete()
            Job.query.delete()
            UserPreferences.query.delete()
            User.query.delete()
            Company.query.delete()
            db.session.commit()
        except Exception as e:
            print(f"Error clearing data: {e}")
            db.session.rollback()
            return

        print("Creating sample companies...")
        companies = [
            {
                'id': str(uuid.uuid4()),
                'name': 'TechCorp',
                'description': 'A leading technology solutions provider specializing in innovative software solutions.',
                'website': 'https://techcorp.com',
                'location': 'New York, NY',
                'logo_url': 'https://example.com/techcorp-logo.png'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Innovate Inc',
                'description': 'Innovation-driven software company creating cutting-edge applications.',
                'website': 'https://innovateinc.com',
                'location': 'San Francisco, CA',
                'logo_url': 'https://example.com/innovate-logo.png'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'CodeSphere',
                'description': 'Global software development company focusing on scalable solutions.',
                'website': 'https://codesphere.com',
                'location': 'Remote',
                'logo_url': 'https://example.com/codesphere-logo.png'
            }
        ]

        created_companies = []
        for company_data in companies:
            company = Company(**company_data)
            db.session.add(company)
            created_companies.append(company)
        
        try:
            db.session.commit()
            print("Companies created successfully")
        except Exception as e:
            print(f"Error creating companies: {e}")
            db.session.rollback()
            return

        print("Creating sample jobs...")
        job_types = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
        experience_levels = ['Entry level', 'Mid level', 'Senior level', 'Executive']

        for i in range(20):
            company = created_companies[i % len(created_companies)]
            job = Job(
                id=str(uuid.uuid4()),
                title=['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager'][i % 5],
                company_id=company.id,
                location=company.location,
                description="""We are seeking an experienced professional to join our dynamic team. 
                The ideal candidate will have strong technical skills and a passion for innovation.
                
                Our company offers:
                - Competitive salary and benefits
                - Professional development opportunities
                - Flexible work arrangements
                - Collaborative work environment""",
                responsibilities=json.dumps([
                    'Design and implement software solutions',
                    'Collaborate with cross-functional teams',
                    'Write clean, maintainable code',
                    'Participate in code reviews',
                    'Mentor junior team members'
                ]),
                qualifications=json.dumps([
                    'Bachelor\'s degree in Computer Science or related field',
                    f'{3 + (i % 5)} years of professional experience',
                    'Strong problem-solving skills',
                    'Excellent communication abilities',
                    'Experience with modern development tools and practices'
                ]),
                salary=f'${90 + i * 10}k - ${120 + i * 10}k',
                job_type=job_types[i % len(job_types)],
                experience_level=experience_levels[(i // 5) % len(experience_levels)],
                posted_date=datetime.utcnow() - timedelta(days=i),
                application_url=f'https://careers.{company.website.split("//")[1]}/jobs/{i}',
                remote=i % 3 == 0
            )
            db.session.add(job)

        try:
            db.session.commit()
            print("Jobs created successfully")
        except Exception as e:
            print(f"Error creating jobs: {e}")
            db.session.rollback()
            return

        print("Creating sample users...")
        users = [
            {
                'id': str(uuid.uuid4()),
                'email': 'john@example.com',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Doe'
            },
            {
                'id': str(uuid.uuid4()),
                'email': 'jane@example.com',
                'password': 'password123',
                'first_name': 'Jane',
                'last_name': 'Smith'
            }
        ]

        created_users = []
        for user_data in users:
            # Create user
            user = User(
                id=user_data['id'],
                email=user_data['email'],
                password_hash=generate_password_hash(user_data['password']),
                first_name=user_data['first_name'],
                last_name=user_data['last_name']
            )
            db.session.add(user)
            created_users.append(user)

            # Create user preferences
            preferences = UserPreferences(
                user_id=user.id,
                job_types=json.dumps(['Full-time', 'Contract']),
                locations=json.dumps(['New York, NY', 'Remote']),
                experience_levels=json.dumps(['Mid level', 'Senior level']),
                remote=True,
                min_salary=80000,
                max_salary=150000
            )
            db.session.add(preferences)

        try:
            db.session.commit()
            print("Users created successfully")
        except Exception as e:
            print(f"Error creating users: {e}")
            db.session.rollback()
            return

        print("Creating sample saved jobs and applications...")
        jobs = Job.query.limit(3).all()
        for user in created_users:
            for job in jobs:
                # Add saved job
                saved_job = SavedJob(
                    user_id=user.id,
                    job_id=job.id
                )
                db.session.add(saved_job)

                # Add job application
                application = JobApplication(
                    user_id=user.id,
                    job_id=job.id,
                    status=['applied', 'interviewing', 'offered'][jobs.index(job)],
                    notes='Applied through company website'
                )
                db.session.add(application)

        try:
            db.session.commit()
            print("Saved jobs and applications created successfully")
        except Exception as e:
            print(f"Error creating saved jobs and applications: {e}")
            db.session.rollback()
            return

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()