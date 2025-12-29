import React from 'react';
import { cn } from '@/lib/utils';

interface TemplateThumbnailProps {
  templateId: string;
  className?: string;
}

// Mini visual preview of each template style - matches actual template rendering
export function TemplateThumbnail({ templateId, className }: TemplateThumbnailProps) {
  const getTemplateStyle = () => {
    switch (templateId) {
      case 'classic':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header - centered with gray border */}
            <div className="flex flex-col items-center mb-2 border-b border-gray-400 pb-1.5">
              <div className="h-2.5 w-16 bg-gray-800 rounded-sm mb-1" />
              <div className="h-1 w-20 bg-gray-400 rounded-sm" />
            </div>
            {/* Section with gray border */}
            <div className="mb-1.5">
              <div className="h-1.5 w-14 bg-gray-700 mb-1 border-b border-gray-400 pb-0.5 uppercase text-[4px] tracking-wider" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-300 rounded-sm" />
                <div className="h-1 w-5/6 bg-gray-300 rounded-sm" />
              </div>
            </div>
            {/* Experience */}
            <div>
              <div className="h-1.5 w-16 bg-gray-700 mb-1 border-b border-gray-400 pb-0.5" />
              <div className="flex justify-between mb-0.5">
                <div className="h-1 w-10 bg-gray-600 rounded-sm" />
                <div className="h-1 w-6 bg-gray-400 rounded-sm" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'modern':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            {/* Header with blue accent border */}
            <div className="mb-2 pb-1.5 border-b-2 border-blue-600 text-center">
              <div className="h-2.5 w-18 bg-gray-900 rounded-sm mb-1 mx-auto" />
              <div className="flex gap-1 justify-center">
                <div className="h-1 w-6 bg-gray-400 rounded-sm" />
                <div className="h-1 w-6 bg-gray-400 rounded-sm" />
              </div>
            </div>
            {/* Section with blue header */}
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-blue-700 mb-1 border-b-2 border-blue-200 pb-0.5" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-3/4 bg-gray-200 rounded-sm" />
              </div>
            </div>
            {/* Experience */}
            <div>
              <div className="h-1.5 w-14 bg-blue-700 mb-1 border-b-2 border-blue-200 pb-0.5" />
              <div className="h-1 w-10 bg-blue-600 rounded-sm mb-0.5" />
              <div className="h-1 w-full bg-gray-200 rounded-sm" />
            </div>
          </div>
        );



      default:
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col items-center justify-center">
            <div className="h-2 w-16 bg-gray-300 rounded-sm" />
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "w-full aspect-[8.5/11] rounded border border-border overflow-hidden shadow-sm",
      className
    )}>
      {getTemplateStyle()}
    </div>
  );
}
