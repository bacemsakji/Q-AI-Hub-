import { useState } from 'react';
import { Search, Filter, X, Users, DollarSign, TrendingUp, Calendar, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { startups as allStartups, type Startup } from '../../data/adminData';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const cardItem = { hidden: { opacity: 0, y: 24, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } } };

function StageBadge({ stage }: { stage: string }) {
    const s: Record<string, string> = {
        Idea: 'bg-[#8b5cf6]/15 text-[#8b5cf6] border-[#8b5cf6]/20', 'Pre-Seed': 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20',
        Seed: 'bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/20', 'Series A': 'bg-[#FFB800]/15 text-amber-600 dark:text-[#FFB800] border-[#FFB800]/20',
    };
    return <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s[stage] || 'bg-foreground/10 text-foreground/70 border-border'}`}>{stage}</span>;
}

function StatusDot({ status }: { status: string }) {
    const c: Record<string, { dot: string; glow: string }> = {
        Active: { dot: 'bg-[#00FFC2]', glow: 'shadow-[0_0_6px_rgba(0,255,194,0.5)]' },
        'On Hold': { dot: 'bg-[#FFB800]', glow: 'shadow-[0_0_6px_rgba(255,184,0,0.5)]' },
        Graduated: { dot: 'bg-[#00E5FF]', glow: 'shadow-[0_0_6px_rgba(0,229,255,0.5)]' },
        Pending: { dot: 'bg-amber-500', glow: 'shadow-[0_0_6px_rgba(245,158,11,0.5)]' },
        Rejected: { dot: 'bg-[#FF4757]', glow: 'shadow-[0_0_6px_rgba(255,71,87,0.5)]' },
    };
    const style = c[status] || { dot: 'bg-white/30', glow: '' };
    return <div className="flex items-center gap-1.5"><div className={`h-2 w-2 rounded-full ${style.dot} ${style.glow}`} /><span className="text-xs text-muted-foreground">{status}</span></div>;
}

function MilestoneIcon({ status }: { status: string }) {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-[#00FFC2]" />;
    if (status === 'in-progress') return <Clock className="h-4 w-4 text-amber-600 dark:text-[#FFB800]" />;
    return <div className="h-4 w-4 rounded-full border-2 border-border" />;
}

function StartupDetailPanel({ startup, onClose }: { startup: Startup; onClose: () => void }) {
    const [pitchDate, setPitchDate] = useState('');

    return (
        <motion.div
            initial={{ x: 520, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 520, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[520px] flex-col border-l border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/50"
        >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="text-base font-bold text-foreground">Startup Details</h3>
                <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-all"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="border-b border-border bg-gradient-to-br from-[#00E5FF]/[0.04] to-[#7B2FFF]/[0.02] p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E5FF]/25 to-[#7B2FFF]/25 text-xl font-bold text-[#00E5FF] ring-2 ring-[#00E5FF]/15">{startup.logo}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2"><h4 className="text-xl font-bold text-foreground">{startup.name}</h4><StageBadge stage={startup.stage} /></div>
                            <p className="text-sm text-muted-foreground">{startup.industry}</p>
                            <StatusDot status={startup.status} />
                        </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/70">{startup.description}</p>
                </div>

                <div className="border-b border-border p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Key Metrics</h5>
                    <div className="grid grid-cols-2 gap-3">
                        {startup.metrics.map((m, i) => (
                            <motion.div key={m.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.06 }}
                                className="rounded-xl bg-muted p-3 border border-border"><p className="text-[11px] text-muted-foreground">{m.label}</p><p className="text-base font-bold text-foreground">{m.value}</p></motion.div>
                        ))}
                    </div>
                </div>

                <div className="border-b border-border p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Progress</h5>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-foreground/5">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${startup.progress}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                                className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00FFC2]" />
                        </div>
                        <span className="text-sm font-bold text-foreground">{startup.progress}%</span>
                    </div>
                </div>

                <div className="border-b border-border p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Milestones</h5>
                    <div className="flex flex-col gap-3">
                        {startup.milestones.map((m, i) => (
                            <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                                className="flex items-start gap-3 rounded-xl p-2 hover:bg-white/[0.02] transition-colors">
                                <MilestoneIcon status={m.status} />
                                <div className="flex-1"><p className={`text-sm font-medium ${m.status === 'completed' ? 'text-foreground/60 line-through' : 'text-foreground'}`}>{m.title}</p><p className="text-xs text-muted-foreground">{m.description}</p><p className="mt-0.5 text-[10px] text-muted-foreground/60">{m.date}</p></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Team ({startup.teamSize})</h5>
                    <div className="flex flex-col gap-2">
                        {startup.members.map((m, i) => (
                            <motion.div key={m.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                                className="flex items-center gap-3 rounded-xl bg-muted p-3 border border-border hover:bg-white/[0.05] transition-colors">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00E5FF]/10 text-xs font-bold text-[#00E5FF]">{m.avatar}</div>
                                <div><p className="text-sm font-medium text-foreground">{m.name}</p><p className="text-xs text-muted-foreground">{m.role}</p></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-border p-6">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[{ l: 'Founded', v: startup.foundedDate, c: '#00E5FF' }, { l: 'Funding', v: startup.funding, c: '#00FFC2' }, { l: 'Team Size', v: startup.teamSize, c: '#7B2FFF' }].map(s => (
                            <div key={s.l} className="rounded-xl bg-muted p-3 text-center border border-border"><p className="text-base font-bold" style={{ color: s.c }}>{s.v}</p><p className="text-[10px] text-muted-foreground">{s.l}</p></div>
                        ))}
                    </div>

                    {startup.status === 'Pending' && (
                        <div className="space-y-4">
                            <div className="bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-xl p-4">
                                <h5 className="text-xs font-bold text-[#FFB800] uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" /> Pitch Scheduling
                                </h5>
                                {startup.pitchDate ? (
                                    <p className="text-sm text-foreground">Scheduled for: <span className="font-bold">{startup.pitchDate}</span></p>
                                ) : (
                                    <p className="text-sm text-muted-foreground mb-3">No pitch date scheduled yet.</p>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="datetime-local"
                                        value={pitchDate}
                                        onChange={e => setPitchDate(e.target.value)}
                                        className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-[#00E5FF]/40"
                                    />
                                    <button
                                        disabled={!pitchDate}
                                        className="px-3 py-2 bg-[#00E5FF]/15 border border-[#00E5FF]/25 text-[#00E5FF] text-xs font-bold rounded-lg hover:bg-[#00E5FF]/25 transition-all disabled:opacity-50"
                                    >
                                        Schedule
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00FFC2] text-[#0A0E1A] text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,194,0.3)] transition-all">
                                    <CheckCircle className="h-4 w-4" /> Approve
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-foreground/5 border border-white/10 text-foreground text-sm font-bold rounded-xl hover:bg-[#FF4757]/10 hover:border-[#FF4757]/30 hover:text-[#FF4757] transition-all">
                                    <X className="h-4 w-4" /> Decline
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export function StartupsSection() {
    const [search, setSearch] = useState('');
    const [stageFilter, setStageFilter] = useState('All');
    const [tab, setTab] = useState<'Portfolio' | 'Applications'>('Portfolio');
    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

    const filtered = allStartups.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.industry.toLowerCase().includes(search.toLowerCase());
        const matchStage = stageFilter === 'All' || s.stage === stageFilter;
        const matchTab = tab === 'Portfolio' ? s.status !== 'Pending' : s.status === 'Pending';
        return matchSearch && matchStage && matchTab;
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Startup Portfolio</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Track and manage incubated startups</p>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-foreground/5 p-1 border border-border">
                    <button
                        onClick={() => setTab('Portfolio')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${tab === 'Portfolio' ? 'bg-[#00E5FF] text-[#0A0E1A] shadow-lg shadow-[#00E5FF]/20' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Portfolio
                    </button>
                    <button
                        onClick={() => setTab('Applications')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all relative ${tab === 'Applications' ? 'bg-[#00E5FF] text-[#0A0E1A] shadow-lg shadow-[#00E5FF]/20' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        New Applications
                        {allStartups.filter(s => s.status === 'Pending').length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFB800] text-[10px] font-bold text-[#0A0E1A] ring-2 ring-[#0F1628]">
                                {allStartups.filter(s => s.status === 'Pending').length}
                            </span>
                        )}
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Startups', value: allStartups.length, icon: TrendingUp, gradient: 'from-[#00E5FF] to-[#0061FF]' },
                    { label: 'Active', value: allStartups.filter(s => s.status === 'Active').length, icon: CheckCircle, gradient: 'from-[#00FFC2] to-[#00D9F5]' },
                    { label: 'Total Funding', value: '$520K', icon: DollarSign, gradient: 'from-[#7B2FFF] to-[#00E5FF]' },
                    { label: 'Team Members', value: allStartups.reduce((a, s) => a + s.teamSize, 0), icon: Users, gradient: 'from-[#FFB800] to-[#FF8800]' },
                ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                        whileHover={{ y: -3 }}
                        className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-5 transition-colors hover:border-white/[0.1]">
                        <div className="flex items-center justify-between"><p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{stat.label}</p>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/5"><stat.icon className="h-4 w-4 text-muted-foreground/80" /></div>
                        </div>
                        <p className={`mt-2 text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search startups..." value={search} onChange={e => setSearch(e.target.value)}
                        className="h-10 w-full rounded-xl border border-white/[0.08] bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all" />
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-card p-1">
                    <Filter className="ml-2 h-4 w-4 text-muted-foreground" />
                    {['All', 'Idea', 'Pre-Seed', 'Seed', 'Series A'].map(s => (
                        <button key={s} onClick={() => setStageFilter(s)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${stageFilter === s ? 'bg-[#00E5FF] text-[#0A0E1A] shadow-sm shadow-[#00E5FF]/30' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}`}>{s}</button>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(startup => (
                    <motion.div key={startup.id} variants={cardItem}
                        whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,229,255,0.06)' }}
                        className="group overflow-hidden rounded-2xl border border-border bg-card/95 transition-colors hover:border-white/[0.1]">
                        <div className="flex items-start gap-4 p-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#7B2FFF]/20 text-lg font-bold text-[#00E5FF] ring-2 ring-[#00E5FF]/10 group-hover:ring-[#00E5FF]/25 transition-all">{startup.logo}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2"><h3 className="truncate text-base font-bold text-foreground">{startup.name}</h3><StageBadge stage={startup.stage} /></div>
                                <p className="text-sm text-muted-foreground">{startup.industry}</p>
                                <div className="mt-1 flex items-center gap-3"><StatusDot status={startup.status} /><span className="text-xs text-muted-foreground/60">by {startup.founderName}</span></div>
                            </div>
                        </div>
                        <div className="mx-5 mb-4">
                            <div className="flex items-center justify-between mb-1.5"><span className="text-xs text-muted-foreground">Progress</span><span className="text-xs font-semibold text-foreground">{startup.progress}%</span></div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-foreground/5"><div className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00FFC2] transition-all duration-700" style={{ width: `${startup.progress}%` }} /></div>
                        </div>
                        <div className="mx-5 mb-4 grid grid-cols-4 gap-2">
                            {startup.metrics.map(m => (
                                <div key={m.label} className="rounded-xl bg-muted p-2 text-center border border-border"><p className="text-xs font-bold text-foreground">{m.value}</p><p className="text-[9px] text-muted-foreground">{m.label}</p></div>
                            ))}
                        </div>
                        <div className="border-t border-border px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">{startup.teamSize} members</span></div>
                            <motion.button whileHover={{ x: 3 }} onClick={() => setSelectedStartup(startup)}
                                className="flex items-center gap-1 text-xs font-semibold text-[#00E5FF] hover:text-foreground transition-colors">
                                Details<ChevronRight className="h-3.5 w-3.5" />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {selectedStartup && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedStartup(null)} />
                        <StartupDetailPanel startup={selectedStartup} onClose={() => setSelectedStartup(null)} />
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
