import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, User, ChevronRight, Facebook, Linkedin, Instagram, Moon, Sun, MessageCircle, LogOut } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { companyInfo } = useData();
  const { user, logout } = useAuth();

  const isDashboard = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // keep document + localStorage in sync with state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Who We Are', path: '/about' },
    { name: 'News', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className={`flex flex-col min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
      {/* Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'bg-omega-dark/95 backdrop-blur-sm shadow-lg py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo variant="light" className="scale-75 md:scale-90" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium tracking-wide uppercase hover:text-omega-yellow transition-colors ${
                  (isScrolled || location.pathname !== '/') ? 'text-gray-200' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm font-medium tracking-wide uppercase hover:text-omega-yellow transition-colors ${
                  (isScrolled || location.pathname !== '/') ? 'text-gray-200' : 'text-white'
                }`}
              >
                Admin
              </Link>
            )}
            
            <button 
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              aria-pressed={isDarkMode}
              className={`p-2 rounded-full transition-colors ${isScrolled || location.pathname !== '/' ? 'text-gray-200 hover:bg-white/10' : 'text-white hover:bg-black/10'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wide hover:bg-red-700 transition-all duration-300 rounded-full shadow-md hover:shadow-lg"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2 bg-omega-yellow text-omega-dark font-bold text-xs uppercase tracking-wide hover:bg-white hover:text-omega-blue transition-all duration-300 rounded-full shadow-md hover:shadow-lg"
              >
                <User size={14} />
                Portal
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-omega-dark border-t border-slate-800 shadow-xl flex flex-col p-6 space-y-4 animate-in slide-in-from-top-5">
             {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white text-lg font-display uppercase tracking-wider hover:text-omega-yellow"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="text-white text-lg font-display uppercase tracking-wider hover:text-omega-yellow"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            <button 
               onClick={() => {
                 setIsDarkMode(prev => !prev);
                 setIsMobileMenuOpen(false);
               }}
               className="w-full py-3 bg-white/5 text-white font-bold uppercase rounded-full flex items-center justify-center gap-3"
               aria-label="Toggle theme"
            >
               {isDarkMode ? <Sun size={16} /> : <Moon size={16} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {user ? (
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-red-600 text-white font-bold uppercase rounded-full flex items-center justify-center gap-3"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <button 
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-omega-yellow text-omega-dark font-bold uppercase rounded-full"
              >
                Client Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* WhatsApp Floating Button */}
      <a 
        href={companyInfo.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 p-4 bg-green-500 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center text-white"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Footer */}
      <footer className="bg-omega-dark text-white pt-20 pb-10 border-t-4 border-omega-yellow">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Logo variant="light" className="mb-6 scale-90 origin-left" />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {companyInfo.slogan}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-omega-yellow transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-omega-yellow transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-omega-yellow transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-display uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-omega-yellow"/> Who We Are</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-omega-yellow"/> Our Services</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-omega-yellow"/> Latest News</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-display uppercase tracking-widest">Core Services</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Rope Access</li>
              <li>Lifting Inspection</li>
              <li>NDT Services</li>
              <li>Hull Gauging</li>
              <li>Sandblasting</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 font-display uppercase tracking-widest">Contact Us</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <p className="flex items-start gap-3">
                <span className="text-omega-yellow mt-1">📍</span>
                <span className="text-xs">{companyInfo.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-omega-yellow" />
                <a href={companyInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" aria-label={`Chat on WhatsApp ${companyInfo.phone}`}>{companyInfo.phone}</a>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-omega-yellow">✉️</span>
                <a href={`mailto:${companyInfo.email}`} className="text-xs hover:underline" aria-label={`Email ${companyInfo.email}`}>{companyInfo.email}</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-xs text-gray-500 flex justify-between items-center flex-col md:flex-row">
          <p>© {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
