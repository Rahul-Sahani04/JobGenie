const Resume = require("../models/resume.model");
const path = require('path');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');

const sampleResumeData = {
  user: null,
  title: 'My Resume',
  isDefault: true,
  template: 'classic',
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

const updateTemplate = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { template } = req.body;

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      { $set: { template } },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating template", error: error.message });
  }
};

const generateLatexResume = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const { template } = req.body;
    console.log('Generating resume with template:', template);

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const latexSource = generateLatexTemplate(resume.content, template);
    const htmlContent = generateHTMLFromContent(resume.content);

    try {
      const publicDir = path.join(__dirname, '../../public/resumes');
      await fs.mkdir(publicDir, { recursive: true });
      
      const browser = await puppeteer.launch({
        headless: 'new'
      });
      const page = await browser.newPage();

      // Load template styles
      console.log('Loading template styles...');
      const styleContent = await fs.readFile(
        path.join(__dirname, '../../public/templates/template-styles.css'),
        'utf-8'
      );
      console.log('Template styles loaded');
      
      // Combine template styles with HTML content
      const fullHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${resume.content.basics.name || 'Resume'}</title>
          <style>
            ${styleContent}
          </style>
        </head>
        <body class="template-${template || 'classic'}">
          <div class="content">
            ${htmlContent}
          </div>
        </body>
        </html>
      `;

      console.log('Setting page content with template:', template);
      console.log('Body class:', `template-${template || 'classic'}`);

      // Set content and wait for all resources
      await page.setContent(fullHtmlContent, {
        waitUntil: ['networkidle0', 'load', 'domcontentloaded']
      });

      // Add print media emulation
      await page.emulateMediaType('print');

      // Generate PDF with background colors enabled
      console.log('Generating PDF...');
      const pdfPath = path.join(publicDir, `${resumeId}.pdf`);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '2cm',
          right: '2cm',
          bottom: '2cm',
          left: '2cm'
        }
      });
      console.log('PDF generated successfully');

      await browser.close();

      res.json({
        latexSource,
        pdfUrl: `/resumes/${resumeId}.pdf`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({
        error: 'PDF generation failed. Please try again.',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Error in generateLatexResume:', error);
    res
      .status(500)
      .json({ message: "Error generating resume", error: error.message });
  }
};

const generateHTMLFromContent = (content) => {
  const { basics, education: eduItems, workExperience, skills } = content;
  
  return `
    <div class="header">
      <h1>${basics.name || 'Your Name'}</h1>
      <div class="contact-info">
        ${basics.email ? `<p>Email: ${basics.email}</p>` : ''}
        ${basics.phone ? `<p>Phone: ${basics.phone}</p>` : ''}
        ${basics.location ? `<p>Location: ${basics.location}</p>` : ''}
      </div>
    </div>

    ${basics.summary ? `
      <div class="section">
        <h2>Professional Summary</h2>
        <div class="summary">
          <p>${basics.summary}</p>
        </div>
      </div>
    ` : ''}

    ${eduItems.length > 0 ? `
      <div class="section">
        <h2>Education</h2>
        ${eduItems.map(edu => `
          <div class="item">
            <div class="item-header">
              <span class="institution">${edu.institution}</span>
              <span class="date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
            </div>
            <div class="details">
              ${edu.degree}${edu.field ? `, ${edu.field}` : ''}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}
            </div>
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
              <span class="company">${exp.company}</span>
              <span class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
            </div>
            <div class="position">${exp.position}${exp.location ? ` - ${exp.location}` : ''}</div>
            ${exp.summary ? `<p class="summary">${exp.summary}</p>` : ''}
            ${exp.highlights ? `<ul class="highlights">${exp.highlights.map(highlight => `<li>${highlight}</li>`).join('')}</ul>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${skills.length > 0 ? `
      <div class="section">
        <h2>Skills</h2>
        <div class="skills-grid">
          ${skills.map(skill => `
            <div class="skill-item">
              <strong class="category">${skill.category}:</strong>
              <span class="items">${skill.items.join(', ')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
};

const generateLatexTemplate = (content, template = 'classic') => {
  const { basics, education: eduItems, workExperience, skills } = content;
  const templateStyles = getLatexTemplateStyles(template);
  
  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{hyperref}
\\usepackage{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}

\\geometry{
  a4paper,
  margin=2cm
}

${templateStyles}

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
${edu.achievements ? edu.achievements.map(achievement => `\\item ${achievement}`).join('\n') : ''}
`).join('\n')}
` : ''}

${workExperience.length > 0 ? `
\\section*{Experience}
${workExperience.map(exp => `
\\textbf{${exp.company}} \\hfill ${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)}\\\\
\\textit{${exp.position}}${exp.location ? ` \\hfill ${exp.location}` : ''}\\\\
${exp.summary ? `${exp.summary}\\\\` : ''}
${exp.highlights ? exp.highlights.map(highlight => `\\item ${highlight}`).join('\n') : ''}
`).join('\n\n')}
` : ''}

${skills.length > 0 ? `
\\section*{Skills}
${skills.map(skill => `\\textbf{${skill.category}}: ${skill.items.join(', ')}`).join('\\\\\n')}
` : ''}

\\end{document}`;
};

const getLatexTemplateStyles = (template) => {
  switch (template) {
    case 'modern':
      return `
        \\definecolor{primary}{RGB}{37, 99, 235}
        \\titleformat*{\\section}{\\Large\\bfseries\\color{primary}}
        \\setlist[itemize]{label=\\textbullet}
      `;
    case 'minimal':
      return `
        \\titleformat*{\\section}{\\large\\bfseries\\scshape}
        \\setlist[itemize]{label=--}
      `;
    default: // classic
      return `
        \\titleformat*{\\section}{\\Large\\bfseries}
        \\setlist[itemize]{label=\\textbullet}
      `;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

module.exports = {
  getResumeByUserId,
  updateResume,
  updateTemplate,
  generateLatexResume,
};
