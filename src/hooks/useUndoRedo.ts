import { useState, useCallback, useRef, useEffect } from 'react';

interface UseUndoRedoOptions<T> {
  initialState: T;
  maxHistory?: number;
}

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  historyLength: number;
}

export function useUndoRedo<T>({ 
  initialState, 
  maxHistory = 50 
}: UseUndoRedoOptions<T>): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUndoRedoRef = useRef(false);

  const state = history[currentIndex];

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    setHistory(prev => {
      const current = prev[currentIndex];
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(current)
        : newState;

      // Don't add to history if state hasn't changed
      if (JSON.stringify(current) === JSON.stringify(nextState)) {
        return prev;
      }

      // Remove any future states (if we're in the middle of history)
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push(nextState);
      
      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => Math.min(prev + 1, maxHistory - 1));
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isUndoRedoRef.current = true;
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length]);

  const clear = useCallback(() => {
    setHistory([state]);
    setCurrentIndex(0);
  }, [state]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    historyLength: history.length,
  };
}

