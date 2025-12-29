import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Loader2 } from 'lucide-react';
import { invokeNetlifyFunction } from '@/lib/api';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export function SummarySection() {
  const { resume, updateSummary } = useResume();
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Strip HTML tags for counting
  const plainText = resume.summary.replace(/<[^>]*>/g, '');
  const charCount = plainText.length;
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;

  const handleEnhance = async () => {
    if (!plainText.trim()) {
      toast.error('Please write a summary first');
      return;
    }

    setIsEnhancing(true);
    try {
      const { data, error } = await invokeNetlifyFunction('enhance-summary', {
        summary: plainText,
        experiences: resume.experiences,
        skills: resume.skills,
      });

      if (error) throw error;
      if (data?.enhancedSummary) {
        updateSummary(data.enhancedSummary);
        toast.success('Summary enhanced!');
      }
    } catch (error) {
      console.error('Error enhancing summary:', error);
      toast.error('Failed to enhance summary');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Professional Summary
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="gap-2"
          >
            {isEnhancing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Enhance with AI
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary">
            Write a compelling 2-3 sentence summary highlighting your key qualifications
          </Label>
          <RichTextEditor
            content={resume.summary}
            onChange={updateSummary}
            placeholder="Results-driven professional with X years of experience in..."
            minHeight="120px"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
