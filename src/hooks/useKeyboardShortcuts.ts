import { useEffect, useCallback } from 'react';

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: ShortcutAction[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ 
  shortcuts, 
  enabled = true 
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow some shortcuts even in input fields
      const isSpecialShortcut = event.ctrlKey && ['s', 'z', 'y'].includes(event.key.toLowerCase());
      if (!isSpecialShortcut) return;
    }

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !(event.ctrlKey || event.metaKey);
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Predefined shortcut configurations
export const createEditorShortcuts = ({
  onSave,
  onUndo,
  onRedo,
  onExport,
  onPreview,
}: {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
  onPreview?: () => void;
}): ShortcutAction[] => {
  const shortcuts: ShortcutAction[] = [];

  if (onSave) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      action: onSave,
      description: 'Save resume',
    });
  }

  if (onUndo) {
    shortcuts.push({
      key: 'z',
      ctrl: true,
      action: onUndo,
      description: 'Undo',
    });
  }

  if (onRedo) {
    shortcuts.push({
      key: 'y',
      ctrl: true,
      action: onRedo,
      description: 'Redo',
    });
    shortcuts.push({
      key: 'z',
      ctrl: true,
      shift: true,
      action: onRedo,
      description: 'Redo (alternative)',
    });
  }

  if (onExport) {
    shortcuts.push({
      key: 'e',
      ctrl: true,
      action: onExport,
      description: 'Export PDF',
    });
  }

  if (onPreview) {
    shortcuts.push({
      key: 'p',
      ctrl: true,
      shift: true,
      action: onPreview,
      description: 'Toggle preview',
    });
  }

  return shortcuts;
};

