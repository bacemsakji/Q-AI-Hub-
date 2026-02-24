import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, ArrowRight, Bell, Lock, Sparkles } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { DashboardHeader } from '../components/DashboardHeader';
import { Footer } from '../components/Footer';
import { ParticleBackground } from '../components/ParticleBackground';
import { FadeInSection } from '../components/FadeInSection';
import { Button } from '../components/Button';
import { AuthInterceptModal } from '../components/AuthInterceptModal';
import { events } from '../data/mockData';
import { toast } from 'sonner';

type FilterType = 'All' | 'Hackathon' | 'Workshop' | 'Talk';

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    Hackathon: { bg: 'bg-[#7B2FFF]/15', text: 'text-[#B47EFF]', border: 'border-[#7B2FFF]/30' },
    Workshop: { bg: 'bg-[#00D9F5]/15', text: 'text-[#00D9F5]', border: 'border-[#00D9F5]/30' },
    Talk: { bg: 'bg-[#FFB800]/15', text: 'text-[#FFB800]', border: 'border-[#FFB800]/30' },
};

const statusConfig: Record<string, { label: string; color: string; glow: string }> = {
    Open: { label: 'Open', color: 'bg-[#00F5A0]/20 text-[#00F5A0] border-[#00F5A0]/30', glow: 'shadow-[0_0_12px_rgba(0,245,160,0.15)]' },
    'Coming Soon': { label: 'Coming Soon', color: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30', glow: 'shadow-[0_0_12px_rgba(255,184,0,0.15)]' },
    Closed: { label: 'Closed', color: 'bg-white/10 text-white/40 border-white/10', glow: '' },
};

export function EventsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isPublicView = searchParams.get('view') === 'public';

    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<{ id: number; title: string; date: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileName, setProfileName] = useState('Founder');

    useEffect(() => {
        // Only set logged in true if NOT forced by public view
        const actuallyLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(isPublicView ? false : actuallyLoggedIn);
        setProfileName(localStorage.getItem('userName') || 'Founder');
    }, [isPublicView]);

    const filters: FilterType[] = ['All', 'Hackathon', 'Workshop', 'Talk'];

    const filteredEvents = activeFilter === 'All'
        ? events
        : events.filter((e) => e.type === activeFilter);

    const handleApply = (event: typeof events[0]) => {
        if (isLoggedIn) {
            navigate(`/events/${event.id}/apply`);
        } else {
            setSelectedEvent({ id: event.id, title: event.title, date: event.date });
            setAuthModalOpen(true);
        }
    };

    const handleNotify = (event: typeof events[0]) => {
        toast.success(`You'll be notified when "${event.title}" opens for registration!`, {
            duration: 4000,
        });
    };

    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            {isLoggedIn ? (
                <DashboardHeader activeTab="events" profileName={profileName} />
            ) : (
                <Navigation />
            )}

            {!isLoggedIn && (
                <section className="relative z-10 pt-32 pb-16 px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        <FadeInSection variant="fade-up">
                            <p className="uppercase tracking-[0.25em] text-xs text-[#8892A4] mb-4 font-medium">
                                Q-AI Hub Events
                            </p>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                                Upcoming Events & Programs
                            </h1>
                            <p className="text-lg text-[#8892A4] max-w-2xl mx-auto">
                                Explore hackathons, workshops, and talks. Apply to events that match
                                your interests and accelerate your journey.
                            </p>
                        </FadeInSection>
                    </div>
                </section>
            )}

            {/* Filter Tabs */}
            <section className={`relative z-10 px-6 ${isLoggedIn ? 'pt-24 pb-8' : 'pb-8'}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-3">
                        {filters.map((filter) => (
                            <motion.button
                                key={filter}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${activeFilter === filter
                                    ? 'bg-white/10 border-white/30 text-white shadow-[0_4px_20px_rgba(255,255,255,0.08)]'
                                    : 'bg-transparent border-white/10 text-[#8892A4] hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {filter}
                                {filter !== 'All' && (
                                    <span className="ml-2 text-xs opacity-60">
                                        {events.filter((e) => e.type === filter).length}
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="relative z-10 px-6 pb-32">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredEvents.map((event, index) => {
                                const typeStyle = typeColors[event.type];
                                const status = statusConfig[event.status];
                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.08 }}
                                        whileHover={{ y: -4, scale: 1.01 }}
                                        className="group"
                                    >
                                        <div className="h-full p-px rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 hover:from-white/15 hover:to-white/8 transition-all duration-500">
                                            <div className="h-full bg-[rgba(15,22,40,0.92)] backdrop-blur-xl rounded-[calc(1rem-1px)] p-6 flex flex-col">
                                                {/* Header: type badge + status */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                                                        <Sparkles size={12} />
                                                        {event.type}
                                                    </span>
                                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.color} ${status.glow}`}>
                                                        {status.label}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/95 transition-colors leading-tight">
                                                    {event.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-sm text-[#8892A4] leading-relaxed mb-5 flex-grow">
                                                    {event.description}
                                                </p>

                                                {/* Meta info */}
                                                <div className="space-y-2 mb-6">
                                                    <div className="flex items-center gap-2 text-sm text-[#8892A4]">
                                                        <Calendar size={14} className="text-white/40" />
                                                        <span>{event.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-[#8892A4]">
                                                        <MapPin size={14} className="text-white/40" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div className="mt-auto">
                                                    {event.status === 'Open' && (
                                                        <Button
                                                            variant="primary"
                                                            fullWidth
                                                            onClick={() => handleApply(event)}
                                                            className="text-sm"
                                                        >
                                                            <span className="flex items-center justify-center gap-2">
                                                                Apply Now
                                                                <ArrowRight size={16} />
                                                            </span>
                                                        </Button>
                                                    )}
                                                    {event.status === 'Coming Soon' && (
                                                        <Button
                                                            variant="ghost"
                                                            fullWidth
                                                            onClick={() => handleNotify(event)}
                                                            className="text-sm"
                                                        >
                                                            <span className="flex items-center justify-center gap-2">
                                                                <Bell size={16} />
                                                                Notify Me
                                                            </span>
                                                        </Button>
                                                    )}
                                                    {event.status === 'Closed' && (
                                                        <div className="w-full py-3 rounded-full text-center text-sm text-white/30 border border-white/8 bg-white/[0.03] cursor-not-allowed flex items-center justify-center gap-2">
                                                            <Lock size={14} />
                                                            Registration Closed
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {/* Empty state */}
                    {filteredEvents.length === 0 && (
                        <FadeInSection variant="fade-up" className="text-center py-20">
                            <p className="text-[#8892A4] text-lg">No events found for this category.</p>
                            <button
                                onClick={() => setActiveFilter('All')}
                                className="mt-4 text-sm text-white/70 hover:text-white underline underline-offset-4 transition-colors"
                            >
                                View all events
                            </button>
                        </FadeInSection>
                    )}
                </div>
            </section>

            <Footer />

            {/* Auth Modal for Apply */}
            <AuthInterceptModal
                isOpen={authModalOpen}
                onClose={() => {
                    setAuthModalOpen(false);
                    setSelectedEvent(null);
                }}
                eventName={selectedEvent?.title}
                eventDate={selectedEvent?.date}
                returnUrl={selectedEvent ? `/events/${selectedEvent.id}/apply` : undefined}
            />
        </div>
    );
}
