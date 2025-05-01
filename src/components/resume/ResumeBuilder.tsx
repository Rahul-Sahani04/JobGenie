import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Plus, Trash2, Download, FileText } from 'lucide-react';
import { Resume, Education, Experience, Skill } from '@/types/resume';
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
      loadResume();
    }
  }, [user]);

  const loadResume = async () => {
    try {
      if (!user) return;
      const data = await resumeService.getResume(user.id);
      setResume(data);
    } catch (error) {
      console.error('Failed to load resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoChange = (field: keyof Resume['basics'], value: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      basics: { ...resume.basics, [field]: value }
    });
  };

  const addEducation = () => {
    if (!resume) return;
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    setResume({
      ...resume,
      education: [...resume.education, newEducation]
    });
  };

  const updateEducation = async (id: string, field: keyof Education, value: string) => {
    if (!resume) return;
    const updatedEducation = resume.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setResume({
      ...resume,
      education: updatedEducation
    });
    try {
      await resumeService.updateEducation(id, { [field]: value });
    } catch (error) {
      console.error('Failed to update education:', error);
    }
  };

  const removeEducation = async (id: string) => {
    if (!resume) return;
    try {
      await resumeService.deleteEducation(id);
      setResume({
        ...resume,
        education: resume.education.filter(edu => edu.id !== id)
      });
    } catch (error) {
      console.error('Failed to delete education:', error);
    }
  };

  const addExperience = () => {
    if (!resume) return;
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResume({
      ...resume,
      experience: [...resume.experience, newExperience]
    });
  };

  const updateExperience = async (id: string, field: keyof Experience, value: string | boolean) => {
    if (!resume) return;
    const updatedExperience = resume.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setResume({
      ...resume,
      experience: updatedExperience
    });
    try {
      await resumeService.updateExperience(id, { [field]: value });
    } catch (error) {
      console.error('Failed to update experience:', error);
    }
  };

  const removeExperience = async (id: string) => {
    if (!resume) return;
    try {
      await resumeService.deleteExperience(id);
      setResume({
        ...resume,
        experience: resume.experience.filter(exp => exp.id !== id)
      });
    } catch (error) {
      console.error('Failed to delete experience:', error);
    }
  };

  const addSkill = () => {
    if (!resume) return;
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Beginner'
    };
    setResume({
      ...resume,
      skills: [...resume.skills, newSkill]
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      skills: resume.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    });
  };

  const removeSkill = (id: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      skills: resume.skills.filter(skill => skill.id !== id)
    });
  };

  const handleSave = async () => {
    if (!resume || !user) return;
    try {
      await resumeService.updateResume(resume.id, resume);
      if (onSave) onSave();
    } catch (error) {
      console.error('Failed to save resume:', error);
    }
  };

  const generateLatexResume = async () => {
    if (!resume) return;
    try {
      setGenerating(true);
      const { latexSource, pdfUrl } = await resumeService.generateLatexResume(resume.id);
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
            value={resume.basics.name}
            onChange={(e) => handleBasicInfoChange('name', e.target.value)}
          />
          <Input 
            placeholder="Email"
            type="email"
            value={resume.basics.email}
            onChange={(e) => handleBasicInfoChange('email', e.target.value)}
          />
          <Input 
            placeholder="Phone"
            value={resume.basics.phone}
            onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
          />
          <Input 
            placeholder="Location"
            value={resume.basics.location}
            onChange={(e) => handleBasicInfoChange('location', e.target.value)}
          />
          <div className="col-span-2">
            <Input 
              placeholder="Professional Summary"
              value={resume.basics.summary}
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
          {resume.education.map((edu) => (
            <div key={edu.id} className="p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                />
                <Input 
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                />
                <Input 
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                />
                <Input 
                  placeholder="GPA"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                />
                <Input 
                  type="date"
                  placeholder="Start Date"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                />
                <Input 
                  type="date"
                  placeholder="End Date"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-4"
                onClick={() => removeEducation(edu.id)}
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
          {resume.experience.map((exp) => (
            <div key={exp.id} className="p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                />
                <Input 
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                />
                <Input 
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                />
                <div className="col-span-2">
                  <Input 
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  />
                </div>
                <Input 
                  type="date"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                />
                <Input 
                  type="date"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-4"
                onClick={() => removeExperience(exp.id)}
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
            Add Skill
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resume.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-2">
              <Input 
                placeholder="Skill"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => removeSkill(skill.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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