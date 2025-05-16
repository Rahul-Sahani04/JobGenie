import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Plus, Trash2, Download, FileText } from 'lucide-react';
import { Resume, Education, WorkExperience, Skill } from '@/types/resume';
import resumeService from '@/services/resume';
import { useAuth } from '@/context/AuthContext';

interface ResumeBuilderProps {
  onSave?: () => void;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onSave }) => {
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('User found:', user);
      loadResume();
    }
  }, [user]);

  const loadResume = async () => {
    try {
      if (!user) return;
      const data = await resumeService.getResume(user._id);
      console.log('Resume loaded:', data);
      setResume(data);
    } catch (error) {
      console.error('Failed to load resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoChange = (field: keyof Resume['content']['basics'], value: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        basics: { ...resume.content.basics, [field]: value }
      }
    });
  };

  const addEducation = () => {
    if (!resume) return;
    const newEducation: Education = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: [...resume.content.education, newEducation]
      }
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    if (!resume) return;
    const updatedEducation = [...resume.content.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: updatedEducation
      }
    });
  };

  const removeEducation = (index: number) => {
    if (!resume) return;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: resume.content.education.filter((_, i) => i !== index)
      }
    });
  };

  const addExperience = () => {
    if (!resume) return;
    const newExperience: WorkExperience = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      summary: ''
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        workExperience: [...resume.content.workExperience, newExperience]
      }
    });
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    if (!resume) return;
    const updatedExperience = [...resume.content.workExperience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        workExperience: updatedExperience
      }
    });
  };

  const removeExperience = (index: number) => {
    if (!resume) return;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        workExperience: resume.content.workExperience.filter((_, i) => i !== index)
      }
    });
  };

  const addSkill = () => {
    if (!resume) return;
    const newSkill: Skill = {
      category: '',
      items: []
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: [...resume.content.skills, newSkill]
      }
    });
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    if (!resume) return;
    const updatedSkills = [...resume.content.skills];
    if (field === 'category') {
      updatedSkills[index] = {
        ...updatedSkills[index],
        category: value
      };
    }
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: updatedSkills
      }
    });
  };

  const updateSkillItems = (skillIndex: number, items: string) => {
    if (!resume) return;
    const updatedSkills = [...resume.content.skills];
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      items: items.split(',').map(item => item.trim())
    };
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: updatedSkills
      }
    });
  };

  const removeSkill = (index: number) => {
    if (!resume) return;
    setResume({
      ...resume,
      content: {
        ...resume.content,
        skills: resume.content.skills.filter((_, i) => i !== index)
      }
    });
  };

  const handleSave = async () => {
    if (!resume) return;
    try {
      console.log(resume._id);
      await resumeService.updateResume(resume._id, resume);
      if (onSave) onSave();
    } catch (error) {
      console.error('Failed to save resume:', error);
    }
  };

  const generateLatexResume = async () => {
    if (!resume) return;
    try {
      setGenerating(true);
      console.log('Generating LaTeX resume for ID:', resume);
      const { latexSource, pdfUrl } = await resumeService.generateLatexResume(resume._id);
      console.log('LaTeX source:', latexSource);
      console.log('PDF URL:', pdfUrl);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate LaTeX resume:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!resume) {
    return <div>Failed to load resume</div>;
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="Full Name"
            value={resume.content.basics.name}
            onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          />
          <Input 
            placeholder="Email"
            type="email"
            value={resume.content.basics.email}
            onChange={(e) => handleBasicInfoChange('email', e.target.value)}
          />
          <Input 
            placeholder="Phone"
            value={resume.content.basics.phone}
            onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
          />
          <Input 
            placeholder="Location"
            value={resume.content.basics.location}
            onChange={(e) => handleBasicInfoChange('location', e.target.value)}
          />
          <div className="col-span-2">
            <Input 
              placeholder="Professional Summary"
              value={resume.content.basics.summary}
              onChange={(e) => handleBasicInfoChange('summary', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Education</h3>
          <Button onClick={addEducation} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
        <div className="space-y-4">
          {resume.content.education.map((edu, index) => (
            <div key={index} className="p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                />
                <Input 
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
                <Input 
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                />
                <Input 
                  placeholder="GPA"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                />
                <Input 
                  type="date"
                  placeholder="Start Date"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                />
                <Input 
                  type="date"
                  placeholder="End Date"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-4"
                onClick={() => removeEducation(index)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Experience */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Experience</h3>
          <Button onClick={addExperience} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
        <div className="space-y-4">
          {resume.content.workExperience.map((exp, index) => (
            <div key={index} className="p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
                <Input 
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                />
                <Input 
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                />
                <div className="col-span-2">
                  <Input 
                    placeholder="Summary"
                    value={exp.summary || ''}
                    onChange={(e) => updateExperience(index, 'summary', e.target.value)}
                  />
                </div>
                <Input 
                  type="date"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
                <Input 
                  type="date"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-4"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Skills</h3>
          <Button onClick={addSkill} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill Category
          </Button>
        </div>
        <div className="space-y-4">
          {resume.content.skills.map((skill, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 border rounded-md p-4">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Category (e.g., Programming Languages)"
                  value={skill.category}
                  onChange={(e) => updateSkill(index, 'category', e.target.value)}
                />
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeSkill(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input 
                placeholder="Skills (comma separated, e.g., JavaScript, Python, Java)"
                value={skill.items.join(', ')}
                onChange={(e) => updateSkillItems(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
        <Button onClick={generateLatexResume} disabled={generating}>
          <FileText className="h-4 w-4 mr-2" />
          {generating ? 'Generating...' : 'Generate PDF'}
        </Button>
      </div>
    </div>
  );
};

export default ResumeBuilder;