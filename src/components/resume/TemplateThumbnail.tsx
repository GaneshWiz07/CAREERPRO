import React from 'react';
import { cn } from '@/lib/utils';

interface TemplateThumbnailProps {
  templateId: string;
  className?: string;
}

// Mini visual preview of each template style
export function TemplateThumbnail({ templateId, className }: TemplateThumbnailProps) {
  const getTemplateStyle = () => {
    switch (templateId) {
      case 'classic':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col">
            {/* Header - centered */}
            <div className="flex flex-col items-center mb-2">
              <div className="h-2 w-16 bg-gray-800 rounded-sm mb-1" />
              <div className="h-1 w-24 bg-gray-400 rounded-sm" />
            </div>
            {/* Section */}
            <div className="border-t border-gray-300 pt-1 mb-1">
              <div className="h-1.5 w-12 bg-gray-700 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-300 rounded-sm" />
                <div className="h-1 w-5/6 bg-gray-300 rounded-sm" />
              </div>
            </div>
            {/* Experience */}
            <div className="border-t border-gray-300 pt-1">
              <div className="h-1.5 w-14 bg-gray-700 mb-1" />
              <div className="flex justify-between mb-0.5">
                <div className="h-1 w-12 bg-gray-600 rounded-sm" />
                <div className="h-1 w-8 bg-gray-400 rounded-sm" />
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
          <div className="w-full h-full bg-white p-2 flex flex-col">
            {/* Header with accent line */}
            <div className="mb-2 pb-1 border-b-2 border-blue-500">
              <div className="h-2.5 w-20 bg-gray-900 rounded-sm mb-1" />
              <div className="flex gap-1">
                <div className="h-1 w-8 bg-gray-400 rounded-sm" />
                <div className="h-1 w-8 bg-gray-400 rounded-sm" />
              </div>
            </div>
            {/* Two column layout hint */}
            <div className="flex gap-2 flex-1">
              <div className="flex-1">
                <div className="h-1.5 w-10 bg-blue-600 mb-1 rounded-sm" />
                <div className="space-y-0.5">
                  <div className="h-1 w-full bg-gray-200 rounded-sm" />
                  <div className="h-1 w-3/4 bg-gray-200 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'executive':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col">
            {/* Formal header */}
            <div className="text-center mb-2 border-b border-gray-800 pb-1">
              <div className="h-3 w-24 bg-gray-900 rounded-sm mx-auto mb-1" />
              <div className="h-1 w-20 bg-gray-500 rounded-sm mx-auto" />
            </div>
            {/* Formal sections */}
            <div className="mb-1">
              <div className="h-1.5 w-16 bg-gray-800 mb-1 uppercase" style={{ letterSpacing: '0.05em' }} />
              <div className="h-1 w-full bg-gray-300 rounded-sm" />
            </div>
            <div>
              <div className="h-1.5 w-14 bg-gray-800 mb-1" />
              <div className="h-1 w-full bg-gray-300 rounded-sm" />
            </div>
          </div>
        );

      case 'technical':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col">
            {/* Header */}
            <div className="mb-2">
              <div className="h-2 w-18 bg-gray-800 rounded-sm mb-1" />
              <div className="h-1 w-24 bg-gray-400 rounded-sm" />
            </div>
            {/* Skills emphasis */}
            <div className="mb-1 bg-gray-50 p-1 rounded">
              <div className="h-1.5 w-8 bg-teal-600 mb-1" />
              <div className="flex flex-wrap gap-0.5">
                <div className="h-2 w-6 bg-teal-100 rounded-sm" />
                <div className="h-2 w-8 bg-teal-100 rounded-sm" />
                <div className="h-2 w-5 bg-teal-100 rounded-sm" />
              </div>
            </div>
            {/* Experience */}
            <div>
              <div className="h-1.5 w-10 bg-gray-700 mb-1" />
              <div className="h-1 w-full bg-gray-200 rounded-sm" />
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col">
            {/* Ultra clean header */}
            <div className="mb-3">
              <div className="h-2 w-14 bg-gray-900 rounded-sm mb-0.5" />
              <div className="h-0.5 w-20 bg-gray-300" />
            </div>
            {/* Clean sections */}
            <div className="space-y-2">
              <div>
                <div className="h-1 w-8 bg-gray-500 mb-0.5 uppercase" />
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
              <div>
                <div className="h-1 w-10 bg-gray-500 mb-0.5" />
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-50 to-white p-2 flex flex-col">
            {/* Creative header with accent */}
            <div className="mb-2">
              <div className="h-2.5 w-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-sm mb-1" />
              <div className="h-1 w-16 bg-gray-400 rounded-sm" />
            </div>
            {/* Accent sidebar effect */}
            <div className="flex gap-1 flex-1">
              <div className="w-0.5 bg-gradient-to-b from-purple-400 to-pink-400 rounded" />
              <div className="flex-1 space-y-1">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'compact':
        return (
          <div className="w-full h-full bg-white p-1.5 flex flex-col text-[6px]">
            {/* Dense header */}
            <div className="flex justify-between items-start mb-1 border-b border-gray-200 pb-0.5">
              <div className="h-2 w-12 bg-gray-800 rounded-sm" />
              <div className="flex gap-0.5">
                <div className="h-1 w-4 bg-gray-400 rounded-sm" />
                <div className="h-1 w-4 bg-gray-400 rounded-sm" />
              </div>
            </div>
            {/* Compact sections */}
            <div className="space-y-0.5 flex-1">
              <div className="h-1 w-6 bg-gray-600" />
              <div className="h-0.5 w-full bg-gray-200" />
              <div className="h-1 w-8 bg-gray-600" />
              <div className="h-0.5 w-full bg-gray-200" />
              <div className="h-0.5 w-3/4 bg-gray-200" />
            </div>
          </div>
        );

      case 'academic':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col">
            {/* Academic formal header */}
            <div className="text-center mb-2">
              <div className="h-2.5 w-22 bg-gray-900 rounded-sm mx-auto mb-1" />
              <div className="h-1 w-16 bg-gray-500 rounded-sm mx-auto mb-0.5" />
              <div className="h-1 w-20 bg-gray-400 rounded-sm mx-auto" />
            </div>
            {/* Education emphasis */}
            <div className="border-t-2 border-gray-800 pt-1 mb-1">
              <div className="h-1.5 w-12 bg-gray-800 mb-0.5" />
              <div className="h-1 w-full bg-gray-300 rounded-sm" />
            </div>
            <div className="border-t border-gray-300 pt-1">
              <div className="h-1.5 w-14 bg-gray-700 mb-0.5" />
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
