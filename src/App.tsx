import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Menu, X } from 'lucide-react';
import { Starfield } from './components/Starfield';
import { Home } from './components/Home';
import { Experience } from './components/Experience';
import { Archive } from './components/Archive';
import { cn } from './lib/utils';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-white selection:text-background">
      <Starfield />

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 flex justify-between items-center px-6 md:px-8 py-4 md:py-6",
        isScrolled || menuOpen ? "bg-background/80 backdrop-blur-md md:py-4" : "bg-transparent"
      )}>
        <Link
          to="/"
          className="text-xl font-bold tracking-tighter text-white lowercase font-headline"
        >
          ibraheem_dawod.
        </Link>

        <div className="flex items-center gap-8 md:gap-12">
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/archive"
              className={cn(
                "font-headline font-bold lowercase tracking-tighter transition-colors duration-200",
                location.pathname === '/archive' ? "text-white border-b border-white" : "text-secondary hover:text-white"
              )}
            >
              archive
            </Link>
            <Link
              to="/experience"
              className={cn(
                "font-headline font-bold lowercase tracking-tighter transition-colors duration-200",
                location.pathname === '/experience' ? "text-white border-b border-white" : "text-secondary hover:text-white"
              )}
            >
              experience
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="https://github.com/Digital-Ibraheem" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors duration-200">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/ibraheem-dawod" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors duration-200">
              <Linkedin size={18} />
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[48px] left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-outline/20 flex flex-row items-center justify-center gap-8 py-3 md:hidden"
            >
              <Link
                to="/archive"
                className={cn(
                  "font-headline font-bold lowercase tracking-tighter text-sm py-2 px-4 transition-colors duration-200",
                  location.pathname === '/archive' ? "text-white" : "text-secondary"
                )}
              >
                archive
              </Link>
              <Link
                to="/experience"
                className={cn(
                  "font-headline font-bold lowercase tracking-tighter text-sm py-2 px-4 transition-colors duration-200",
                  location.pathname === '/experience' ? "text-white" : "text-secondary"
                )}
              >
                experience
              </Link>
              <div className="flex items-center gap-4 ml-2">
                <a href="https://github.com/Digital-Ibraheem" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors duration-200">
                  <Github size={16} />
                </a>
                <a href="https://www.linkedin.com/in/ibraheem-dawod" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors duration-200">
                  <Linkedin size={16} />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home onNavigate={(view) => navigate(`/${view === 'home' ? '' : view}`)} />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/experience" element={<Experience />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
