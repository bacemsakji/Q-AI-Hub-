import { Calendar, Rocket, Users, Zap, BarChart3, TrendingUp, ArrowUpRight, Activity, DollarSign, Target, PieChart, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface DashboardHomeProps {
    onNavigate: (section: string) => void;
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
};

/* ─── Mini SVG Line Chart ─── */
function MiniLineChart({ data, color, height = 100 }: { data: number[]; color: string; height?: number }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 100;
    const pts = data.map((v, i) => ({
        x: (i / (data.length - 1)) * w,
        y: height - ((v - min) / range) * (height - 20) - 10,
    }));
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const area = `${line} L ${w} ${height} L 0 ${height} Z`;
    return (
        <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path d={area} fill={`url(#grad-${color.replace('#', '')})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
            <motion.path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }} />
            {pts.map((p, i) => (
                <motion.circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.08 }} />
            ))}
        </svg>
    );
}

/* ─── Mini SVG Pie Chart (Donut) ─── */
function DonutChart({ segments, size = 160 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    const r = 60;
    const cx = size / 2;
    const cy = size / 2;
    let acc = 0;
    const paths = segments.map(seg => {
        const startAngle = (acc / total) * 360 - 90;
        acc += seg.value;
        const endAngle = (acc / total) * 360 - 90;
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
        const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
        const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
        const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
        return { ...seg, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, pct: Math.round((seg.value / total) * 100) };
    });
    return (
        <div className="flex items-center gap-6">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {paths.map((p, i) => (
                    <motion.path key={i} d={p.d} fill={p.color} fillOpacity={0.85} className="stroke-background" strokeWidth="2"
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring' as const, stiffness: 200 }}
                        style={{ transformOrigin: `${cx}px ${cy}px` }} />
                ))}
                <circle cx={cx} cy={cy} r="32" className="fill-card" />
                <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground font-bold text-sm">{total}</text>
                <text x={cx} y={cy + 10} textAnchor="middle" className="fill-muted-foreground text-[8px]">STARTUPS</text>
            </svg>
            <div className="flex flex-col gap-1.5">
                {paths.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                        <span className="text-xs text-foreground/70 w-20">{p.label}</span>
                        <span className="text-xs font-semibold tabular-nums" style={{ color: p.color }}>{p.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
    const navigate = useNavigate();
    const stats = [
        { label: 'Total Events', value: '6', change: '+2 this month', icon: Calendar, gradient: 'from-[#00E5FF] to-[#0061FF]', glow: 'rgba(0,229,255,0.15)' },
        { label: 'Active Startups', value: '24', change: '+5 this month', icon: Rocket, gradient: 'from-[#00FFC2] to-[#00D9F5]', glow: 'rgba(0,255,194,0.15)' },
        { label: 'Total Users', value: '156', change: '+18 this month', icon: Users, gradient: 'from-[#7B2FFF] to-[#00E5FF]', glow: 'rgba(123,47,255,0.15)' },
        { label: 'Pitches Evaluated', value: '42', change: '+8 this week', icon: Zap, gradient: 'from-[#7B2FFF] to-[#0061FF]', glow: 'rgba(123,47,255,0.15)' },
    ];

    const recentActivity = [
        { action: 'New application received', detail: 'Sara Meziane applied to AI Workshop Series', time: '2 hours ago', dotColor: 'bg-[#00E5FF]', glowColor: 'shadow-[0_0_6px_rgba(0,229,255,0.5)]' },
        { action: 'Event status updated', detail: 'BioTech Innovation Lab marked as Closed', time: '5 hours ago', dotColor: 'bg-[#7B2FFF]', glowColor: 'shadow-[0_0_6px_rgba(123,47,255,0.5)]' },
        { action: 'Pitch evaluated', detail: 'NeuroQuant Solutions scored 8.5/10', time: '1 day ago', dotColor: 'bg-[#00FFC2]', glowColor: 'shadow-[0_0_6px_rgba(0,255,194,0.5)]' },
        { action: 'User registered', detail: 'Karim Bouzid joined the platform', time: '2 days ago', dotColor: 'bg-[#7B2FFF]', glowColor: 'shadow-[0_0_6px_rgba(123,47,255,0.5)]' },
        { action: 'New event created', detail: 'Cybersecurity CTF Challenge published', time: '3 days ago', dotColor: 'bg-[#00E5FF]', glowColor: 'shadow-[0_0_6px_rgba(0,229,255,0.5)]' },
    ];

    const quickActions = [
        { label: 'Create New Event', icon: Calendar, nav: 'create-event', desc: 'Set up a hackathon or workshop' },
        { label: 'Evaluate a Pitch', icon: BarChart3, nav: 'pitch', desc: 'Score startup presentations' },
        { label: 'View Users', icon: Users, nav: 'users', desc: 'Manage founders & members' },
        { label: 'View Startups', icon: Rocket, nav: 'startups', desc: 'Track portfolio companies' },
    ];

    const upcomingEvents = [
        { title: 'Quantum Hackathon 2026', date: 'March 15-17', applicants: 45, status: 'Open', capacity: 60 },
        { title: 'AI Workshop Series', date: 'April 5-7', applicants: 78, status: 'Open', capacity: 100 },
        { title: 'Robotics Innovation Showcase', date: 'May 10', applicants: 32, status: 'Upcoming', capacity: 50 },
    ];

    /* ─── Chart Data ─── */
    const startupsPerYear = [3, 7, 12, 18, 24];
    const cohortsPerYear = [1, 2, 3, 5, 6];
    const acceptedGrowth = [5, 14, 28, 45, 68];
    const years = ['2022', '2023', '2024', '2025', '2026'];

    const fundingStats = [
        { label: 'Total Funding Raised', value: '$4.2M', icon: DollarSign, gradient: 'from-[#00FFC2] to-[#00E5FF]', glow: 'rgba(0,255,194,0.12)' },
        { label: 'Total Revenue', value: '$1.8M', icon: TrendingUp, gradient: 'from-[#7B2FFF] to-[#00E5FF]', glow: 'rgba(123,47,255,0.12)' },
        { label: 'Avg Funding/Cohort', value: '$700K', icon: Target, gradient: 'from-[#00E5FF] to-[#00FFC2]', glow: 'rgba(0,229,255,0.12)' },
        { label: 'Investment Rounds', value: '18', icon: Layers, gradient: 'from-[#00E5FF] to-[#0061FF]', glow: 'rgba(0,229,255,0.12)' },
    ];

    const sectorData = [
        { label: 'AI & Data', value: 32, color: '#00E5FF' },
        { label: 'FinTech', value: 20, color: '#7B2FFF' },
        { label: 'HealthTech', value: 18, color: '#00FFC2' },
        { label: 'GreenTech', value: 14, color: '#0061FF' },
        { label: 'SaaS', value: 10, color: '#00D9F5' },
        { label: 'E-commerce', value: 6, color: '#00BFA5' },
    ];

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
            {/* Welcome */}
            <motion.div variants={item}>
                <h2 className="text-3xl font-bold text-foreground">
                    Welcome back, <span className="bg-gradient-to-r from-[#00E5FF] to-[#00FFC2] bg-clip-text text-transparent">Admin</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Here's what's happening across Q-AI Hub today</p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.08, type: 'spring' as const, stiffness: 200, damping: 20 }}
                        whileHover={{ y: -5, filter: 'brightness(1.1)' }}
                        className="group relative overflow-hidden rounded-2xl p-6 transition-all cursor-pointer"
                        style={{
                            background: 'var(--color-card)',
                            boxShadow: `0 10px 40px ${stat.glow.replace('0.15', '0.08')}`,
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-gradient-to-br ${stat.gradient}`} />
                        {/* Bottom Accent Glow */}
                        <div className={`absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-40 blur-sm`} />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{stat.label}</p>
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/50 shadow-inner group-hover:bg-primary/10 transition-colors">
                                    <stat.icon className="h-4.5 w-4.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                            <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent drop-shadow-sm`}>
                                {stat.value}
                            </p>
                            <div className="mt-3 flex items-center gap-1.5">
                                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-[#00FFC2]" />
                                <p className="text-xs font-medium text-emerald-600 dark:text-[#00FFC2]">{stat.change}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ─── Growth Charts ─── */}
            <motion.div variants={item} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {[
                    { title: 'Startups Incubated', data: startupsPerYear, color: '#00E5FF', latest: '24', change: '+33%' },
                    { title: 'Cohorts Completed', data: cohortsPerYear, color: '#00FFC2', latest: '6', change: '+20%' },
                    { title: 'Accepted Startups Growth', data: acceptedGrowth, color: '#7B2FFF', latest: '68', change: '+51%' },
                ].map((chart, ci) => (
                    <motion.div key={chart.title}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + ci * 0.1 }}
                        whileHover={{ y: -3, borderColor: 'var(--color-border)' }}
                        className="relative rounded-2xl p-6 transition-all border border-border/50 bg-card/40"
                        style={{ boxShadow: '0 8px 30px rgba(0, 229, 255, 0.04)' }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground">{chart.title}</p>
                            <span className="text-xs font-medium text-emerald-600 dark:text-[#00FFC2]">{chart.change}</span>
                        </div>
                        <p className="text-2xl font-bold mb-3" style={{ color: chart.color }}>{chart.latest}</p>
                        <MiniLineChart data={chart.data} color={chart.color} height={80} />
                        <div className="flex justify-between mt-2">
                            {years.map(y => <span key={y} className="text-[9px] text-muted-foreground/60">{y}</span>)}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ─── Funding & Economic + Sector Pie ─── */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Funding Stats */}
                <motion.div variants={item} className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="h-5 w-5 text-emerald-600 dark:text-[#00FFC2]" />
                        <h3 className="text-base font-bold text-foreground">Funding & Economic Impact</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {fundingStats.map((fs, fi) => (
                            <motion.div key={fs.label}
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + fi * 0.08 }}
                                whileHover={{ y: -5, filter: 'brightness(1.1)' }}
                                className="relative rounded-2xl p-6 transition-all cursor-default overflow-hidden group"
                                style={{
                                    background: 'var(--color-card)',
                                    boxShadow: `0 10px 40px ${fs.glow.replace('0.12', '0.08')}`,
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                {/* Background Glow Layer */}
                                <div 
                                    className={`absolute inset-0 bg-gradient-to-br ${fs.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} 
                                />
                                {/* Bottom Accent Glow */}
                                <div 
                                    className={`absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r ${fs.gradient} opacity-40 blur-sm`} 
                                />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/5 shadow-inner">
                                            <fs.icon className="h-4.5 w-4.5 text-muted-foreground/70" />
                                        </div>
                                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{fs.label}</p>
                                    </div>
                                    <p className={`text-3xl font-bold bg-gradient-to-r ${fs.gradient} bg-clip-text text-transparent drop-shadow-sm`}>
                                        {fs.value}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Sector Pie Chart */}
                <motion.div variants={item} 
                    className="relative rounded-2xl p-6 border border-border/50 bg-card/40"
                    style={{ boxShadow: '0 10px 40px rgba(0, 229, 255, 0.05)' }}
                >
                    <div className="flex items-center gap-2 mb-5">
                        <PieChart className="h-5 w-5 text-purple-600 dark:text-[#7B2FFF]" />
                        <h3 className="text-base font-bold text-foreground">Sector Focus</h3>
                    </div>
                    <DonutChart segments={sectorData} />
                </motion.div>
            </div>

            {/* Activity + Quick Actions */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <motion.div variants={item} 
                    className="lg:col-span-2 relative rounded-2xl p-7 border border-border/50 bg-card/40"
                    style={{ boxShadow: '0 12px 50px rgba(0, 229, 255, 0.06)' }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-cyan-600 dark:text-[#00E5FF]" />
                            <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
                        </div>
                        <span className="text-xs text-muted-foreground">Last 7 days</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        {recentActivity.map((activity, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.08 }}
                                whileHover={{ x: 4, backgroundColor: 'var(--color-muted)' }}
                                className="flex items-start gap-3 rounded-lg p-3 transition-all cursor-default"
                            >
                                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${activity.dotColor} ${activity.glowColor}`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground/90">{activity.action}</p>
                                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                                </div>
                                <p className="shrink-0 text-[11px] text-muted-foreground/70">{activity.time}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={item} 
                    className="relative rounded-2xl p-7 border border-border/50 bg-card/40"
                    style={{ boxShadow: '0 12px 50px rgba(0, 229, 255, 0.06)' }}
                >
                    <div className="flex items-center gap-2 mb-5">
                        <Zap className="h-5 w-5 text-cyan-600 dark:text-[#00E5FF]" />
                        <h3 className="text-base font-bold text-foreground">Quick Actions</h3>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {quickActions.map((action, i) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.08 }}
                                whileHover={{ 
                                    scale: 1.02, 
                                    x: 4,
                                    backgroundColor: 'rgba(0, 229, 255, 0.05)',
                                    borderColor: 'rgba(0, 229, 255, 0.2)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => action.nav === 'create-event' ? navigate('/admin/events/create') : onNavigate(action.nav)}
                                className="group/btn flex items-center gap-4 rounded-2xl bg-muted/30 p-4 text-left transition-all border border-border hover:shadow-lg hover:shadow-cyan-500/5"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF]/10 to-[#0061FF]/10 group-hover/btn:from-[#00E5FF]/20 group-hover/btn:to-[#0061FF]/20 transition-all duration-300">
                                    <action.icon className="h-5 w-5 text-cyan-600 dark:text-[#00E5FF] group-hover/btn:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-foreground/90 group-hover/btn:text-primary transition-colors">{action.label}</p>
                                    <p className="text-[11px] leading-tight text-muted-foreground mt-0.5">{action.desc}</p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover/btn:text-cyan-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Upcoming Events */}
            <motion.div variants={item} 
                className="relative rounded-2xl p-7 border border-border/50 bg-card/40"
                style={{ boxShadow: '0 15px 60px rgba(0, 229, 255, 0.08)' }}
            >
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-cyan-600 dark:text-[#00E5FF]" />
                        <h3 className="text-base font-bold text-foreground">Upcoming Events</h3>
                    </div>
                    <button onClick={() => onNavigate('events')} className="text-xs font-medium text-cyan-600 dark:text-[#00E5FF] hover:text-cyan-600 dark:text-[#00E5FF]/80 transition-colors">View all →</button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event, i) => (
                        <motion.div
                            key={event.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ y: -2, borderColor: 'rgba(0,229,255,0.15)' }}
                            className="rounded-xl border border-border p-4 transition-all hover:bg-muted/50 cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${event.status === 'Open' ? 'bg-[#00FFC2]/15 text-emerald-600 dark:text-[#00FFC2]' : 'bg-[#00E5FF]/10 text-cyan-600 dark:text-[#00E5FF]'
                                    }`}>{event.status}</span>
                                <span className="text-xs text-muted-foreground">{event.applicants} applicants</span>
                            </div>
                            <h4 className="mt-3 text-sm font-semibold text-foreground">{event.title}</h4>
                            <p className="mt-0.5 text-xs text-muted-foreground">{event.date}</p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="flex-1 h-1 overflow-hidden rounded-full bg-foreground/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((event.applicants / event.capacity) * 100, 100)}%` }}
                                        transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                                        className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00FFC2]"
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground">{Math.round((event.applicants / event.capacity) * 100)}%</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
