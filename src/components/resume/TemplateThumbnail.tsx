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

      case 'elegant':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            {/* Header with elegant purple accent */}
            <div className="mb-2 pb-1.5 border-b border-purple-300 text-center">
              <div className="h-2.5 w-18 bg-gray-800 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-20 bg-purple-400 rounded-sm mx-auto" />
            </div>
            {/* Section with purple accent */}
            <div className="mb-1.5">
              <div className="flex items-center gap-1 mb-1">
                <div className="h-1.5 w-1.5 bg-purple-500 rounded-full" />
                <div className="h-1.5 w-12 bg-gray-700" />
              </div>
              <div className="space-y-0.5 pl-2">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-gray-200 rounded-sm" />
              </div>
            </div>
            {/* Experience */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <div className="h-1.5 w-1.5 bg-purple-500 rounded-full" />
                <div className="h-1.5 w-14 bg-gray-700" />
              </div>
              <div className="pl-2 space-y-0.5">
                <div className="h-1 w-10 bg-purple-400 rounded-sm" />
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'flat':
        return (
          <div className="w-full h-full bg-white p-2.5 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            {/* Header - minimal flat style */}
            <div className="mb-2.5 text-center">
              <div className="h-3 w-20 bg-gray-900 rounded-none mb-1 mx-auto" />
              <div className="h-1 w-16 bg-gray-400 mx-auto" />
            </div>
            {/* Section - flat, no borders */}
            <div className="mb-2">
              <div className="h-1.5 w-10 bg-gray-900 mb-1.5" />
              <div className="space-y-1">
                <div className="h-1 w-full bg-gray-200" />
                <div className="h-1 w-5/6 bg-gray-200" />
              </div>
            </div>
            {/* Experience - clean flat design */}
            <div>
              <div className="h-1.5 w-12 bg-gray-900 mb-1.5" />
              <div className="h-1 w-8 bg-gray-500 mb-0.5" />
              <div className="h-1 w-full bg-gray-200" />
            </div>
          </div>
        );

      case 'onepage':
        return (
          <div className="w-full h-full bg-white p-1.5 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            {/* Compact header */}
            <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-gray-300">
              <div className="h-2 w-14 bg-gray-900 rounded-sm" />
              <div className="flex flex-col items-end gap-0.5">
                <div className="h-0.5 w-10 bg-gray-400" />
                <div className="h-0.5 w-8 bg-gray-400" />
              </div>
            </div>
            {/* Compact sections */}
            <div className="mb-1">
              <div className="h-1 w-8 bg-teal-600 mb-0.5" />
              <div className="h-0.5 w-full bg-gray-200" />
              <div className="h-0.5 w-4/5 bg-gray-200 mt-0.5" />
            </div>
            <div className="mb-1">
              <div className="h-1 w-10 bg-teal-600 mb-0.5" />
              <div className="flex justify-between">
                <div className="h-0.5 w-8 bg-gray-500" />
                <div className="h-0.5 w-4 bg-gray-400" />
              </div>
              <div className="h-0.5 w-full bg-gray-200 mt-0.5" />
            </div>
            <div>
              <div className="h-1 w-6 bg-teal-600 mb-0.5" />
              <div className="h-0.5 w-full bg-gray-200" />
            </div>
          </div>
        );

      case 'spartan':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            {/* Bold header with dark accent bar */}
            <div className="mb-2">
              <div className="h-4 w-full bg-gray-900 mb-1 flex items-center justify-center">
                <div className="h-2 w-16 bg-white rounded-sm" />
              </div>
              <div className="flex gap-1 justify-center">
                <div className="h-0.5 w-6 bg-gray-500" />
                <div className="h-0.5 w-6 bg-gray-500" />
              </div>
            </div>
            {/* Section with bold header */}
            <div className="mb-1.5">
              <div className="h-2 w-14 bg-gray-800 mb-1" />
              <div className="space-y-0.5">
                <div className="h-0.5 w-full bg-gray-300" />
                <div className="h-0.5 w-4/5 bg-gray-300" />
              </div>
            </div>
            {/* Experience */}
            <div>
              <div className="h-2 w-16 bg-gray-800 mb-1" />
              <div className="h-0.5 w-10 bg-gray-600 mb-0.5" />
              <div className="h-0.5 w-full bg-gray-300" />
            </div>
          </div>
        );

      case 'stackoverflow':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            {/* Header with orange accent */}
            <div className="mb-2 pb-1.5 border-b-2 border-orange-500 text-center">
              <div className="h-2.5 w-18 bg-gray-900 rounded-sm mb-1 mx-auto" />
              <div className="flex gap-1 justify-center">
                <div className="h-1 w-6 bg-orange-400 rounded-sm" />
                <div className="h-1 w-6 bg-gray-400 rounded-sm" />
              </div>
            </div>
            {/* Section with tag-like styling */}
            <div className="mb-1.5">
              <div className="h-1.5 w-10 bg-orange-600 mb-1 rounded-sm" />
              <div className="flex flex-wrap gap-0.5">
                <div className="h-1 w-4 bg-blue-100 border border-blue-300 rounded-sm" />
                <div className="h-1 w-5 bg-blue-100 border border-blue-300 rounded-sm" />
                <div className="h-1 w-3 bg-blue-100 border border-blue-300 rounded-sm" />
              </div>
            </div>
            {/* Experience */}
            <div>
              <div className="h-1.5 w-12 bg-orange-600 mb-1 rounded-sm" />
              <div className="h-1 w-10 bg-gray-600 rounded-sm mb-0.5" />
              <div className="h-1 w-full bg-gray-200 rounded-sm" />
            </div>
          </div>
        );

      // New template thumbnails
      case 'kendall':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b border-slate-400 text-center">
              <div className="h-2.5 w-18 bg-slate-700 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-slate-400 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-slate-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-slate-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-slate-200 rounded-sm" />
              </div>
            </div>
            <div>
              <div className="h-1.5 w-14 bg-slate-600 mb-1" />
              <div className="h-1 w-10 bg-slate-500 rounded-sm mb-0.5" />
              <div className="h-1 w-full bg-slate-200 rounded-sm" />
            </div>
          </div>
        );

      case 'paper':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            <div className="mb-2 pb-1 border-b-2 border-gray-900 text-center">
              <div className="h-3 w-20 bg-gray-900 mb-1 mx-auto" />
              <div className="h-1 w-14 bg-gray-500 mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-2 w-16 bg-gray-900 mb-1 border-b border-gray-300" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-300" />
                <div className="h-1 w-5/6 bg-gray-300" />
              </div>
            </div>
          </div>
        );

      case 'macchiato':
        return (
          <div className="w-full h-full bg-amber-50 p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b border-amber-600 text-center">
              <div className="h-2.5 w-18 bg-amber-900 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-amber-600 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-amber-800 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-amber-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-amber-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'crisp':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b-4 border-gray-900 text-center">
              <div className="h-3 w-20 bg-gray-900 mb-1 mx-auto" />
              <div className="h-1 w-16 bg-gray-600 mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-2 w-14 bg-gray-900 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200" />
                <div className="h-1 w-5/6 bg-gray-200" />
              </div>
            </div>
          </div>
        );

      case 'classy':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            <div className="mb-2 pb-1.5 border-b border-yellow-600 text-center">
              <div className="h-2.5 w-18 bg-gray-800 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-yellow-600 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-yellow-700 mb-1 border-b border-yellow-300" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'refined':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b border-emerald-400 text-center">
              <div className="h-2.5 w-18 bg-gray-800 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-emerald-500 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-emerald-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-emerald-100 rounded-sm" />
                <div className="h-1 w-4/5 bg-emerald-100 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'executive':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-blue-900 text-center">
              <div className="h-2.5 w-18 bg-blue-900 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-blue-700 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-blue-900 mb-1 border-b border-blue-300" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'nordic':
        return (
          <div className="w-full h-full bg-gray-50 p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b border-teal-500 text-center">
              <div className="h-2.5 w-18 bg-gray-800 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-teal-500 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-teal-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'tokyo':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-red-600 text-center">
              <div className="h-2.5 w-18 bg-gray-900 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-red-600 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-red-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'fresh':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-lime-500 text-center">
              <div className="h-2.5 w-18 bg-gray-800 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-lime-500 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-lime-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-lime-100 rounded-sm" />
                <div className="h-1 w-4/5 bg-lime-100 rounded-sm" />
              </div>
            </div>
          </div>
        );

      // 10 New Template Thumbnails
      case 'aurora':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-violet-500 text-center">
              <div className="h-2.5 w-18 bg-violet-800 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-violet-400 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-violet-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-violet-100 rounded-sm" />
                <div className="h-1 w-4/5 bg-violet-100 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'berlin':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b-4 border-gray-800 text-center">
              <div className="h-3 w-20 bg-gray-900 mb-1 mx-auto" />
              <div className="h-1 w-16 bg-gray-600 mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-2 w-14 bg-gray-800 mb-1 px-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200" />
                <div className="h-1 w-5/6 bg-gray-200" />
              </div>
            </div>
          </div>
        );

      case 'cambridge':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-green-800 text-center">
              <div className="h-2.5 w-18 bg-green-900 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-green-600 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-green-800 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-green-100 rounded-sm" />
                <div className="h-1 w-4/5 bg-green-100 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'dubai':
        return (
          <div className="w-full h-full bg-gray-50 p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-yellow-500 text-center">
              <div className="h-2.5 w-18 bg-gray-900 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-yellow-500 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-yellow-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'ember':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-rose-400 text-center">
              <div className="h-2.5 w-18 bg-rose-700 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-rose-400 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-rose-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-rose-100 rounded-sm" />
                <div className="h-1 w-4/5 bg-rose-100 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'fortune':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-rose-900 text-center">
              <div className="h-2.5 w-18 bg-rose-900 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-rose-700 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-rose-900 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-rose-100 rounded-sm" />
                <div className="h-1 w-4/5 bg-rose-100 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'glacier':
        return (
          <div className="w-full h-full bg-cyan-50 p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-cyan-500 text-center">
              <div className="h-2.5 w-18 bg-cyan-800 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-cyan-500 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-cyan-700 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-cyan-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-cyan-200 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'harmony':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b border-purple-400 text-center">
              <div className="h-2.5 w-18 bg-purple-800 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-purple-400 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-purple-600 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-purple-100 rounded-sm" />
                <div className="h-1 w-4/5 bg-purple-100 rounded-sm" />
              </div>
            </div>
          </div>
        );

      case 'iconic':
        return (
          <div className="w-full h-full bg-white p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 bg-gray-900 -mx-2 -mt-2 px-2 pt-2 pb-1.5 border-b-4 border-yellow-400 text-center">
              <div className="h-3 w-20 bg-yellow-400 mb-1 mx-auto" />
              <div className="h-1 w-16 bg-gray-600 mx-auto" />
            </div>
            <div className="mb-1.5 mt-1">
              <div className="h-2 w-14 bg-yellow-400 mb-1 inline-block" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-gray-200" />
                <div className="h-1 w-5/6 bg-gray-200" />
              </div>
            </div>
          </div>
        );

      case 'jasper':
        return (
          <div className="w-full h-full bg-orange-50 p-2 flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="mb-2 pb-1.5 border-b-2 border-orange-700 text-center">
              <div className="h-2.5 w-18 bg-orange-900 rounded-sm mb-1 mx-auto" />
              <div className="h-1 w-16 bg-orange-600 rounded-sm mx-auto" />
            </div>
            <div className="mb-1.5">
              <div className="h-1.5 w-12 bg-orange-800 mb-1" />
              <div className="space-y-0.5">
                <div className="h-1 w-full bg-orange-200 rounded-sm" />
                <div className="h-1 w-4/5 bg-orange-200 rounded-sm" />
              </div>
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
