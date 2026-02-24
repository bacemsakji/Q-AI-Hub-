import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Brain, Target, Star, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

interface Teammate {
    name: string;
    role: string;
    avatar: string;
}

interface Rating {
    label: string;
    score: number;
    max: number;
    color: string;
}

import { DashboardHeader } from '../components/DashboardHeader';

export function StartupDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [application, setApplication] = useState<any>(null);
    const profileName = localStorage.getItem('userName') || 'Founder';

    useEffect(() => {
        // Find the application in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('application-')) {
                const app = JSON.parse(localStorage.getItem(key) || '{}');
                if (app.applicationId === id) {
                    setApplication(app);
                    return;
                }
            }
        }
    }, [id]);

    if (!application) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Application not found</p>
                    <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </div>
            </div>
        );
    }

    const ratings: Rating[] = [
        { label: 'Innovation', score: 8.5, max: 10, color: '#00E5FF' },
        { label: 'Feasibility', score: 7.2, max: 10, color: '#00F5A0' },
        { label: 'Market Potential', score: 9.0, max: 10, color: '#7B2FFF' },
        { label: 'Team Strength', score: 8.0, max: 10, color: '#FFB800' },
        { label: 'Technical Execution', score: 6.8, max: 10, color: '#FF4757' },
    ];

    const teammates: Teammate[] = [
        { name: 'Firas Ben Ali', role: 'CTO & Co-founder', avatar: 'FB' },
        { name: 'Nour El Houda', role: 'Lead AI Engineer', avatar: 'NE' },
        { name: 'Sami Mansour', role: 'Frontend Developer', avatar: 'SM' },
    ];

    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            <DashboardHeader activeTab="applications" profileName={profileName} />

            {/* Content */}
            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Page Title & Hero */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00F5A0]/10 text-emerald-600 dark:text-[#00F5A0] border border-[#00F5A0]/20">
                                    Accepted
                                </div>
                                <span className="text-sm text-muted-foreground">{application.eventName}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">{application.projectName}</h1>
                            <p className="text-lg text-muted-foreground flex items-center gap-2">
                                <Target size={18} className="text-[#00E5FF]" />
                                {application.sector} Startup
                            </p>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Mission/Topic Card */}
                            <section className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-8">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <Brain size={22} className="text-purple-600 dark:text-[#7B2FFF]" />
                                    Project Topic & Vision
                                </h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Our project, <span className="text-foreground font-medium">{application.projectName}</span>, is focused on revolutionizing the {application.sector} sector through the integration of quantum-inspired algorithms and advanced AI models.
                                    </p>
                                    <p>
                                        We aim to solve the critical bottleneck in data processing efficiency by leveraging specialized architectures that significantly reduce latency while maintaining high accuracy in predictive analytics.
                                    </p>
                                </div>
                            </section>

                            {/* Team Card */}
                            <section className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-8">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <Users size={22} className="text-emerald-600 dark:text-[#00F5A0]" />
                                    The Startup Team
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {teammates.map((member, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-foreground/5 border border-border hover:border-border transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7B2FFF] flex items-center justify-center font-bold text-[#0A0E1A]">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{member.name}</h3>
                                                <p className="text-xs text-muted-foreground">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => navigate(`/startup/${id}/invite`)}
                                        className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border hover:border-border hover:bg-foreground/5 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                                            <span className="text-lg">+</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">Invite Teammate</span>
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* Performance Rating Card */}
                            <section className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-8 sticky top-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        <Star size={22} className="text-amber-600 dark:text-[#FFB800]" />
                                        Performance
                                    </h2>
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                                        <ShieldCheck size={14} className="text-[#00E5FF]" />
                                        <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider">Verified</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {ratings.map((rating, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-muted-foreground">{rating.label}</span>
                                                <span className="text-sm font-bold text-foreground">{rating.score}/{rating.max}</span>
                                            </div>
                                            <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(rating.score / rating.max) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: rating.color, boxShadow: `0 0 10px ${rating.color}40` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-4 rounded-xl bg-[#7B2FFF]/10 border border-[#7B2FFF]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles size={16} className="text-purple-600 dark:text-[#7B2FFF]" />
                                        <span className="text-xs font-bold text-purple-600 dark:text-[#7B2FFF] uppercase">AI Feedback</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                                        "Strong market potential. Focus more on technical feasibility documentation in the next phase."
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-border">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-muted-foreground">Overall Impact</span>
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00F5A0]">
                                            <TrendingUp size={16} />
                                            <span className="font-bold text-lg">Top 15%</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-center">
                                        Based on average scores from 3 jury evaluations.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
