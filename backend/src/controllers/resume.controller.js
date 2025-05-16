const Resume = require("../models/resume.model");
const path = require('path');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');

const sampleResumeData = {
  user: null, // Will be set in getResumeByUserId
  title: 'My Resume',
  isDefault: true,
  content: {
    basics: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      website: '',
      profiles: []
    },
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: []
  },
  metadata: {
    targetPosition: '',
    targetCompany: '',
    customTags: []
  }
};

const getResumeByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching resume for user ID:", userId);
    
    const resume = await Resume.findOne({ user: userId });
    console.log("Resume found:", resume);
    
    if (!resume) {
      // If no resume exists, create a new one
      const newResume = new Resume({
        ...sampleResumeData,
        user: userId
      });
      await newResume.save();
      return res.json(newResume);
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res
      .status(500)
      .json({ message: "Error fetching resume", error: error.message });
  }
};

const updateResume = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const updates = req.body;

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      { $set: updates },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating resume", error: error.message });
  }
};

const generateLatexResume = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Generate LaTeX content and HTML version for preview
    const latexSource = generateLatexTemplate(resume.content);
    const htmlContent = generateHTMLFromContent(resume.content);

    try {
      // Create the public directory if it doesn't exist
      const publicDir = path.join(__dirname, '../../public/resumes');
      await fs.mkdir(publicDir, { recursive: true });
      
      // Generate PDF using Puppeteer
      const browser = await puppeteer.launch({
        headless: 'new'
      });
      const page = await browser.newPage();
      
      // Set content and wait for network idle
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });
      
      // Add print styles
      await page.addStyleTag({
        content: `
          @page {
            margin: 2cm;
            size: A4;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          h1, h2 {
            color: #2c5282;
          }
        `
      });

      // Generate PDF
      const pdfPath = path.join(publicDir, `${resumeId}.pdf`);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '2cm',
          right: '2cm',
          bottom: '2cm',
          left: '2cm'
        }
      });

      await browser.close();

      // Send back both LaTeX source and PDF URL
      res.json({
        latexSource,
        pdfUrl: `/resumes/${resumeId}.pdf`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      res.json({
        latexSource,
        error: 'PDF generation failed. Please try again.',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating resume", error: error.message });
  }
};

const generateHTMLFromContent = (content) => {
  const { basics, education: eduItems, workExperience, skills } = content;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Resume</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .section {
          margin-bottom: 2rem;
        }
        .item {
          margin-bottom: 1rem;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${basics.name || 'Your Name'}</h1>
        ${basics.email ? `<p>Email: ${basics.email}</p>` : ''}
        ${basics.phone ? `<p>Phone: ${basics.phone}</p>` : ''}
        ${basics.location ? `<p>Location: ${basics.location}</p>` : ''}
      </div>

      ${basics.summary ? `
        <div class="section">
          <h2>Professional Summary</h2>
          <p>${basics.summary}</p>
        </div>
      ` : ''}

      ${eduItems.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${eduItems.map(edu => `
            <div class="item">
              <div class="item-header">
                <span>${edu.institution}</span>
                <span>${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
              </div>
              <div>${edu.degree}${edu.field ? `, ${edu.field}` : ''}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}</div>
              ${edu.achievements ? `<ul>${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${workExperience.length > 0 ? `
        <div class="section">
          <h2>Experience</h2>
          ${workExperience.map(exp => `
            <div class="item">
              <div class="item-header">
                <span>${exp.company}</span>
                <span>${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <div><em>${exp.position}</em>${exp.location ? ` - ${exp.location}` : ''}</div>
              ${exp.summary ? `<p>${exp.summary}</p>` : ''}
              ${exp.highlights ? `<ul>${exp.highlights.map(highlight => `<li>${highlight}</li>`).join('')}</ul>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${skills.length > 0 ? `
        <div class="section">
          <h2>Skills</h2>
          <div class="skills-grid">
            ${skills.map(skill => `
              <div>
                <strong>${skill.category}:</strong>
                <span>${skill.items.join(', ')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
};

const generateLatexTemplate = (content) => {
  const { basics, education: eduItems, workExperience, skills } = content;
  
  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{hyperref}
\\usepackage{geometry}

\\geometry{
  a4paper,
  margin=2cm
}

\\begin{document}

\\begin{center}
  {\\LARGE \\textbf{${basics.name || 'Your Name'}}}\\\\[0.5em]
  ${basics.email ? `{\\large Email: ${basics.email}}\\\\` : ''}
  ${basics.phone ? `{\\large Phone: ${basics.phone}}\\\\` : ''}
  ${basics.location ? `{\\large Location: ${basics.location}}\\\\` : ''}
\\end{center}

${basics.summary ? `
\\section*{Professional Summary}
${basics.summary}
` : ''}

${eduItems.length > 0 ? `
\\section*{Education}
${eduItems.map(edu => `
\\textbf{${edu.institution}} \\hfill ${formatDate(edu.startDate)} -- ${formatDate(edu.endDate)}\\\\
${edu.degree}${edu.field ? `, ${edu.field}` : ''}${edu.gpa ? ` \\hfill GPA: ${edu.gpa}` : ''}
${edu.achievements ? edu.achievements.map(achievement => `• ${achievement}`).join('\\\\\n') : ''}
`).join('\n')}
` : ''}

${workExperience.length > 0 ? `
\\section*{Experience}
${workExperience.map(exp => `
\\textbf{${exp.company}} \\hfill ${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)}\\\\
\\textit{${exp.position}}${exp.location ? ` \\hfill ${exp.location}` : ''}\\\\
${exp.summary ? `${exp.summary}\\\\` : ''}
${exp.highlights ? exp.highlights.map(highlight => `• ${highlight}`).join('\\\\\n') : ''}
`).join('\n\n')}
` : ''}

${skills.length > 0 ? `
\\section*{Skills}
${skills.map(skill => `\\textbf{${skill.category}}: ${skill.items.join(', ')}`).join('\\\\\n')}
` : ''}

\\end{document}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

module.exports = {
  getResumeByUserId,
  updateResume,
  generateLatexResume,
};
