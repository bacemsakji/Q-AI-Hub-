import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { AuthInterceptModal } from '../components/AuthInterceptModal';
import { FadeInSection } from '../components/FadeInSection';
import { FloatingGlassPanel } from '../components/FloatingGlassPanel';
import { Rotating3DCard } from '../components/Rotating3DCard';
import { programs } from '../data/mockData';

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<{ id: number; title: string; axis: string } | null>(null);
  const [stats, setStats] = useState({ startups: 0, members: 0, partners: 0, axes: 0 });

  const handleProgramClick = (programId: number, title: string, axis: string) => {
    setSelectedProgram({ id: programId, title, axis });
    setAuthModalOpen(true);
  };

  // Animate stats on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animate = (target: number, setter: (val: number) => void) => {
              let current = 0;
              const increment = target / 50;
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  setter(target);
                  clearInterval(timer);
                } else {
                  setter(Math.floor(current));
                }
              }, 30);
            };

            animate(50, (val) => setStats(prev => ({ ...prev, startups: val })));
            animate(200, (val) => setStats(prev => ({ ...prev, members: val })));
            animate(15, (val) => setStats(prev => ({ ...prev, partners: val })));
            animate(5, (val) => setStats(prev => ({ ...prev, axes: val })));
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.3]);

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navigation />

      {/* Hero Section – parallax + big bold typography + white space */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-32">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Logo size="lg" showText={false} />
          </motion.div>
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold mt-12 mb-8 tracking-tight text-white leading-[1.1] drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            The Gateway to Tech Ventures
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-[#8892A4] mb-16 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Incubating the next generation of Quantum-AI startups at ENICarthage
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="primary" onClick={() => setAuthModalOpen(true)}>
                Apply Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Discover Our Vision
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInSection variant="fade-up" className="text-center mb-16">
            <p className="uppercase tracking-[0.25em] text-xs text-[#8892A4] mb-4 font-medium">
              Q-Ai Hub Programs
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              5 Axes. One Vision.
            </h2>
          </FadeInSection>

          <div className="relative flex flex-col gap-8 max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="w-full"
                style={{ zIndex: 10 + index }}
              >
                <Rotating3DCard simple className="h-full min-h-[280px] md:min-h-[340px]">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                    }}
                  />
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12 lg:p-14 h-full min-h-[280px] md:min-h-[340px] items-center">
                    <div className="space-y-4 order-2 md:order-1">
                      <span className="inline-block h-1 w-20 rounded-full bg-white/30" />
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
                        {program.title}
                      </h3>
                      <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
                        {program.description}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <img
                          src={program.professor.photo}
                          alt={program.professor.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                        />
                        <div className="text-sm">
                          <p className="text-white/95">Prof. {program.professor.name}</p>
                          <p className="text-xs text-white/60">Program Director</p>
                        </div>
                      </div>
                      {program.id === 5 ? (
                        <button
                          onClick={() => handleProgramClick(program.id, program.title, program.axis)}
                          className="inline-flex items-center gap-2 text-sm mt-4 text-white/90 hover:text-white transition-colors"
                        >
                          Apply to this axis
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <p className="text-xs mt-4 text-white/50">Detailed axis journeys coming soon.</p>
                      )}
                    </div>
                    <div className="flex flex-col justify-center text-center md:text-right order-1 md:order-2 md:pl-8 lg:pl-12 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
                      <p className="text-lg md:text-xl lg:text-2xl font-semibold text-white/95 mb-2 tracking-tight">
                        {program.cardTagline}
                      </p>
                      <p className="text-sm md:text-base text-white/70 font-medium tracking-wide">
                        {program.cardPillar}
                      </p>
                    </div>
                  </div>
                </Rotating3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section – before Partners (stats) */}
      <section id="about" className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeInSection variant="fade-up" className="text-center mb-12">
            <p className="uppercase tracking-[0.25em] text-xs text-[#8892A4] mb-4 font-medium">
              About
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-10 text-white">
              The Q-AI Hub
            </h2>
          </FadeInSection>
          <div className="space-y-6 text-[#8892A4] text-base md:text-lg leading-relaxed">
            <p>
              The Q-AI Hub is a pioneering research and innovation initiative hosted at ENICarthage, University of Carthage, Tunisia, positioned at the forefront of the convergence between Quantum Computing and Artificial Intelligence.
            </p>
            <p>
              Our mission is to explore, design, develop, validate, and deploy hybrid Quantum-AI solutions to address critical real-world challenges in health, environment, and beyond.
            </p>
            <p>
              We also train and mentor students to anticipate the quantum era and launch impactful startups, fostering a new generation of tech entrepreneurs equipped to lead in tomorrow&apos;s deep-tech landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section – floating glass panel, big numbers (Partners) */}
      <section id="stats-section" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FloatingGlassPanel depth="lg" className="p-12 md:p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center">
              {[
                { value: stats.startups, label: 'Startups', suffix: '+' },
                { value: stats.members, label: 'Members', suffix: '+' },
                { value: stats.partners, label: 'Partners', suffix: '' },
                { value: stats.axes, label: 'Axes', suffix: '' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-5xl md:text-7xl font-extrabold mb-2 text-white tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.2)]">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-[#8892A4] font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FloatingGlassPanel>
        </div>
      </section>

      <Footer />

      <AuthInterceptModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setSelectedProgram(null);
        }}
        eventName={selectedProgram?.title}
        eventDate={selectedProgram?.axis}
        returnUrl={selectedProgram ? `/programs/${selectedProgram.id}/apply` : undefined}
      />
    </div>
  );
}
