import { useState, useEffect } from "react";
import { Search, ChevronDown, Bell, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-black/80'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4 sm:px-6 md:px-12 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left Navigation - Always visible */}
            <nav className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
              <div 
                className="font-bold tracking-tight leading-none" 
                style={{ 
                  fontFamily: 'Bebas Neue, Arial Black, sans-serif',
                  fontSize: 'clamp(1.2rem, 3vw, 2.5rem)',
                  fontWeight: '900',
                  color: '#E50914',
                  letterSpacing: '-0.02em'
                }}
              >
                InBetaByPriya
              </div>
              <ul className="flex space-x-3 sm:space-x-4 md:space-x-6">
                <li>
                  <Link href="/">
                    <button className="text-xs sm:text-sm hover:text-netflix-light-gray transition-colors duration-200">
                      Home
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/projects">
                    <button className="text-xs sm:text-sm hover:text-netflix-light-gray transition-colors duration-200">
                      Projects
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <button className="text-xs sm:text-sm hover:text-netflix-light-gray transition-colors duration-200">
                      Contact
                    </button>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Right Icons - Hidden on mobile, replaced with hamburger */}
            <div className="flex items-center">
              {/* Desktop/Tablet Icons */}
              <div className="hidden md:flex items-center space-x-4">
                <button className="p-2 hover:bg-white/10 rounded transition-all duration-200">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded transition-all duration-200">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Mobile Hamburger Menu */}
              <button 
                className="md:hidden p-2 hover:bg-white/10 rounded transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              className="absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="px-4 py-6">
                {/* Mobile Icons Section */}
                <div className="flex items-center justify-center space-x-6 mb-6 pb-6 border-b border-gray-800">
                  <button className="p-3 hover:bg-white/10 rounded transition-all duration-200">
                    <Search className="w-6 h-6" />
                  </button>
                  <button className="p-3 hover:bg-white/10 rounded transition-all duration-200">
                    <Bell className="w-6 h-6" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}