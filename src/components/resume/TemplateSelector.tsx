import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { ResumeTemplate, TemplatePreview } from '@/types/resume';

interface TemplateSelectorProps {
  templates: TemplatePreview[];
  selectedTemplate: ResumeTemplate;
  onSelectTemplate: (template: ResumeTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
}) => {

  console.log('Selected Template:', selectedTemplate);
  console.log('Templates:', templates);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            'cursor-pointer transition-all hover:border-primary',
            selectedTemplate === template.id && 'border-primary border-2'
          )}
          onClick={() => onSelectTemplate(template.id)}
        >
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[210/297] relative rounded-md overflow-hidden">
              <img
                src={template.imageUrl}
                alt={`${template.name} template preview`}
                className="object-cover w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelector;