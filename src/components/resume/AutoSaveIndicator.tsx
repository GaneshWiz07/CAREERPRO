import React from 'react';
import { Cloud, CloudOff, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  className?: string;
}

export function AutoSaveIndicator({ 
  isSaving, 
  lastSaved, 
  hasUnsavedChanges,
  className 
}: AutoSaveIndicatorProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isSaving) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-xs">Saving...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className={cn("flex items-center gap-2 text-amber-600", className)}>
        <CloudOff className="h-4 w-4" />
        <span className="text-xs">Unsaved changes</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className={cn("flex items-center gap-2 text-green-600", className)}>
        <Cloud className="h-4 w-4" />
        <span className="text-xs">Saved {formatTime(lastSaved)}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
      <Check className="h-4 w-4" />
      <span className="text-xs">All changes saved</span>
    </div>
  );
}

