import { Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Rocket, ClipboardCheck, Settings, Users, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../Logo';

type NavItem = { label: string; icon: React.ElementType; id: string };

const navItems: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Events', icon: Calendar, id: 'events' },
    { label: 'Users', icon: Users, id: 'users' },
    { label: 'Startups', icon: Rocket, id: 'startups' },
    { label: 'Pitch Evaluation', icon: ClipboardCheck, id: 'pitch' },
    { label: 'Settings', icon: Settings, id: 'settings' },
];

interface AdminSidebarProps {
    activeSection: string;
    onNavigate: (section: string) => void;
}

export function AdminSidebar({ activeSection, onNavigate }: AdminSidebarProps) {
    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#070B14]/95 backdrop-blur-xl border-r border-white/[0.06]">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 px-6 py-6"
            >
                <Link to="/" className="transition-transform hover:scale-105">
                    <Logo size="sm" />
                </Link>
            </motion.div>

            {/* Decorative gradient line */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />

            {/* Navigation */}
            <nav className="mt-6 flex-1 px-3">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase"
                >
                    Menu
                </motion.p>
                <ul className="flex flex-col gap-1">
                    {navItems.map((item, i) => {
                        const isActive = activeSection === item.id;
                        return (
                            <motion.li
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                            >
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${isActive
                                            ? 'bg-[#00E5FF]/[0.12] text-[#00E5FF]'
                                            : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                                        }`}
                                >
                                    {/* Active indicator glow */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute inset-0 rounded-xl border border-[#00E5FF]/20 shadow-[inset_0_1px_0_rgba(0,229,255,0.1),0_0_15px_rgba(0,229,255,0.05)]"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon
                                        className={`relative z-10 h-[18px] w-[18px] transition-all duration-300 ${isActive ? 'text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.5)]' : 'text-white/40 group-hover:text-white/60'
                                            }`}
                                    />
                                    <span className="relative z-10">{item.label}</span>
                                    {isActive && (
                                        <ChevronRight className="relative z-10 ml-auto h-4 w-4 text-[#00E5FF]/50" />
                                    )}
                                </button>
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>

            {/* Decorative gradient line */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* User profile */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mx-3 my-4 rounded-xl bg-white/[0.04] p-3 border border-white/[0.06] backdrop-blur"
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF]/30 to-[#7B2FFF]/30 text-xs font-bold text-[#00E5FF] ring-2 ring-[#00E5FF]/20">
                            AD
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#00FFC2] border-2 border-[#070B14]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white/90">Admin User</p>
                        <p className="truncate text-[11px] text-white/40">admin@qaihub.com</p>
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/60">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </aside>
    );
}
