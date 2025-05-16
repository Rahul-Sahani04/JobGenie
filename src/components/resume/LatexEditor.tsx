import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Download } from 'lucide-react';

interface LatexEditorProps {
  initialLatex?: string;
  onSave: (latex: string) => void;
  onGenerate: () => void;
  generating: boolean;
}

const LatexEditor: React.FC<LatexEditorProps> = ({
  initialLatex = '',
  onSave,
  onGenerate,
  generating
}) => {
  const [latex, setLatex] = useState(initialLatex || defaultTemplate);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleLatexChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLatex(e.target.value);
    setPreviewError(null);
  };

  const handleSave = () => {
    onSave(latex);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* LaTeX Editor */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">LaTeX Editor</h3>
        <textarea
          value={latex}
          onChange={handleLatexChange}
          className="w-full h-[600px] font-mono p-4 border rounded-md"
          placeholder="Enter your LaTeX code here..."
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onGenerate} disabled={generating}>
            <FileText className="h-4 w-4 mr-2" />
            {generating ? 'Generating PDF...' : 'Generate PDF'}
          </Button>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="w-full h-[600px] border rounded-md p-4 overflow-auto bg-white">
          {previewError ? (
            <div className="text-red-500">
              {previewError}
            </div>
          ) : (
            <div className="prose max-w-none">
              <Latex>{latex}</Latex>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const defaultTemplate = `\\documentclass[11pt,a4paper]{article}
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
  {\\LARGE \\textbf{Your Name}}\\\\[0.5em]
  {\\large Email: your.email@example.com}\\\\
  {\\large Phone: (123) 456-7890}
\\end{center}

\\section*{Education}
\\textbf{University Name} \\hfill 20XX -- 20XX\\\\
Degree, Major

\\section*{Experience}
\\textbf{Company Name} \\hfill Month 20XX -- Present\\\\
Job Title\\\\
• Achievement or responsibility\\\\
• Another achievement or responsibility

\\section*{Skills}
• Skill 1 • Skill 2 • Skill 3 • Skill 4

\\end{document}`;

export default LatexEditor;