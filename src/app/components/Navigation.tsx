import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { Button } from './Button';
import { useTheme } from '../context/useTheme';

interface NavigationProps {
  isLoggedIn?: boolean;
  userRole?: 'student' | 'admin';
}

export function Navigation({ isLoggedIn = false, userRole }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Vision', href: '/#vision' },
    { name: 'Programs', href: '/#programs' },
    { name: 'Research', href: '/#research' },
    { name: 'About', href: '/#about' },
    { name: 'Partners', href: '/#stats-section' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
        ? 'glass-strong border-border shadow-soft'
        : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center">
          {/* Logo - Start */}
          <div className="flex justify-start">
            <Link to="/">
              <Logo size="sm" />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex justify-center">
            <div className="flex items-center gap-8">
              {navLinks.map((link) =>
                link.href.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300" />
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300" />
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Right section (Auth Buttons or Mobile Toggle) */}
          <div className="flex justify-end gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg transition-colors hover:bg-white/10 border border-white/10 hover:border-white/20"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <Link to={userRole === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="primary">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary">Join Us</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) =>
                link.href.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <div className="pt-4 space-y-3 border-t border-border">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors bg-foreground/5 hover:bg-foreground/10 border border-white/10"
                >
                  {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
                  <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                {isLoggedIn ? (
                  <Link to={userRole === 'admin' ? '/admin' : '/dashboard'}>
                    <Button variant="primary" fullWidth>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" fullWidth>
                        Log In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" fullWidth>
                        Join Us
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
