import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Mail, MapPin, ArrowRight, Construction, Hammer, HardHat, Ruler, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// --- Components ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="custom-cursor hidden lg:block"
      animate={{
        x: position.x - 10,
        y: position.y - 10,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(245, 147, 27, 0.3)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-bam-black/90 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group relative z-[60]">
          <div className="relative">
            <img 
              src="https://i.imgur.com/WWZSWye.png" 
              alt="BAM Contracting Logo" 
              className="h-12 md:h-20 w-auto object-contain transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" 
              referrerPolicy="no-referrer"
            />
            <motion.div 
              className="absolute -inset-2 bg-bam-orange/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative group py-2"
            >
              <span className={`text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 ${location.pathname === link.path ? 'text-bam-orange' : 'text-white/60 group-hover:text-white'}`}>
                {link.name}
              </span>
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-bam-orange"
                initial={{ width: 0 }}
                animate={{ width: location.pathname === link.path ? '100%' : 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
          <Link to="/contact" className="relative overflow-hidden group bg-bam-orange text-bam-charcoal px-8 py-3 font-black uppercase text-xs tracking-widest transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,147,27,0.4)]">
            <span className="relative z-10">Request Quote</span>
            <motion.div 
              className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            />
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white relative z-[60] w-10 h-10 flex items-center justify-center" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <div className="relative w-6 h-5">
            <span className={`absolute left-0 block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'top-2 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-2 block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute left-0 block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'top-2 -rotate-45' : 'top-4'}`} />
          </div>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 w-full h-screen bg-bam-black z-50 flex flex-col justify-center px-12"
          >
            <div className="absolute top-0 left-0 w-full h-full industrial-grid opacity-[0.05]" />
            <div className="relative z-10 flex flex-col gap-8">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={linkVariants}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-end gap-4"
                  >
                    <span className="text-bam-orange font-mono text-sm mb-2 opacity-50">0{navLinks.indexOf(link) + 1}</span>
                    <span className={`text-5xl md:text-7xl font-black uppercase tracking-tighter transition-all duration-300 group-hover:text-bam-orange group-hover:pl-4 ${location.pathname === link.path ? 'text-bam-orange' : 'text-white'}`}>
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={linkVariants} className="mt-12">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-block bg-bam-orange text-bam-charcoal px-12 py-6 font-black uppercase text-sm tracking-widest"
                >
                  Request Quote
                </Link>
              </motion.div>
            </div>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center border-t border-white/10 pt-8">
              <div className="flex gap-6">
                {['IG', 'LI', 'FB'].map((s) => (
                  <a key={s} href="#" className="text-white/40 hover:text-bam-orange font-black text-xs tracking-widest">{s}</a>
                ))}
              </div>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">© 2026 BAM</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-bam-black text-white py-32 border-t border-white/5 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full industrial-grid opacity-[0.02]" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-32">
        <div className="lg:col-span-6">
          <Link to="/" className="flex items-center gap-6 group mb-12">
            <img 
              src="https://i.imgur.com/WWZSWye.png" 
              alt="BAM Contracting Logo" 
              className="h-28 w-auto object-contain transform group-hover:scale-110 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </Link>
          <p className="text-2xl text-white/30 max-w-md font-medium leading-relaxed">
            Delivering the structural backbone of high-end architecture since 2011. Built strong. Built right.
          </p>
        </div>
        
        <div className="lg:col-span-3">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-bam-orange mb-10">Navigation</h4>
          <ul className="space-y-6">
            {[
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
              { name: 'Projects', path: '/projects' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-xl font-bold text-white/50 hover:text-white transition-colors">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-3">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-bam-orange mb-10">Contact</h4>
          <ul className="space-y-6 text-xl font-bold text-white/50">
            <li>(555) 123-4567</li>
            <li>hello@bamcontracting.com</li>
            <li className="text-white/30 font-medium text-lg leading-relaxed">123 Construction Way,<br />Builder City, BC 12345</li>
          </ul>
        </div>
      </div>
      
      <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-white/20 text-xs font-bold uppercase tracking-widest">
          © 2026 BAM Contracting. All rights reserved.
        </p>
        <div className="flex gap-12">
          {['Instagram', 'LinkedIn', 'Facebook'].map((social) => (
            <a key={social} href="#" className="text-white/20 hover:text-bam-orange text-xs font-black uppercase tracking-widest transition-colors">{social}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Home = () => {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img 
            src="https://img.freepik.com/free-photo/view-modern-construction-site_23-2151317323.jpg?semt=ais_hybrid&w=740&q=80" 
            alt="Construction framing" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bam-black via-bam-black/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-3 bg-bam-orange/10 border border-bam-orange/20 text-bam-orange px-4 py-2 font-black uppercase text-[10px] tracking-[0.3em] mb-8">
                <div className="w-2 h-2 bg-bam-orange animate-pulse" />
                General Contracting & Framing
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black leading-[0.8] mb-10 tracking-tighter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              BUILT <span className="text-bam-orange">STRONG.</span><br />
              BUILT <span className="text-stroke">RIGHT.</span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-2xl text-white/50 max-w-2xl mb-14 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              We deliver the structural backbone of high-end residential and commercial architecture. Precision execution. No excuses.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Link to="/contact" className="relative overflow-hidden group bg-bam-orange text-bam-charcoal px-12 py-6 font-black uppercase text-sm tracking-widest transition-all duration-500 hover:shadow-[0_0_50px_rgba(245,147,27,0.3)] text-center">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Start Your Project <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                />
              </Link>
              <Link to="/projects" className="relative overflow-hidden group border border-white/20 text-white px-12 py-6 font-black uppercase text-sm tracking-widest transition-all duration-500 hover:border-white text-center">
                <span className="relative z-10">View Portfolio</span>
                <motion.div 
                  className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                />
              </Link>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-bam-orange to-transparent" />
        </motion.div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white text-bam-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full industrial-grid opacity-[0.03]" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end mb-32">
            <div className="lg:col-span-8">
              <motion.span 
                className="text-bam-orange font-black uppercase tracking-[0.3em] text-xs mb-6 block"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                Our Expertise
              </motion.span>
              <h2 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                THE FOUNDATION OF <br />
                <span className="text-bam-orange">EXCELLENCE.</span>
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link to="/services" className="inline-flex items-center gap-4 text-bam-black font-black uppercase tracking-widest text-sm group">
                Explore All Services 
                <div className="w-12 h-12 rounded-full border border-bam-black flex items-center justify-center group-hover:bg-bam-black group-hover:text-white transition-all duration-500">
                  <ArrowRight size={20} />
                </div>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bam-black/5 border border-bam-black/5">
            {[
              { icon: Hammer, title: 'Precision Framing', desc: 'The structural backbone of every great build. We deliver laser-accurate framing for complex architectural designs.' },
              { icon: HardHat, title: 'General Contracting', desc: 'Full-scale project management. We handle the logistics, the crew, and the quality control from start to finish.' },
              { icon: Ruler, title: 'Structural Builds', desc: 'Specialized structural solutions for residential and commercial projects that require extreme durability.' }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-16 bg-white hover:bg-bam-black hover:text-white transition-all duration-700 group"
              >
                <div className="w-16 h-16 bg-bam-orange/10 flex items-center justify-center mb-12 group-hover:bg-bam-orange transition-colors duration-500">
                  <service.icon className="w-8 h-8 text-bam-orange group-hover:text-bam-black transition-colors duration-500" />
                </div>
                <h3 className="text-4xl font-black mb-6 tracking-tighter">{service.title}</h3>
                <p className="text-lg opacity-60 leading-relaxed mb-12">{service.desc}</p>
                <div className="flex items-center gap-4 font-black uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Learn More <ArrowRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BAM */}
      <section className="section-padding bg-bam-black relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-bam-orange/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <motion.div 
                className="relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <img 
                  src="https://instagram.fdac2-1.fna.fbcdn.net/v/t39.30808-6/456409539_18051991750838263_8507368182213507346_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=100&ig_cache_key=MzQzOTQ3ODkyMzM1OTM4NzgxMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5oZHIuQzMifQ%3D%3D&_nc_ohc=RGkD0K14f4oQ7kNvwH0wRZ7&_nc_oc=AdrTUV32qhI6xiAguKlVOiJaQseZ4vqmFutZTHSlYha0TtVXskp_L-u1DlzAJy1EbVA&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-1.fna&_nc_gid=M4V6EhG90BDXBwHtrBwaRg&_nc_ss=7a32e&oh=00_Af3Cka3uS0EttMSC5665g3A0YLx0xry7xP29frkktZfR-g&oe=69DD71E9" 
                  alt="Construction site" 
                  className="w-full aspect-[4/5] object-cover transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 bg-bam-orange p-16 hidden md:block shadow-[20px_20px_60px_rgba(0,0,0,0.5)]">
                <span className="block text-bam-charcoal font-black text-8xl leading-none tracking-tighter">15+</span>
                <span className="block text-bam-charcoal font-bold uppercase tracking-[0.2em] text-xs mt-2">Years of Excellence</span>
              </div>
            </div>
            <div>
              <motion.h2 
                className="text-6xl md:text-8xl font-black leading-[0.9] mb-16 tracking-tighter"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                WHY <span className="text-bam-orange">BAM?</span>
              </motion.h2>
              <div className="space-y-16">
                {[
                  { title: 'Reliable Crew', desc: 'Our team shows up on time and works until the job is done right. No excuses, just results.' },
                  { title: 'Precision Framing', desc: 'We measure twice and cut once. Our framing is straight, true, and built to last for generations.' },
                  { title: 'Strong Results', desc: 'We don\'t just build structures; we build reputations. Our work speaks for itself in every joint and beam.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-8"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <span className="text-bam-orange font-black text-3xl opacity-20">0{i+1}</span>
                    <div>
                      <h4 className="text-3xl font-black uppercase mb-4 tracking-tighter">{item.title}</h4>
                      <p className="text-white/40 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/contact" className="mt-20 inline-flex items-center gap-4 bg-white text-bam-black px-12 py-6 font-black uppercase text-sm tracking-widest hover:bg-bam-orange transition-colors duration-500">
                  Partner With Us <ArrowRight />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="section-padding bg-bam-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="text-6xl md:text-8xl font-black leading-none tracking-tighter">
              LATEST <span className="text-bam-orange">WORKS</span>
            </h2>
            <Link to="/projects" className="text-white/40 hover:text-bam-orange font-black uppercase tracking-widest text-xs transition-colors">
              View Full Portfolio
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "https://instagram.fdac2-1.fna.fbcdn.net/v/t51.71878-15/505788512_2753613628165302_3512556569210015168_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=104&ig_cache_key=MzQ2NTc5NzM2NjgyODM5Mjg4MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=qZAS-xxojr0Q7kNvwE_c2iR&_nc_oc=AdrAwUSvy0IFu4Wn2QkNAb1nZCcrcW4l9V9fONW7gO31cHjXd6epR3p_XLz-oqY0tRQ&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-1.fna&_nc_gid=WLObxgHFjNPLjcX-PC0C6g&_nc_ss=7a32e&oh=00_Af2rYtxTNAq1FtGlktEUPSOpGeN4dsz4VpATVnetsKS__A&oe=69DD720B", title: "Modern Residential", cat: "Framing" },
              { img: "https://instagram.fdac2-1.fna.fbcdn.net/v/t51.71878-15/506312825_732287189328844_8314393298854889667_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzQ2NjY0OTQwNTg4ODE3NTA1Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=wbeyw5FdifUQ7kNvwH5xKpU&_nc_oc=Adq6dLsJJ80Mdm1cMYJPE1gg3zW9LPr5JWUdzzK4AIuObwMFOKWmtT9jwRU5Q_CEP7E&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-1.fna&_nc_gid=WLObxgHFjNPLjcX-PC0C6g&_nc_ss=7a32e&oh=00_Af3RKUMvZsiHAB9IC3Po02oZ5wNVG0-TVFoteb4XtkVIWg&oe=69DD71B8", title: "Commercial Complex", cat: "Structural" },
              { img: "https://instagram.fdac2-2.fna.fbcdn.net/v/t51.75761-15/469586161_18063269299838263_1072652998498679458_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=106&ig_cache_key=MzUxODIzNzU0MzAzODcyMTMwOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5oZHIuQzMifQ%3D%3D&_nc_ohc=7ipZbrTUJMAQ7kNvwGKFFgA&_nc_oc=AdqkiwsftAlM2SvAaW639PmMcxi4jfRSiTSlXk1BR6ffW-CSrO0TiCvIFdZR2Qh-GHs&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-2.fna&_nc_gid=WLObxgHFjNPLjcX-PC0C6g&_nc_ss=7a32e&oh=00_Af2ySfDlFQqyX1xjDx8EMdYVuIMxs_exM7sbbt2h_dnBEA&oe=69DD67F4", title: "Industrial Build", cat: "Contracting" }
            ].map((project, i) => (
              <motion.div 
                key={i} 
                className="relative group overflow-hidden aspect-[3/4] rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bam-black via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-all duration-500 m-4 rounded-lg" />
                <div className="absolute bottom-0 left-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-bam-orange font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">{project.cat}</span>
                  <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">{project.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-bam-orange text-bam-black overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full industrial-grid opacity-10" />
        <motion.div 
          className="container mx-auto px-6 text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[10vw] font-black leading-none mb-16 tracking-tighter">
            READY TO <span className="text-stroke-charcoal">BUILD?</span>
          </h2>
          <Link to="/contact" className="relative overflow-hidden group bg-bam-black text-white px-16 py-8 font-black uppercase text-xl tracking-widest transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            <span className="relative z-10 flex items-center gap-6">
              Get a Quote <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            />
          </Link>
        </motion.div>
      </section>
    </PageTransition>
  );
};

const Services = () => (
  <PageTransition>
    <div className="pt-48 pb-40">
      <div className="container mx-auto px-6">
        <h1 className="text-[12vw] font-black mb-32 tracking-tighter leading-none">
          OUR <span className="text-bam-orange">SERVICES</span>
        </h1>
        
        <div className="space-y-32 md:space-y-48">
          {[
            {
              title: "PRECISION FRAMING",
              tag: "Core Service",
              desc: "The structural backbone of every project. We specialize in high-precision framing that ensures your build is straight, true, and built to last for generations.",
              features: ["Residential Framing", "Structural Builds", "Precision Layouts"],
              img: "https://s3-media0.fl.yelpcdn.com/bphoto/4giT9Xn200QdCV35KiUv1A/348s.jpg"
            },
            {
              title: "GENERAL CONTRACTING",
              tag: "Management",
              desc: "Full project execution from ground-breaking to final inspection. We manage every detail, subcontract, and timeline so you don't have to.",
              features: ["Build Management", "Site Supervision", "Quality Control"],
              img: "https://media.istockphoto.com/id/2164305033/photo/happy-project-manager-greeting-a-construction-worker-in-the-building.jpg?s=612x612&w=0&k=20&c=5tUApuYOWcqEY1pbz1j-WOqNgYbntQehpRa0mAHehZo=",
              reverse: true
            },
            {
              title: "CONSTRUCTION SERVICES",
              tag: "Execution",
              desc: "Comprehensive construction solutions for both residential and commercial needs. No project is too complex for our specialized crew.",
              features: ["Residential Builds", "Commercial Projects", "Renovations"],
              img: "https://media.istockphoto.com/id/1042342584/photo/investors-and-contractors-on-construction-site.jpg?s=612x612&w=0&k=20&c=dfpqU0nr9BccCHOdHNyI1UanHGLt1nD2t6jZp95YUe4="
            }
          ].map((service, i) => (
            <div key={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center ${service.reverse ? 'lg:flex-row-reverse' : ''}`}>
              <div className={service.reverse ? 'lg:order-2' : ''}>
                <span className="text-bam-orange font-black uppercase tracking-[0.3em] text-xs mb-6 block">{service.tag}</span>
                <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-10 tracking-tighter leading-[0.9]">{service.title}</h2>
                <div className="space-y-8 md:space-y-10 text-white/40 text-lg md:text-xl leading-relaxed">
                  <p>{service.desc}</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {service.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-[10px] md:text-xs">
                        <div className="w-2 h-2 bg-bam-orange" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <motion.div 
                className={`relative group overflow-hidden rounded-xl ${service.reverse ? 'lg:order-1' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-bam-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </PageTransition>
);

const Projects = () => (
  <PageTransition>
    <div className="pt-48 pb-40">
      <div className="container mx-auto px-6">
        <h1 className="text-[12vw] font-black mb-32 tracking-tighter leading-none">
          OUR <span className="text-bam-orange">WORKS</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { title: 'Modern Residential Framing', category: 'Framing', img: 'https://instagram.fdac2-2.fna.fbcdn.net/v/t51.75761-15/482460654_18071887540838263_3211176201097669307_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=106&ig_cache_key=MzU4MTA0MzMzNjE4ODM2MTAzMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5oZHIuQzMifQ%3D%3D&_nc_ohc=7RF3g6sL9tIQ7kNvwG5r5mB&_nc_oc=AdqAaM5KHGZ5TEwNBzd2_RNUcMYrWBT88XeDiQuwDeeh_klZefIyparyBiUW0bDOzi8&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-2.fna&_nc_gid=7KmG3bz7FfO3KOV4dXPwWA&_nc_ss=7a32e&oh=00_Af2EzsJO1KUqzqQ4aAdFPUAsK0_gg5A8F0wCGpscQPOjxQ&oe=69DD75E6' },
            { title: 'Commercial Structural Build', category: 'General Contracting', img: 'https://instagram.fdac2-1.fna.fbcdn.net/v/t51.75761-15/481965982_18071399299838263_134922471892761676_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=109&ig_cache_key=MzU3NzY2MTc4ODU1NDM4MTg3MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5oZHIuQzMifQ%3D%3D&_nc_ohc=fAbAZOPpXOYQ7kNvwHtDGlr&_nc_oc=AdqTC_zIwDUiAcH9-SNjEcU3HqOS7f6Gh5dx7Qgy57Sg2i0OBsmNKwhWkeJjP0hG--A&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-1.fna&_nc_gid=WLObxgHFjNPLjcX-PC0C6g&_nc_ss=7a32e&oh=00_Af3_FTXUz9BrmaKGXRuWpXog9P8UmL513yJ-fhW3jyd8AA&oe=69DD8EFF' },
            { title: 'Custom Home Skeleton', category: 'Framing', img: 'https://instagram.fdac2-2.fna.fbcdn.net/v/t51.75761-15/483947855_18072704560838263_7526486572331538403_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=101&ig_cache_key=MzU4Njk0MjI4OTg5MTEzMzA4Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5oZHIuQzMifQ%3D%3D&_nc_ohc=7e588WrMR1YQ7kNvwEYOlwZ&_nc_oc=Ado5hEW7RE0Z-p0LEvrtelcH3KcTd7q3qdYLy_G6Vvq3I8jARAeeLcgsJDLjsMl4Kfk&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-2.fna&_nc_gid=7KmG3bz7FfO3KOV4dXPwWA&_nc_ss=7a32e&oh=00_Af3eI6iBX2lk3vWozjrS0yIhBnuYCd0ZHvzavkJkFaAwog&oe=69DD64E9' },
            { title: 'Industrial Site Prep', category: 'Construction', img: 'https://instagram.fdac2-1.fna.fbcdn.net/v/t51.71878-15/486973212_1699240777295015_2948302571466365839_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=109&ig_cache_key=MzU5NzkxNzg4OTU3NTc4ODU5Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=sB0c7eeD-WsQ7kNvwEcwhNY&_nc_oc=AdoGJUYgsVz7buPRznjj2ptmkPZRzh_WRMkyq9yhOgGnO3fjzGgHse2HeILNUZhaQfo&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-1.fna&_nc_gid=7KmG3bz7FfO3KOV4dXPwWA&_nc_ss=7a32e&oh=00_Af1-dzUkg9iHxFSAfqN_X95BJaG-PQ-rOcUPJPtz3CQxjQ&oe=69DD9912' },
            { title: 'Multi-Unit Framing', category: 'Framing', img: 'https://instagram.fdac2-1.fna.fbcdn.net/v/t51.71878-15/505788512_2753613628165302_3512556569210015168_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=104&ig_cache_key=MzQ2NTc5NzM2NjgyODM5Mjg4MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=qZAS-xxojr0Q7kNvwE_c2iR&_nc_oc=AdrAwUSvy0IFu4Wn2QkNAb1nZCcrcW4l9V9fONW7gO31cHjXd6epR3p_XLz-oqY0tRQ&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-1.fna&_nc_gid=WLObxgHFjNPLjcX-PC0C6g&_nc_ss=7a32e&oh=00_Af2rYtxTNAq1FtGlktEUPSOpGeN4dsz4VpATVnetsKS__A&oe=69DD720B' },
            { title: 'Retail Build Management', category: 'General Contracting', img: 'https://instagram.fdac2-1.fna.fbcdn.net/v/t51.71878-15/506312825_732287189328844_8314393298854889667_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzQ2NjY0OTQwNTg4ODE3NTA1Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=wbeyw5FdifUQ7kNvwH5xKpU&_nc_oc=Adq6dLsJJ80Mdm1cMYJPE1gg3zW9LPr5JWUdzzK4AIuObwMFOKWmtT9jwRU5Q_CEP7E&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-1.fna&_nc_gid=WLObxgHFjNPLjcX-PC0C6g&_nc_ss=7a32e&oh=00_Af3RKUMvZsiHAB9IC3Po02oZ5wNVG0-TVFoteb4XtkVIWg&oe=69DD71B8' }
          ].map((project, i) => (
            <motion.div 
              key={i} 
              className="group relative overflow-hidden aspect-[16/10]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <img 
                src={project.img} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bam-black via-bam-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-12">
                <span className="text-bam-orange font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">{project.category}</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">{project.title}</h3>
              </div>
              <div className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-12 h-12 rounded-full bg-bam-orange flex items-center justify-center text-bam-black">
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </PageTransition>
);

const About = () => (
  <PageTransition>
    <div className="pt-48 pb-40">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl">
          <motion.h1 
            className="text-[12vw] font-black mb-20 tracking-tighter leading-none"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            ABOUT <span className="text-bam-orange">BAM</span>
          </motion.h1>
          <motion.p 
            className="text-4xl md:text-6xl font-black uppercase leading-[0.9] mb-24 tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            WE DELIVER THE STRUCTURAL BACKBONE OF HIGH-END ARCHITECTURE. STRENGTH. PRECISION. RELIABILITY.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 text-white/40 text-xl leading-relaxed">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <img 
                src="https://instagram.fdac2-2.fna.fbcdn.net/v/t39.30808-6/468710370_18062464585838263_5844213024270210688_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=MzM3NjYxMzg4MjQxOTYxODAzNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=rHGDcyaBOMIQ7kNvwHuk58P&_nc_oc=Adqgks32u7qKJEiRKPnV8vqrRsXVCuLxVS8ZPmvETJstMHv8eXyTZ8n-7IpEEwKqymM&_nc_ad=z-m&_nc_cid=1112&_nc_zt=23&_nc_ht=instagram.fdac2-2.fna&_nc_gid=M4V6EhG90BDXBwHtrBwaRg&_nc_ss=7a32e&oh=00_Af25R64zrSn-GX54lgYWIUtEsn-knHK4YkBKHGD3Znudmg&oe=69DD8E2A" 
                alt="About BAM" 
                className="w-full aspect-video object-cover mb-8"
                referrerPolicy="no-referrer"
              />
              <p>
                Founded on the principles of hard work and no-BS execution, BAM Contracting has become a leader in structural framing and general contracting. We believe that the strength of a building is determined by the integrity of its frame and the reliability of its crew.
              </p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Whether it's a custom residential home or a complex commercial structure, we bring the same level of precision and dedication to every job site. Our mission is simple: build it strong, build it right, and get it done on time. No excuses.
            </motion.p>
          </div>
        </div>
        
        <div className="mt-24 md:mt-48 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {[
            { label: 'Projects Completed', value: '250+' },
            { label: 'Years Experience', value: '15+' },
            { label: 'Reliable Crew', value: '40+' },
            { label: 'Client Satisfaction', value: '100%' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="p-10 md:p-16 text-center bg-bam-black"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="block text-bam-orange font-black text-5xl md:text-6xl mb-4 tracking-tighter">{stat.value}</span>
              <span className="block text-white/30 uppercase tracking-[0.2em] text-[10px] font-bold">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </PageTransition>
);

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="pt-32 md:pt-48 pb-24 md:pb-40">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32">
            <div>
              <h1 className="text-6xl md:text-9xl font-black mb-8 md:mb-12 tracking-tighter leading-none">
                LET'S <span className="text-bam-orange">BUILD.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/40 mb-12 md:text-16 font-medium leading-relaxed max-w-xl">
                Ready to start your next project? Contact us today for a professional quote and expert consultation.
              </p>
              
              <div className="space-y-8 md:space-y-12">
                <div className="flex items-center gap-6 md:gap-8 group">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-bam-orange group-hover:border-bam-orange transition-all duration-500 shrink-0">
                    <Phone className="text-bam-orange group-hover:text-bam-black w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <span className="block text-white/30 uppercase tracking-widest text-[10px] font-bold mb-1">Call Us</span>
                    <span className="text-xl md:text-2xl font-black tracking-tight">(555) 123-4567</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 md:gap-8 group">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-bam-orange group-hover:border-bam-orange transition-all duration-500 shrink-0">
                    <Mail className="text-bam-orange group-hover:text-bam-black w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-white/30 uppercase tracking-widest text-[10px] font-bold mb-1">Email Us</span>
                    <span className="text-xl md:text-2xl font-black tracking-tight truncate block">hello@bamcontracting.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 md:gap-8 group">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-bam-orange group-hover:border-bam-orange transition-all duration-500 shrink-0">
                    <MapPin className="text-bam-orange group-hover:text-bam-black w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <span className="block text-white/30 uppercase tracking-widest text-[10px] font-bold mb-1">Visit Us</span>
                    <span className="text-xl md:text-2xl font-black tracking-tight">123 Construction Way, Builder City</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-8 md:p-20 border border-white/5 relative overflow-hidden rounded-2xl">
              <div className="absolute top-0 right-0 w-full h-full industrial-grid opacity-[0.03]" />
              {submitted ? (
                <motion.div 
                  className="text-center py-12 md:py-20 relative z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-bam-orange rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check size={40} className="text-bam-black" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tighter">Message Received</h3>
                  <p className="text-white/40 text-lg">Our team will contact you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-4">
                      <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-lg md:text-xl font-bold focus:outline-none focus:border-bam-orange transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="w-full bg-transparent border-b-2 border-white/10 py-4 text-lg md:text-xl font-bold focus:outline-none focus:border-bam-orange transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Service Needed</label>
                    <select className="w-full bg-transparent border-b-2 border-white/10 py-4 text-lg md:text-xl font-bold focus:outline-none focus:border-bam-orange transition-colors appearance-none cursor-pointer">
                      <option className="bg-bam-black">Framing</option>
                      <option className="bg-bam-black">General Contracting</option>
                      <option className="bg-bam-black">Construction Services</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Project Details</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-transparent border-b-2 border-white/10 py-4 text-lg md:text-xl font-bold focus:outline-none focus:border-bam-orange transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button type="submit" className="w-full bg-bam-orange text-bam-black py-6 md:py-8 font-black uppercase text-sm tracking-[0.3em] hover:bg-white transition-all duration-500 shadow-[0_0_50px_rgba(245,147,27,0.2)]">
                    Send Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// --- Main App ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-bam-orange selection:text-bam-charcoal">
        <CustomCursor />
        <Header />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        
        {/* Sticky CTA for Mobile */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: "spring" }}
          >
            <Link 
              to="/contact" 
              className="bg-bam-orange text-bam-charcoal w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(245,147,27,0.5)] border-4 border-bam-black relative group"
            >
              <Phone size={24} className="group-hover:scale-110 transition-transform" />
              <motion.div 
                className="absolute -inset-1 bg-bam-orange/30 rounded-full -z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </Router>
  );
}
