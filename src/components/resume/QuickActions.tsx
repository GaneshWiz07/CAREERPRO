import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Undo2, 
  Redo2, 
  Copy, 
  Trash2, 
  RotateCcw,
  Wand2,
  FileText,
  Download,
  MoreHorizontal,
  Sparkles,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onDuplicate?: () => void;
  onReset?: () => void;
  onExportText?: () => void;
  onAIEnhance?: () => void;
  onPreview?: () => void;
  className?: string;
}

export function QuickActions({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onDuplicate,
  onReset,
  onExportText,
  onAIEnhance,
  onPreview,
  className,
}: QuickActionsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-muted/50 border", className)}>
        {/* Undo/Redo */}
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Quick Actions */}
        {onAIEnhance && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={onAIEnhance}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">AI Enhance</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Enhance with AI suggestions</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onPreview && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={onPreview}
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Preview resume</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>More actions</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            {onDuplicate && (
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Resume
              </DropdownMenuItem>
            )}
            {onExportText && (
              <DropdownMenuItem onClick={onExportText}>
                <Download className="h-4 w-4 mr-2" />
                Export as Text
              </DropdownMenuItem>
            )}
            {onReset && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onReset} className="text-destructive">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}

