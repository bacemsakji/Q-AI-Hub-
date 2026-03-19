import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MapPin, CalendarDays, Users, ArrowRight, Filter, X, ArrowLeft, Eye, Clock, FileText, Download, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminEvents as initialEvents, applicantsByEvent, type AdminEvent, type Applicant } from '../../data/adminData';
import { Button } from '../Button';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const cardItem = { hidden: { opacity: 0, y: 24, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } } };

function StatusBadge({ status }: { status: string }) {
    const s: Record<string, string> = {
        Accepted: 'bg-[#00FFC2]/15 text-emerald-600 dark:text-[#00FFC2]', Rejected: 'bg-[#7B2FFF]/20 text-purple-600 dark:text-[#7B2FFF]',
        Pending: 'bg-[#00E5FF]/20 text-cyan-600 dark:text-[#00E5FF]', 'Under Review': 'bg-[#00E5FF]/15 text-cyan-600 dark:text-[#00E5FF]',
    };
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s[status] || 'bg-foreground/10 text-foreground/70'}`}>{status}</span>;
}

function ApplicantPanel({ applicant, onClose }: { applicant: Applicant; onClose: () => void }) {
    return (
        <motion.div
            initial={{ x: 480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 480, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[480px] flex-col border-l border-border bg-background/95 backdrop-blur-xl shadow-2xl"
        >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="text-base font-bold text-foreground">Application Detail</h3>
                <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-all"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="border-b border-border bg-gradient-to-br from-[#00E5FF]/[0.04] to-transparent p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#7B2FFF]/20 text-lg font-bold text-cyan-600 dark:text-[#00E5FF] ring-2 ring-[#00E5FF]/20">{applicant.avatar}</div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-foreground">{applicant.name}</h4>
                            <p className="text-sm text-muted-foreground">{applicant.email}</p>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-xs font-medium text-cyan-600 dark:text-[#00E5FF]">{applicant.startup}</span>
                                <StatusBadge status={applicant.status} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />Submitted on {applicant.submittedAt}</div>
                </div>
                <div className="p-6">
                    <h5 className="mb-4 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Application Answers</h5>
                    <div className="flex flex-col gap-5">
                        {applicant.answers.map((qa, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex flex-col gap-2">
                                <p className="text-sm font-semibold text-foreground">
                                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#00E5FF]/20 text-[10px] font-bold text-cyan-600 dark:text-[#00E5FF]">{i + 1}</span>
                                    {qa.question}
                                </p>
                                {qa.type === 'text' && <div className="rounded-xl bg-foreground/5 p-4 text-sm leading-relaxed text-foreground/70 border border-border">{qa.answer}</div>}
                                {qa.type === 'file' && (
                                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted p-3 hover:bg-foreground/5 transition-colors cursor-pointer">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00E5FF]/10"><FileText className="h-5 w-5 text-cyan-600 dark:text-[#00E5FF]" /></div>
                                        <span className="flex-1 text-sm font-medium text-foreground">{qa.answer}</span><Download className="h-4 w-4 text-muted-foreground/80" />
                                    </div>
                                )}
                                {qa.type === 'url' && (
                                    <a href={qa.answer} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/[0.04] px-4 py-3 text-sm font-medium text-cyan-600 dark:text-[#00E5FF] hover:bg-[#00E5FF]/[0.08] transition-all">
                                        <ExternalLink className="h-3.5 w-3.5" />{qa.answer}
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    {/* AI Insight */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="mt-6 rounded-xl border border-[#00E5FF]/10 bg-gradient-to-r from-[#00E5FF]/[0.04] to-[#7B2FFF]/[0.04] p-4">
                        <div className="flex items-center gap-1.5 mb-2"><Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]" /><p className="text-xs font-bold tracking-wide text-cyan-600 dark:text-[#00E5FF]">AI INSIGHT</p></div>
                        <p className="text-sm leading-relaxed text-foreground/70">Strong technical foundation with clear innovation metrics. Recommend further evaluation of market viability.</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

function EventDetail({ event, onBack }: { event: AdminEvent; onBack: () => void }) {
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [searchApplicant, setSearchApplicant] = useState('');
    const eventApplicants = applicantsByEvent[event.id] || [];
    const filtered = eventApplicants.filter(a => a.name.toLowerCase().includes(searchApplicant.toLowerCase()) || a.startup.toLowerCase().includes(searchApplicant.toLowerCase()));

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div>
                <button onClick={onBack} className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"><ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />Back to Events</button>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-24 overflow-hidden rounded-xl border border-border"><img src={event.image} alt={event.title} className="h-full w-full object-cover" crossOrigin="anonymous" /></div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{event.title}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]/60" />{event.date}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]/60" />{event.location}</span>
                            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]/60" />{event.applicants} Applicants</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-foreground">About this Event</h3>
                <p className="leading-relaxed text-foreground/70">{event.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                    {[{ l: 'Category', v: event.category, c: '#00E5FF' }, { l: 'Capacity', v: `${event.maxCapacity} spots`, c: '#00FFC2' }, { l: 'Status', v: event.status, c: '#00D9F5' }].map(s => (
                        <div key={s.l} className="rounded-xl bg-muted p-4 border border-border"><p className="text-xs text-muted-foreground">{s.l}</p><p className="mt-1 text-sm font-semibold" style={{ color: s.c }}>{s.v}</p></div>
                    ))}
                </div>
            </motion.div>

            {/* Applicants Table */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Viewing <span className="font-semibold text-foreground">{eventApplicants.length}</span> applications</p>
                    <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Search applicants..." value={searchApplicant} onChange={e => setSearchApplicant(e.target.value)}
                            className="h-9 w-64 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all" />
                    </div>
                </div>
                {eventApplicants.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-12 text-center"><Users className="mx-auto h-10 w-10 text-muted-foreground/40" /><p className="mt-3 text-sm text-muted-foreground">No applicants yet</p></div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <table className="w-full">
                            <thead><tr className="border-b border-border bg-muted">
                                {['Applicant', 'Startup', 'Submitted', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {filtered.map((a, i) => (
                                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                        className="border-b border-border hover:bg-muted transition-colors">
                                        <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00E5FF]/10 text-xs font-bold text-cyan-600 dark:text-[#00E5FF]">{a.avatar}</div><div><p className="text-sm font-medium text-foreground">{a.name}</p><p className="text-xs text-muted-foreground">{a.email}</p></div></div></td>
                                        <td className="px-5 py-3.5 text-sm text-foreground/70">{a.startup}</td>
                                        <td className="px-5 py-3.5 text-sm text-muted-foreground">{a.submittedAt}</td>
                                        <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                                        <td className="px-5 py-3.5 text-right">
                                            <Button
                                                variant="outline"
                                                onClick={() => setSelectedApplicant(a)}
                                                className="!px-3 !py-1.5 !text-xs"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            <AnimatePresence>
                {selectedApplicant && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-md" onClick={() => setSelectedApplicant(null)} />
                        <ApplicantPanel applicant={selectedApplicant} onClose={() => setSelectedApplicant(null)} />
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function EventsManager() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
    const [eventsList] = useState(initialEvents);

    const filtered = eventsList.filter(e => {
        const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || e.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalApplicants = eventsList.reduce((a, e) => a + e.applicants, 0);
    const openCount = eventsList.filter(e => e.status === 'Open').length;

    if (selectedEvent) return <EventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex items-center justify-between bg-card border border-border rounded-2xl p-6 shadow-sm"
            >
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Events Manager</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Manage and monitor all incubator events</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/events/create')}
                    className="!px-5 !py-2.5"
                >
                    <Plus className="h-4 w-4" />
                    Create New Event
                </Button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Events', value: eventsList.length, gradient: 'from-[#00E5FF] to-[#0061FF]' },
                    { label: 'Total Applicants', value: totalApplicants, gradient: 'from-[#00FFC2] to-[#00D9F5]' },
                    { label: 'Open Events', value: openCount, gradient: 'from-[#7B2FFF] to-[#00E5FF]' },
                    { label: 'Avg per Event', value: Math.round(totalApplicants / eventsList.length), gradient: 'from-[#00E5FF] to-[#00D9F5]' },
                ].map((stat, i) => (
                    <motion.div 
                        key={stat.label} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 + i * 0.06 }}
                        className="relative rounded-2xl p-6 transition-all cursor-default bg-card border border-border shadow-sm"
                    >
                        {/* Bottom Accent Glow */}
                        <div className={`absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-40 blur-sm`} />
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{stat.label}</p>
                        <p className={`mt-2 text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent drop-shadow-sm`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search + Filter */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
                        className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all" />
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                    <Filter className="ml-2 h-4 w-4 text-muted-foreground" />
                    {['All', 'Open', 'Upcoming', 'Closed'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${statusFilter === s ? 'neon-btn-gradient text-white shadow-sm shadow-cyan-500/30' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Event Cards */}
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(event => (
                    <motion.div key={event.id} variants={cardItem}
                        whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,229,255,0.08)' }}
                        className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-primary/30">
                        <div className="relative h-44 overflow-hidden">
                            <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" crossOrigin="anonymous" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                            <div className="absolute left-3 top-3"><span className="rounded-lg bg-foreground/15 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md">{event.category}</span></div>
                            <div className="absolute right-3 top-3">
                                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${event.status === 'Open' ? 'bg-[#00FFC2]/80 text-background' : event.status === 'Upcoming' ? 'bg-[#00E5FF]/80 text-background' : 'bg-foreground/30 text-foreground/80'}`}>{event.status}</span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-base font-bold leading-tight text-foreground drop-shadow-lg">{event.title}</h3>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 p-4">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]/50" />{event.date}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]/50" />{event.location}</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]" /><span className="text-xs font-semibold text-foreground">{event.applicants}</span><span className="text-xs text-muted-foreground">/ {event.maxCapacity}</span></div>
                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-foreground/5">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00FFC2] transition-all" style={{ width: `${Math.min((event.applicants / event.maxCapacity) * 100, 100)}%` }} />
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setSelectedEvent(event)}
                                className="!px-4 !py-2.5 !text-xs group/btn"
                            >
                                View Details
                                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
