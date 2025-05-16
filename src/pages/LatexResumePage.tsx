import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeBuilder from '@/components/resume/ResumeBuilder';
import LatexEditor from '@/components/resume/LatexEditor';
import resumeService from '@/services/resume';
import { useAuth } from '@/context/AuthContext';

const LatexResumePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('builder');
  const [generating, setGenerating] = useState(false);
  const [latexCode, setLatexCode] = useState('');

  const handleResumeUpdate = () => {
    // Refresh LaTeX code when resume is updated
    if (user) {
    //   handleGenerateLatex();
    }
  };

  const handleSaveLatex = async (latex: string) => {
    if (!user) return;
    try {
      setLatexCode(latex);
      // Here you would typically save the LaTeX code to the backend
      // await resumeService.updateLatexTemplate(user._id, latex);
    } catch (error) {
      console.error('Failed to save LaTeX code:', error);
    }
  };

  const handleGenerateLatex = async () => {
    if (!user) return;
    try {
      setGenerating(true);
      const resume = await resumeService.getResume(user._id);
      const { latexSource, pdfUrl } = await resumeService.generateLatexResume(resume.id);
      setLatexCode(latexSource);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate LaTeX resume:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">LaTeX Resume Builder</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b mb-6">
          <TabsTrigger value="builder" className="flex-1">
            Resume Builder
          </TabsTrigger>
          <TabsTrigger value="latex" className="flex-1">
            LaTeX Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6">
          <ResumeBuilder onSave={handleResumeUpdate} />
        </TabsContent>

        <TabsContent value="latex" className="mt-6">
          <LatexEditor
            initialLatex={latexCode}
            onSave={handleSaveLatex}
            onGenerate={handleGenerateLatex}
            generating={generating}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LatexResumePage;