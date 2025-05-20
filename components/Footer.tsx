// components/Footer.tsx
import { appVersion } from '@/lib/version';

export default function Footer() {
  return (
    <footer className="text-center text-sm py-4 text-gray-500">
      © 2025 Developed by sitthiphong krobkrong v{appVersion} ...
    </footer>
    
  );
}
