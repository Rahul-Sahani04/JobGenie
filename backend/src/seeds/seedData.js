require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const User = require('../models/user.model');
const Job = require('../models/job.model');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Job.deleteMany({});
    await User.deleteMany({});

    // Create a test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    const user = await User.create({
      name: 'Test Recruiter',
      email: 'recruiter@test.com',
      password: hashedPassword,
      role: 'recruiter'
    });

    // Read CSV file and create jobs
    const jobs = [];
    const csvPath = path.join(__dirname, '../jobsData/jobs_scraped.csv');

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Parse experience range
          let expMin = 0, expMax = 0;
          if (row.experience) {
            const expMatch = row.experience.match(/(\d+)(?:-(\d+))?\s*Yrs/);
            if (expMatch) {
              expMin = parseInt(expMatch[1]) || 0;
              expMax = parseInt(expMatch[2]) || expMin;
            }
          }

          // Transform CSV data to match our Job model
          const job = {
            title: row.title,
            company: row.company,
            location: row.location,
            description: row.description || `Position for ${row.title} at ${row.company}`,
            type: row.job_type || 'Full Time',
            requirements: [],
            experience: {
              min: expMin,
              max: expMax
            },
            salary: {
              min: 400000,  // Default salary range since it's not in CSV
              max: 2000000,
              currency: 'INR'
            },
            skills: [],
            status: 'active',
            postedBy: user._id,
            source: row.source || 'Naukri',
            sourceUrl: row.url || '',
            scrapeDate: row.scrape_date || new Date().toISOString().split('T')[0]
          };
          jobs.push(job);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insert jobs in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);
      await Job.insertMany(batch);
      console.log(`Inserted jobs ${i + 1} to ${Math.min(i + batchSize, jobs.length)}`);
    }

    console.log('Database seeded!');
    console.log('Test user created:');
    console.log('Email: recruiter@test.com');
    console.log('Password: testpass123');
    console.log(`Total jobs created: ${jobs.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();