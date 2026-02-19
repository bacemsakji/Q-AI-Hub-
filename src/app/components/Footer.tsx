import { Linkedin, Github, Instagram } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="relative z-10 bg-[#0A0E1A] border-t border-white/8 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Logo + Tagline + Socials */}
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="text-[#8892A4] text-sm">
              The Gateway to Tech Ventures
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8892A4] hover:text-[#00F5A0] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8892A4] hover:text-[#00F5A0] transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8892A4] hover:text-[#00F5A0] transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Center: Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#vision" className="text-[#8892A4] hover:text-white transition-colors text-sm">
                  Vision
                </a>
              </li>
              <li>
                <a href="#programs" className="text-[#8892A4] hover:text-white transition-colors text-sm">
                  Programs
                </a>
              </li>
              <li>
                <a href="#events" className="text-[#8892A4] hover:text-white transition-colors text-sm">
                  Events
                </a>
              </li>
              <li>
                <a href="#apply" className="text-[#8892A4] hover:text-white transition-colors text-sm">
                  Apply
                </a>
              </li>
            </ul>
          </div>

          {/* Right: Contact */}
          <div>
            <h4 className="text-white mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-[#8892A4]">
              <p>ENICarthage</p>
              <p>Technological Campus</p>
              <p>contact@qai-hub.tn</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/8 text-center text-sm text-[#8892A4]">
          <p>© 2026 Q-Ai Hub. All rights reserved. Powered by ENICarthage</p>
        </div>
      </div>
    </footer>
  );
}
