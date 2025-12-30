import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoSaveOptions {
  data: any;
  onSave: () => void;
  interval?: number; // in milliseconds
  debounce?: number; // in milliseconds
}

interface AutoSaveStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export function useAutoSave({ 
  data, 
  onSave, 
  interval = 30000, // 30 seconds
  debounce = 2000 // 2 seconds
}: UseAutoSaveOptions): AutoSaveStatus {
  const [status, setStatus] = useState<AutoSaveStatus>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
  });
  
  const previousDataRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);

  const save = useCallback(() => {
    setStatus(prev => ({ ...prev, isSaving: true }));
    
    try {
      onSave();
      setStatus({
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      setStatus(prev => ({ ...prev, isSaving: false }));
    }
  }, [onSave]);

  // Detect changes and trigger debounced save
  useEffect(() => {
    const currentData = JSON.stringify(data);
    
    if (previousDataRef.current && previousDataRef.current !== currentData) {
      setStatus(prev => ({ ...prev, hasUnsavedChanges: true }));
      
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        save();
      }, debounce);
    }
    
    previousDataRef.current = currentData;
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, debounce, save]);

  // Periodic save interval
  useEffect(() => {
    intervalTimerRef.current = setInterval(() => {
      if (status.hasUnsavedChanges) {
        save();
      }
    }, interval);

    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, [interval, status.hasUnsavedChanges, save]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status.hasUnsavedChanges) {
        save();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status.hasUnsavedChanges, save]);

  return status;
}

