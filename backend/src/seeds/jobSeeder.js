require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/job.model');
const connectDB = require('../config/db');

const jobs = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp India",
    location: "Bengaluru",
    description: "We're looking for an experienced Frontend Developer to join our team...",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with modern frontend tools"
    ],
    type: "Full-time",
    experience: {
      min: 5,
      max: 8
    },
    salary: {
      min: 1200000,
      max: 1800000,
      currency: "INR"
    },
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    status: "active"
  },
  {
    title: "Product Manager",
    company: "Innovate India",
    location: "Mumbai",
    description: "Join us in shaping the future of our product...",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical skills",
      "Excellent communication"
    ],
    type: "Full-time",
    experience: {
      min: 3,
      max: 6
    },
    salary: {
      min: 1500000,
      max: 2500000,
      currency: "INR"
    },
    skills: ["Product Strategy", "Agile", "Data Analysis", "User Research"],
    status: "active"
  },
  {
    title: "Data Scientist",
    company: "Global Solutions India",
    location: "Remote",
    description: "Looking for a skilled Data Scientist to join our analytics team...",
    requirements: [
      "Masters in Statistics or related field",
      "Experience with ML models",
      "Python expertise"
    ],
    type: "Full-time",
    experience: {
      min: 2,
      max: 5
    },
    salary: {
      min: 1000000,
      max: 1800000,
      currency: "INR"
    },
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    status: "active"
  }
];

const seedJobs = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing jobs
    await Job.deleteMany({});

    // Create a test user ID (you should replace this with a real user ID)
    const testUserId = new mongoose.Types.ObjectId();

    // Add the user ID to each job
    const jobsWithUser = jobs.map(job => ({
      ...job,
      postedBy: testUserId
    }));

    // Insert jobs
    await Job.insertMany(jobsWithUser);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedJobs();