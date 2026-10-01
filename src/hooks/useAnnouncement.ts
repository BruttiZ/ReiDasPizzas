import { useEffect, useState } from 'react';

export function useAnnouncement() {
  const [announcement, announce] = useState('');

  useEffect(() => {
    if (!announcement) return;
    const timer = window.setTimeout(() => announce(''), 4000);
    return () => window.clearTimeout(timer);
  }, [announcement]);

  return { announcement, announce, dismiss: () => announce('') };
}
