import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin } from 'lucide-react';
import { Starfield } from './components/Starfield';
import { Home } from './components/Home';
import { Experience } from './components/Experience';
import { Archive } from './components/Archive';
import { cn } from './lib/utils';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-white selection:text-background">
      <Starfield />

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 flex justify-between items-center px-8 py-6",
        isScrolled ? "bg-background/80 backdrop-blur-md py-4" : "bg-transparent"
      )}>
        <Link
          to="/"
          className="text-xl font-bold tracking-tighter text-white lowercase font-headline"
        >
          ibraheem dawod
        </Link>

        <div className="flex items-center gap-12">
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

          <div className="flex items-center gap-6">
            <a href="https://github.com/Digital-Ibraheem" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors duration-200">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/ibraheem-dawod" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors duration-200">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </nav>

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
