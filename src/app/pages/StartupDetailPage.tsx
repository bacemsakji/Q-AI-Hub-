import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Brain, Target, Star, Sparkles, TrendingUp, ShieldCheck, Calendar, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { toast } from 'sonner';

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
import { MonthYearPicker } from '../components/ui/month-year-picker';

export function StartupDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [application, setApplication] = useState<any>(null);
    const [milestones, setMilestones] = useState<any[]>([]);
    const [newMilestoneTask, setNewMilestoneTask] = useState('');
    const [newMilestoneDate, setNewMilestoneDate] = useState('');
    const profileName = localStorage.getItem('userName') || 'Founder';

    useEffect(() => {
        // Find the application in localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('application-')) {
                const app = JSON.parse(localStorage.getItem(key) || '{}');
                if (app.applicationId === id) {
                    setApplication(app);
                    setMilestones(app.milestones || []);
                    return;
                }
            }
        }
    }, [id]);

    const saveMilestones = (updatedMilestones: any[]) => {
        if (!application) return;
        const updatedApp = { ...application, milestones: updatedMilestones };
        localStorage.setItem(`application-${id}`, JSON.stringify(updatedApp));
        setApplication(updatedApp);
        setMilestones(updatedMilestones);
    };

    const handleAddMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMilestoneTask.trim()) return;
        const newMilestone = {
            id: crypto.randomUUID(),
            task: newMilestoneTask,
            date: newMilestoneDate || 'TBD',
            completed: false
        };
        saveMilestones([...milestones, newMilestone]);
        setNewMilestoneTask('');
        setNewMilestoneDate('');
    };

    const handleToggleMilestone = (milestoneId: string) => {
        const updated = milestones.map(m => 
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        saveMilestones(updated);
    };

    const handleDeleteMilestone = (milestoneId: string) => {
        const updated = milestones.filter(m => m.id !== milestoneId);
        saveMilestones(updated);
    };

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
                                <Target size={18} className="text-cyan-600 dark:text-[#00E5FF]" />
                                {application.sector} Startup
                            </p>
                        </div>
                        
                        {application.pitchDate && (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md flex flex-col items-center md:items-end text-center md:text-right gap-2 shadow-lg shadow-cyan-500/10"
                            >
                                <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs">
                                    <Calendar size={16} />
                                    Pitch Scheduled
                                </div>
                                <div className="text-2xl font-bold text-white tracking-tight">
                                    {new Date(application.pitchDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} at {new Date(application.pitchDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Prepare your presentation deck</p>
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info Column */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Follow-up Questions from Admin */}
                            {application.followupStatus && application.followupStatus !== 'none' && (
                                <section className="bg-card/95 backdrop-blur-xl border border-[#FFB800]/20 rounded-2xl p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <TrendingUp size={80} className="text-[#FFB800]" />
                                    </div>
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                                        <Sparkles size={22} className="text-[#FFB800]" />
                                        Progression: Idea to Pre-Seed
                                    </h2>
                                    
                                    {application.followupStatus === 'waiting_answers' ? (
                                        <div className="space-y-6 relative z-10">
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                The Admin team has requested additional information to evaluate your startup for <b>Pre-Seed</b> promotion. Please provide detailed answers below:
                                            </p>
                                            <div className="space-y-6">
                                                {application.followupQuestions?.map((q: string, i: number) => (
                                                    <div key={i} className="space-y-3">
                                                        <label className="text-sm font-bold text-white flex gap-2">
                                                            <span className="text-[#FFB800]">Q{i+1}:</span> {q}
                                                        </label>
                                                        <textarea 
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white min-h-[100px] outline-none focus:border-[#FFB800]/40 transition-all placeholder:text-muted-foreground/30 shadow-inner"
                                                            placeholder="Type your response here..."
                                                            id={`answer-${i}`}
                                                        />
                                                    </div>
                                                ))}
                                                <Button 
                                                    fullWidth
                                                    onClick={() => {
                                                        const answers = application.followupQuestions.map((_: any, i: number) => 
                                                            (document.getElementById(`answer-${i}`) as HTMLTextAreaElement).value
                                                        );
                                                        const updatedApp = { 
                                                            ...application, 
                                                            followupStatus: 'answers_received',
                                                            followupAnswers: answers 
                                                        };
                                                        localStorage.setItem(`application-${id}`, JSON.stringify(updatedApp));
                                                        setApplication(updatedApp);
                                                        toast.success('Answers submitted to Admin!');
                                                    }}
                                                    className="h-12 bg-gradient-to-r from-[#FFB800] to-orange-500 border-none shadow-lg shadow-orange-500/20"
                                                >
                                                    Submit for Review
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-6 text-center space-y-3">
                                            <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                <CheckCircle2 size={32} className="text-emerald-400" />
                                            </div>
                                            <p className="text-lg font-bold text-white tracking-tight">Review in Progress</p>
                                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">Your answers have been submitted. The jury is now reviewing your project for Pre-Seed promotion.</p>
                                        </div>
                                    )}
                                </section>
                            )}

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

                            {/* Milestones Card */}
                            <section className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-8">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <Target size={22} className="text-cyan-600 dark:text-[#00E5FF]" />
                                    Startup Milestones
                                </h2>
                                
                                <div className="space-y-4 mb-8">
                                    {milestones.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No milestones added yet. Start by setting your next goals.</p>
                                    ) : (
                                        milestones.map((m) => (
                                            <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground">
                                                        <Target size={20} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium ${m.completed ? 'text-muted-foreground line-through decoration-primary/40' : 'text-foreground'}`}>
                                                            {m.task}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 bg-foreground/5 px-2 py-0.5 rounded-full w-fit">
                                                            <Calendar size={12} className="text-cyan-500" />
                                                            {m.date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleToggleMilestone(m.id)}
                                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                            m.completed 
                                                                ? 'bg-[#00F5A0]/10 border-[#00F5A0]/30 text-[#00F5A0] shadow-[0_0_10px_rgba(0,245,160,0.1)]' 
                                                                : 'bg-foreground/5 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                                        }`}
                                                    >
                                                        {m.completed ? 'Achieved' : 'Mark as Achieved'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteMilestone(m.id)}
                                                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handleAddMilestone} className="space-y-4 pt-6 border-t border-border/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider ml-1">Milestone Task</label>
                                            <input
                                                type="text"
                                                value={newMilestoneTask}
                                                onChange={(e) => setNewMilestoneTask(e.target.value)}
                                                placeholder="e.g. Launch Beta Version"
                                                className="w-full rounded-xl bg-input border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/40 placeholder:text-muted-foreground/50 transition-all h-10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider ml-1">Approximate Date</label>
                                            <MonthYearPicker
                                                date={newMilestoneDate}
                                                onSelect={(date) => setNewMilestoneDate(date)}
                                                placeholder="Select Month & Year"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newMilestoneTask.trim() || !newMilestoneDate}
                                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm h-11"
                                    >
                                        <Plus size={18} />
                                        Add Milestone
                                    </button>
                                </form>
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
                                        <ShieldCheck size={14} className="text-cyan-600 dark:text-[#00E5FF]" />
                                        <span className="text-[10px] font-bold text-cyan-600 dark:text-[#00E5FF] uppercase tracking-wider">Verified</span>
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
