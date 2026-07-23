import { useEffect } from 'react';

let activeModalCount = 0;

/**
 * Custom hook to completely disable background scrolling while any modal/popup is open.
 * Tracks nested or stacked modals with a reference counter to ensure scrolling stays disabled
 * until all open modals are closed.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    activeModalCount++;
    document.body.style.overflow = 'hidden';
    // For iOS / touch safari momentum scrolling prevention
    document.documentElement.style.overflow = 'hidden';

    return () => {
      activeModalCount--;
      if (activeModalCount <= 0) {
        activeModalCount = 0;
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };
  }, [isLocked]);
}
