import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Mail, Phone, Calendar, X, ExternalLink, ArrowRight, Shield, MessageCircle, Ban, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminUsers as allUsers, type AdminUser } from '../../data/adminData';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const cardItem = { hidden: { opacity: 0, y: 24, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } } };

function UserStatusBadge({ status }: { status: string }) {
    const s: Record<string, string> = {
        Active: 'bg-[#00FFC2]/15 text-[#00FFC2] border-[#00FFC2]/20', Pending: 'bg-[#FFB800]/15 text-amber-600 dark:text-[#FFB800] border-[#FFB800]/20', Suspended: 'bg-[#FF4757]/15 text-destructive dark:text-[#FF4757] border-[#FF4757]/20',
    };
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s[status] || 'bg-foreground/10 text-foreground/70 border-border'}`}>{status}</span>;
}

function AppStatusBadge({ status }: { status: string }) {
    const s: Record<string, string> = {
        Accepted: 'bg-[#00FFC2]/15 text-[#00FFC2]', Rejected: 'bg-[#FF4757]/20 text-destructive dark:text-[#FF4757]',
        Pending: 'bg-[#FFB800]/20 text-amber-600 dark:text-[#FFB800]', 'Under Review': 'bg-[#00E5FF]/15 text-[#00E5FF]',
    };
    return <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${s[status] || 'bg-foreground/10 text-foreground/70'}`}>{status}</span>;
}

