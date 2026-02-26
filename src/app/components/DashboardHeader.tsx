import { Link, useNavigate } from 'react-router-dom';
import { Home, FileText, Bell, Settings, LogOut, Calendar, Moon, Sun } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './Button';
import { useTheme } from '../context/useTheme';

interface DashboardHeaderProps {
    activeTab?: string;
    profileName?: string;
    onTabChange?: (tabId: string) => void;
}

export function DashboardHeader({ activeTab, profileName = 'Founder', onTabChange }: DashboardHeaderProps) {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const navItems = [
        { id: 'overview', icon: Home, label: 'Overview' },
        { id: 'applications', icon: FileText, label: 'My Applications' },
        { id: 'events', icon: Calendar, label: 'Events' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const handleTabClick = (tabId: string) => {
        if (tabId === 'events') {
            navigate('/events');
            return;
        }

        if (onTabChange) {
            onTabChange(tabId);
        } else {
            navigate(`/dashboard?tab=${tabId}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/');
    };

    return (
        <header className="w-full border-b border-border bg-[rgba(10,14,26,0.95)] backdrop-blur-xl px-4 md:px-8 py-4 grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center relative z-50">
            {/* Left section: Logo */}
            <div className="flex justify-start">
                <Link to="/" className="flex items-center gap-2">
                    <Logo size="sm" />
                </Link>
            </div>

            {/* Center section: Desktop nav */}
            <div className="hidden md:flex justify-center">
                <nav className="flex items-center gap-2 rounded-full bg-foreground/5 px-2 py-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${activeTab === item.id
                                ? 'bg-white/15 text-foreground border border-border shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                                }`}
                        >
                            <item.icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Right section: User section */}
            <div className="flex justify-end flex-1 items-center gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-lg transition-colors hover:bg-white/10 border border-white/10 hover:border-white/20"
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
                    </button>
                    <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-full bg-foreground/5 border border-border">
                        <img
                            src={`https://ui-avatars.com/api/?name=${profileName}&background=00F5A0&color=0A0E1A`}
                            alt={profileName}
                            className="w-9 h-9 rounded-full"
                        />
                        <div className="flex flex-col text-left">
                            <span className="text-sm leading-tight truncate max-w-[140px] text-foreground">{profileName}</span>
                            <span className="text-xs text-muted-foreground">Student</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap justify-center h-10 w-10 sm:w-auto"
                    >
                        <LogOut size={16} className="sm:mr-2" />
                        <span className="hidden sm:inline">Log out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
