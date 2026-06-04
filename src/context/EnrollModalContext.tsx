import React, {
  createContext, useCallback, useContext, useState,
} from 'react';

type ContextValue = {
  open:             (presetCourseCode?: string) => void;
  close:            () => void;
  isOpen:           boolean;
  presetCourseCode?: string;
};

export const EnrollModalContext = createContext<ContextValue | null>(null);

export function EnrollModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen,           setIsOpen]           = useState(false);
  const [presetCourseCode, setPresetCourseCode] = useState<string | undefined>();

  const open = useCallback((courseCode?: string) => {
    setPresetCourseCode(courseCode);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPresetCourseCode(undefined);
  }, []);

  return (
    <EnrollModalContext.Provider value={{ open, close, isOpen, presetCourseCode }}>
      {children}
    </EnrollModalContext.Provider>
  );
}

export function useEnrollModal(): ContextValue {
  const ctx = useContext(EnrollModalContext);
  if (!ctx) throw new Error('useEnrollModal must be used inside <EnrollModalProvider>');
  return ctx;
}