function UserProfilePanel({ user, onClose }: { user: AdminUser; onClose: () => void }) {
    return (
        <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[500px] flex-col border-l border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/50"
        >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="text-base font-bold text-foreground">User Profile</h3>
                <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-all"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="border-b border-border bg-gradient-to-br from-[#00E5FF]/[0.04] to-[#7B2FFF]/[0.02] p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF]/25 to-[#7B2FFF]/25 text-xl font-bold text-[#00E5FF] ring-2 ring-[#00E5FF]/20">{user.avatar}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2"><h4 className="text-xl font-bold text-foreground">{user.name}</h4><UserStatusBadge status={user.status} /></div>
                            <p className="mt-0.5 text-sm font-medium text-[#00E5FF]">{user.role}</p>
                            <p className="text-sm text-muted-foreground">{user.startup}</p>
                        </div>
                    </div>
                </div>
                <div className="border-b border-border p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Contact Information</h5>
                    <div className="grid grid-cols-2 gap-3">
                        {[{ icon: Mail, label: 'Email', value: user.email }, { icon: Phone, label: 'Phone', value: user.phone }, { icon: Calendar, label: 'Joined', value: user.joinDate }, { icon: Shield, label: 'Status', value: user.status }].map((info, i) => (
                            <motion.div key={info.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                                className="rounded-xl bg-muted p-3 border border-border">
                                <div className="flex items-center gap-1.5"><info.icon className="h-3 w-3 text-[#00E5FF]/50" /><p className="text-[11px] font-medium text-muted-foreground">{info.label}</p></div>
                                <p className="mt-0.5 truncate text-sm font-medium text-foreground">{info.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="border-b border-border p-6">
                    <h5 className="mb-2 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Bio</h5>
                    <p className="text-sm leading-relaxed text-foreground/70">{user.bio}</p>
                </div>
                <div className="border-b border-border p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Skills & Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, i) => (
                            <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                                className="rounded-full bg-[#00E5FF]/10 px-3 py-1 text-xs font-medium text-[#00E5FF] border border-[#00E5FF]/10">{skill}</motion.span>
                        ))}
                    </div>
                </div>
                <div className="border-b border-border p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Activity Stats</h5>
                    <div className="grid grid-cols-4 gap-2">
                        {[{ l: 'Applied', v: user.applied, c: '#00E5FF' }, { l: 'Accepted', v: user.accepted, c: '#00FFC2' }, { l: 'Rate', v: user.applied > 0 ? `${Math.round((user.accepted / user.applied) * 100)}%` : '0%', c: '#7B2FFF' }, { l: 'Active', v: user.applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length, c: '#FFB800' }].map(stat => (
                            <div key={stat.l} className="rounded-xl bg-muted p-3 text-center border border-border">
                                <p className="text-lg font-bold" style={{ color: stat.c }}>{stat.v}</p>
                                <p className="text-[10px] font-medium text-muted-foreground">{stat.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Application History</h5>
                    <div className="flex flex-col gap-2">
                        {user.applications.map((app, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                                className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-3 hover:bg-foreground/5 transition-colors">
                                <div className="flex-1"><p className="text-sm font-medium text-foreground">{app.eventTitle}</p><p className="text-xs text-muted-foreground">{app.date}</p></div>
                                <div className="flex items-center gap-2">
                                    {app.score && <span className="rounded-full bg-[#00E5FF]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#00E5FF]">{app.score}/10</span>}
                                    <AppStatusBadge status={app.status} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-border p-6">
                    <h5 className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Social Links</h5>
                    <div className="flex flex-col gap-2">
                        {[{ label: 'LinkedIn', value: user.linkedin }, { label: 'GitHub', value: user.github }].map(link => (
                            <a key={link.label} href={`https://${link.value}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors">
                                <ExternalLink className="h-3.5 w-3.5 text-[#00E5FF]/50" />{link.value}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 border-t border-border p-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-4 py-2.5 text-sm font-semibold text-[#0A0E1A] shadow-lg shadow-[#00E5FF]/20"><MessageCircle className="h-4 w-4" />Message</motion.button>
                {user.status === 'Suspended' ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#00FFC2]/30 bg-[#00FFC2]/10 px-4 py-2.5 text-sm font-semibold text-[#00FFC2]"><RotateCcw className="h-4 w-4" />Restore</motion.button>
                ) : (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#FF4757]/30 bg-[#FF4757]/10 px-4 py-2.5 text-sm font-semibold text-destructive dark:text-[#FF4757]"><Ban className="h-4 w-4" />Suspend</motion.button>
                )}
            </div>
        </motion.div>
    );
}

export function UsersSection() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const navigate = useNavigate();

    const filtered = allUsers.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.startup.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || u.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold text-foreground">Users Directory</h2><p className="mt-1 text-sm text-muted-foreground">Manage startup founders and team members</p></div>
                <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(0,229,255,0.35)' }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/admin/users/invite')}
                    className="flex items-center gap-2 rounded-xl bg-[#00E5FF] px-5 py-2.5 text-sm font-semibold text-[#0A0E1A] shadow-lg shadow-[#00E5FF]/20"><UserPlus className="h-4 w-4" />Invite User</motion.button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: allUsers.length, gradient: 'from-[#00E5FF] to-[#0061FF]' },
                    { label: 'Active', value: allUsers.filter(u => u.status === 'Active').length, gradient: 'from-[#00FFC2] to-[#00D9F5]' },
                    { label: 'Pending', value: allUsers.filter(u => u.status === 'Pending').length, gradient: 'from-[#FFB800] to-[#FF8800]' },
                    { label: 'Suspended', value: allUsers.filter(u => u.status === 'Suspended').length, gradient: 'from-[#FF4757] to-[#FF3344]' },
                ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                        className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-5">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{stat.label}</p>
                        <p className={`mt-2 text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search users or startups..." value={search} onChange={e => setSearch(e.target.value)}
                        className="h-10 w-full rounded-xl border border-white/[0.08] bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all" />
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-card p-1">
                    {['All', 'Active', 'Pending', 'Suspended'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${statusFilter === s ? 'bg-[#00E5FF] text-[#0A0E1A] shadow-sm shadow-[#00E5FF]/30' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}`}>{s}</button>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map(user => (
                    <motion.div key={user.id} variants={cardItem}
                        whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,229,255,0.06)' }}
                        className="group overflow-hidden rounded-2xl border border-border bg-card/95 transition-colors hover:border-white/[0.1]">
                        <div className="flex items-start gap-4 p-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#7B2FFF]/20 text-lg font-bold text-[#00E5FF] ring-2 ring-[#00E5FF]/10 group-hover:ring-[#00E5FF]/25 transition-all">{user.avatar}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2"><h3 className="truncate text-base font-bold text-foreground">{user.name}</h3><UserStatusBadge status={user.status} /></div>
                                <p className="text-sm font-medium text-[#00E5FF]">{user.role}</p>
                                <p className="text-sm text-muted-foreground">{user.startup}</p>
                                <p className="mt-0.5 truncate text-xs text-muted-foreground/70">{user.email}</p>
                            </div>
                        </div>
                        <div className="mx-5 mb-4 grid grid-cols-3 gap-2">
                            {[{ l: 'Applied', v: user.applied, c: '#00E5FF' }, { l: 'Accepted', v: user.accepted, c: '#00FFC2' }, { l: 'Rate', v: user.applied > 0 ? `${Math.round((user.accepted / user.applied) * 100)}%` : '0%', c: '#7B2FFF' }].map(s => (
                                <div key={s.l} className="rounded-xl bg-muted p-2.5 text-center border border-border"><p className="text-sm font-bold" style={{ color: s.c }}>{s.v}</p><p className="text-[10px] text-muted-foreground">{s.l}</p></div>
                            ))}
                        </div>
                        <div className="mx-5 mb-4 flex flex-wrap gap-1.5">
                            {user.skills.slice(0, 3).map(skill => <span key={skill} className="rounded-full bg-[#00E5FF]/[0.08] border border-[#00E5FF]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#00E5FF]">{skill}</span>)}
                            {user.skills.length > 3 && <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] text-muted-foreground">+{user.skills.length - 3}</span>}
                        </div>
                        <div className="border-t border-border px-5 py-3">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedUser(user)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/[0.06] px-4 py-2.5 text-xs font-semibold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#0A0E1A] transition-all duration-300">
                                View Profile<ArrowRight className="h-3.5 w-3.5" />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {selectedUser && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
                        <UserProfilePanel user={selectedUser} onClose={() => setSelectedUser(null)} />
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
