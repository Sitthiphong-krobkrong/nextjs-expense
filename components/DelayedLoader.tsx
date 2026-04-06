'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from '../app/hooks/useLanguage';

export default function DelayedLoader({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-sm font-medium">
            {lang === "th" ? "กำลังโหลด..." : "Loading..."}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
