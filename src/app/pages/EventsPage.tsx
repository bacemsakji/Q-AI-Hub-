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
    Hackathon: { bg: 'bg-accent/15', text: 'text-accent', border: 'border-accent/30' },
    Workshop: { bg: 'bg-[#00E5FF]/10', text: 'text-cyan-500 dark:text-[#00E5FF]', border: 'border-[#00E5FF]/30' },
    Talk: { bg: 'bg-[#7B2FFF]/15', text: 'text-purple-600 dark:text-[#7B2FFF]', border: 'border-[#7B2FFF]/30' },
};

const statusConfig: Record<string, { label: string; color: string; glow: string }> = {
    Open: { label: 'Open', color: 'bg-[#00F5A0]/20 text-emerald-600 dark:text-[#00F5A0] border-[#00F5A0]/30', glow: 'shadow-[0_0_12px_rgba(0,245,160,0.15)]' },
    'Coming Soon': { label: 'Coming Soon', color: 'bg-[#7B2FFF]/15 text-purple-600 dark:text-[#7B2FFF] border-[#7B2FFF]/30', glow: 'shadow-[0_0_12px_rgba(123,47,255,0.15)]' },
    Closed: { label: 'Closed', color: 'bg-foreground/5 text-muted-foreground border-border', glow: '' },
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
                    <div className="relative max-w-6xl mx-auto text-center rounded-3xl p-12 lg:p-16 border border-border/50 bg-card/40"
                        style={{ boxShadow: '0 20px 80px rgba(0, 229, 255, 0.1)' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-50 rounded-3xl" />
                        <FadeInSection variant="fade-up">
                            <p className="uppercase tracking-[0.25em] text-xs text-muted-foreground mb-4 font-medium">
                                Q-AI Hub Events
                            </p>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
                                Upcoming Events & Programs
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                                    ? 'bg-foreground/10 border-foreground/30 text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
                                    : 'bg-transparent border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground'
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
                                        <div className="h-full p-px rounded-2xl bg-gradient-to-br from-foreground/10 via-transparent to-foreground/5 hover:from-foreground/15 hover:to-foreground/5 transition-all duration-500">
                                            <div className="relative h-full rounded-[calc(1rem-1px)] p-6 flex flex-col border border-border/40 bg-card/30 group-hover:border-primary/20 transition-all duration-500"
                                                style={{ boxShadow: '0 8px 30px rgba(0, 229, 255, 0.04)' }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-[calc(1rem-1px)]" />
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
                                                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-foreground/90 transition-colors leading-tight">
                                                    {event.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-grow">
                                                    {event.description}
                                                </p>

                                                {/* Meta info */}
                                                <div className="space-y-2 mb-6">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar size={14} className="text-foreground/40" />
                                                        <span>{event.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin size={14} className="text-foreground/40" />
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
                                                        <div className="w-full py-3 rounded-full text-center text-sm text-muted-foreground border border-border bg-foreground/5 cursor-not-allowed flex items-center justify-center gap-2">
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
                            <p className="text-muted-foreground text-lg">No events found for this category.</p>
                            <button
                                onClick={() => setActiveFilter('All')}
                                className="mt-4 text-sm text-foreground/70 hover:text-foreground underline underline-offset-4 transition-colors"
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
