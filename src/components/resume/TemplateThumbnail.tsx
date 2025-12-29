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

      case 'executive':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            {/* Formal header - thick border */}
            <div className="text-center mb-2 border-b-2 border-gray-800 pb-1.5">
              <div className="h-3 w-20 bg-gray-900 rounded-sm mx-auto mb-1" />
              <div className="h-1 w-16 bg-gray-500 rounded-sm mx-auto" />
            </div>
            {/* Formal sections with top & bottom borders */}
            <div className="mb-1.5">
              <div className="h-1.5 w-14 bg-gray-800 mb-1 border-t-2 border-b border-gray-800 py-0.5 uppercase tracking-[0.15em]" />
              <div className="h-1 w-full bg-gray-300 rounded-sm" />
            </div>
            <div>
              <div className="h-1.5 w-16 bg-gray-800 mb-1 border-t-2 border-b border-gray-800 py-0.5" />
              <div className="h-1 w-full bg-gray-300 rounded-sm" />
            </div>
          </div>
        );

      case 'technical':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            {/* Left-aligned header with teal border */}
            <div className="mb-2 border-b border-teal-500 pb-1.5">
              <div className="h-2.5 w-16 bg-gray-800 rounded-sm mb-1" />
              <div className="h-1 w-20 bg-gray-400 rounded-sm" />
            </div>
            {/* Section with teal left border */}
            <div className="mb-1.5">
              <div className="h-1.5 w-10 bg-teal-700 mb-1 border-l-4 border-teal-500 pl-1" />
              <div className="flex flex-wrap gap-0.5">
                <div className="h-2 w-5 bg-teal-100 border border-teal-300 rounded-sm" />
                <div className="h-2 w-7 bg-teal-100 border border-teal-300 rounded-sm" />
                <div className="h-2 w-4 bg-teal-100 border border-teal-300 rounded-sm" />
              </div>
            </div>
            {/* Experience */}
            <div>
              <div className="h-1.5 w-14 bg-teal-700 mb-1 border-l-4 border-teal-500 pl-1" />
              <div className="h-1 w-8 bg-teal-600 rounded-sm mb-0.5" />
              <div className="h-1 w-full bg-gray-200 rounded-sm" />
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            {/* Ultra clean left-aligned header */}
            <div className="mb-3">
              <div className="h-3 w-14 bg-gray-900 rounded-sm mb-0.5 font-light" />
              <div className="h-0.5 w-16 bg-gray-300" />
            </div>
            {/* Minimal section headers - small, light */}
            <div className="space-y-2">
              <div>
                <div className="h-1 w-10 bg-gray-400 mb-1 uppercase tracking-[0.1em]" />
                <div className="h-0.5 w-full bg-gray-200" />
                <div className="h-0.5 w-4/5 bg-gray-200 mt-0.5" />
              </div>
              <div>
                <div className="h-1 w-12 bg-gray-400 mb-1 uppercase" />
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="w-full h-full bg-white p-0 flex flex-col overflow-hidden" style={{ fontFamily: 'sans-serif' }}>
            {/* Creative header with gradient background */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 pb-1.5 text-center">
              <div className="h-2.5 w-18 bg-gradient-to-r from-purple-700 to-pink-600 rounded-sm mx-auto mb-1" />
              <div className="h-1 w-14 bg-gray-400 rounded-sm mx-auto" />
            </div>
            {/* Section with purple left border */}
            <div className="p-2 pt-1.5 space-y-1.5">
              <div>
                <div className="h-1.5 w-12 bg-purple-700 mb-1 border-l-4 border-purple-400 pl-1" />
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
              </div>
              <div>
                <div className="h-1.5 w-14 bg-purple-700 mb-1 border-l-4 border-purple-400 pl-1" />
                <div className="h-1 w-10 bg-purple-500 rounded-sm mb-0.5" />
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'compact':
        return (
          <div className="w-full h-full bg-white p-1.5 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            {/* Dense header - name left, contact right */}
            <div className="flex justify-between items-start mb-1 border-b border-gray-300 pb-1">
              <div className="h-2 w-10 bg-gray-800 rounded-sm" />
              <div className="space-y-0.5 text-right">
                <div className="h-0.5 w-8 bg-gray-400 rounded-sm ml-auto" />
                <div className="h-0.5 w-6 bg-gray-400 rounded-sm ml-auto" />
              </div>
            </div>
            {/* Compact dense sections */}
            <div className="space-y-1 flex-1">
              <div>
                <div className="h-1 w-8 bg-gray-600 mb-0.5 uppercase" />
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
              <div>
                <div className="h-1 w-10 bg-gray-600 mb-0.5" />
                <div className="flex justify-between">
                  <div className="h-0.5 w-8 bg-gray-400" />
                  <div className="h-0.5 w-4 bg-gray-300" />
                </div>
                <div className="h-0.5 w-full bg-gray-200 mt-0.5" />
                <div className="h-0.5 w-3/4 bg-gray-200 mt-0.5" />
              </div>
              <div>
                <div className="h-1 w-6 bg-gray-600 mb-0.5" />
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
            </div>
          </div>
        );

      case 'academic':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            {/* Academic formal centered header */}
            <div className="text-center mb-2">
              <div className="h-2.5 w-18 bg-gray-900 rounded-sm mx-auto mb-1" />
              <div className="h-1 w-14 bg-gray-600 rounded-sm mx-auto mb-0.5" />
              <div className="h-1 w-16 bg-gray-400 rounded-sm mx-auto" />
            </div>
            {/* Academic sections with top & bottom borders */}
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-gray-800 mb-1 border-t-2 border-b border-gray-800 py-0.5 uppercase" />
              <div className="h-1 w-12 bg-gray-600 rounded-sm mb-0.5" />
              <div className="h-1 w-full bg-gray-200 rounded-sm" />
            </div>
            <div>
              <div className="h-1.5 w-14 bg-gray-800 mb-1 border-t-2 border-b border-gray-800 py-0.5" />
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
