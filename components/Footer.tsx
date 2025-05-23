// components/Footer.tsx
import { appVersion } from '@/lib/version';

export default function Footer() {
  return (
    <footer className="text-center text-sm py-4 text-gray-500">
      © 2025 Developed by sitthiphong krobkrong v{appVersion} & update: {(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      })()}
    </footer>
    
  );
}
