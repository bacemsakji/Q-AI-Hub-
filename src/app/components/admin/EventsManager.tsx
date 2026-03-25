import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MapPin, CalendarDays, Users, ArrowRight, Filter, X, ArrowLeft, Eye, Clock, FileText, Download, ExternalLink, Sparkles, Brain, Target, Star, CheckCircle2, TrendingUp, UserPlus, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminEvents as initialEvents, applicantsByEvent, questionSuggestions, type AdminEvent, type Applicant } from '../../data/adminData';
import { Button } from '../Button';
import { DateTimePicker } from '../ui/datetime-picker';
import { InviteExpertsPanel } from './InviteExpertsPanel';
import { toast } from 'sonner';

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
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [customQuestion, setCustomQuestion] = useState('');
    const [followupStatus, setFollowupStatus] = useState(applicant.followupStatus || 'none');
    const [pitchDate, setPitchDate] = useState<Date | undefined>(applicant.pitchDate ? new Date(applicant.pitchDate) : undefined);

    const [expectations, setExpectations] = useState(applicant.questionnaireAnswers?.expectations || '');

    const saveToLocalStorage = (updates: any) => {
        const key = `application-${applicant.id}`;
        const existing = JSON.parse(localStorage.getItem(key) || '{}');
        const updated = { ...existing, ...updates };
        localStorage.setItem(key, JSON.stringify(updated));
    };

    const questionnaireQuestions = [
        { id: 'vision', title: 'Vision & Impact', icon: <Brain size={18} className="text-purple-500" /> },
        { id: 'validation', title: 'Market Validation', icon: <Target size={18} className="text-cyan-500" /> },
        { id: 'technical', title: 'Technical Depth', icon: <Sparkles size={18} className="text-amber-500" /> },
        { id: 'team', title: 'Team Strength', icon: <Users size={18} className="text-emerald-500" /> },
        { id: 'expectations', title: 'Q-AI Hub Goals', icon: <Star size={18} className="text-blue-500" /> }
    ];

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[900px] flex-col border-l border-border bg-[#0A0E1A]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-8 py-6 bg-card/30">
                <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#7B2FFF] text-2xl font-bold text-[#0A0E1A] shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
                        {applicant.avatar || applicant.startup[0]}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{applicant.startup}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-medium text-cyan-400">Founder: {applicant.name}</span>
                            <div className="w-1 h-1 rounded-full bg-border" />
                            <StatusBadge status={applicant.status} />
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all border border-border/50"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-12 gap-8">
                    {/* Main Content Column */}
                    <div className="col-span-8 space-y-8">
                        
                        {/* Vision & Topic Card (Replicating Startup Page) */}
                        <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-sm">
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Brain size={18} className="text-purple-400" />
                                Project Vision & Topic
                            </h4>
                            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                                <p>
                                    Our project, <span className="text-white font-semibold">{applicant.startup}</span>, leverages advanced technological frameworks to solve critical bottlenecks in the current market.
                                </p>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 italic">
                                    "{applicant.answers.find(a => a.question === 'Pitch')?.answer || 'No project description provided yet.'}"
                                </div>
                            </div>
                        </section>

                        {/* Deep-Dive Questionnaire Section */}
                        {applicant.questionnaireAnswers && (
                            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-cyan-400 mb-6 flex items-center gap-2 uppercase tracking-wider">
                                    <Sparkles size={18} />
                                    Deep-Dive Evaluation
                                </h4>
                                <div className="grid grid-cols-1 gap-6">
                                    {questionnaireQuestions.map((q) => applicant.questionnaireAnswers![q.id] && (
                                        <div key={q.id} className="group">
                                            <div className="flex items-center gap-2 mb-2 text-white font-semibold text-sm">
                                                {q.icon}
                                                {q.title}
                                            </div>
                                            <div className="rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-muted-foreground border border-white/5 group-hover:bg-white/[0.07] transition-colors">
                                                {applicant.questionnaireAnswers![q.id]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Milestones Card */}
                        <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-sm">
                            <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                                <Target size={18} className="text-emerald-400" />
                                Development Milestones
                            </h4>
                            <div className="space-y-3">
                                {!applicant.milestones || applicant.milestones.length === 0 ? (
                                    <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                                        <p className="text-xs text-muted-foreground italic">No milestones set for this application phase.</p>
                                    </div>
                                ) : (
                                    applicant.milestones.map((m: any) => (
                                        <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${m.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {m.completed ? <CheckCircle2 size={16} /> : <Target size={16} />}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${m.completed ? 'text-muted-foreground line-through decoration-emerald-500/30' : 'text-white'}`}>
                                                        {m.task}
                                                    </p>
                                                    <span className="text-[10px] text-muted-foreground mt-0.5 block">{m.date}</span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${m.completed ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                                                {m.completed ? 'Done' : 'Pending'}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Progression Workflow (Idea -> Pre-Seed) */}
                        {applicant.status === 'Accepted' && (
                            <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-[#FFB800] mb-6 flex items-center gap-2 uppercase tracking-wider">
                                    <TrendingUp size={18} />
                                    Idea Progression Workflow
                                </h4>

                                {followupStatus === 'none' && (
                                    <div className="space-y-6">
                                        <p className="text-sm text-muted-foreground">This startup is in the <b>Idea</b> stage. Send follow-up questions to evaluate their potential for <b>Pre-Seed</b> promotion.</p>
                                        
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-widest font-bold">Pick Suggested Questions</label>
                                            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/5">
                                                {['Provide more technical details on your architecture.', 'How do you plan to monetize this in the first year?', 'What is your current team composition and hiring plan?', 'Describe your competitive advantage in the local market.'].map(q => (
                                                    <button 
                                                        key={q}
                                                        onClick={() => setSelectedQuestions(prev => prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q])}
                                                        className={`text-left p-3 rounded-lg text-xs transition-all border ${selectedQuestions.includes(q) ? 'bg-cyan-500/20 border-cyan-500/50 text-white' : 'hover:bg-white/5 border-transparent text-muted-foreground'}`}
                                                    >
                                                        {q}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-muted-foreground block uppercase tracking-widest font-bold">Add Custom Question</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={customQuestion}
                                                    onChange={(e) => setCustomQuestion(e.target.value)}
                                                    placeholder="Type your own question..."
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-all shadow-inner"
                                                />
                                                <Button 
                                                    variant="outline"
                                                    onClick={() => {
                                                        if (customQuestion.trim()) {
                                                            setSelectedQuestions(prev => [...prev, customQuestion]);
                                                            setCustomQuestion('');
                                                        }
                                                    }}
                                                    className="!px-3"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>

                                        {selectedQuestions.length > 0 && (
                                            <div className="pt-4 border-t border-white/5">
                                                <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-widest">Questions to Send ({selectedQuestions.length})</p>
                                                <ul className="space-y-2 mb-6">
                                                    {selectedQuestions.map((q, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-white bg-white/5 p-2 rounded-lg border border-white/5">
                                                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                                                            {q}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Button 
                                                    fullWidth 
                                                    onClick={() => {
                                                        const newStatus = 'waiting_answers';
                                                        setFollowupStatus(newStatus);
                                                        saveToLocalStorage({ 
                                                            followupStatus: newStatus,
                                                            followupQuestions: selectedQuestions 
                                                        });
                                                        toast.success('Questions sent to startup!');
                                                    }}
                                                    className="shadow-lg shadow-cyan-500/20"
                                                >
                                                    Send Questions
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {followupStatus === 'waiting_answers' && (
                                    <div className="text-center py-10 space-y-4">
                                        <div className="relative inline-block">
                                            <Clock size={48} className="text-cyan-400/30 animate-pulse" />
                                            <div className="absolute inset-0 bg-cyan-400/10 blur-2xl rounded-full" />
                                        </div>
                                        <p className="text-lg font-medium text-white tracking-tight">Waiting for Founder's response...</p>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">The startup founder has been notified. You will see their answers here once submitted.</p>
                                        <div className="pt-4">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20">Questions Sent</span>
                                        </div>
                                    </div>
                                )}

                                {followupStatus === 'answers_received' && (
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            {applicant.followupQuestions?.map((q, i) => (
                                                <div key={i} className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                                    <p className="text-sm font-bold text-white flex gap-2">
                                                        <span className="text-cyan-400 tracking-tighter">Q:</span>
                                                        {q}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground pl-6 border-l border-white/10 ml-1 py-1 italic leading-relaxed">
                                                        "{applicant.followupAnswers?.[i] || 'No answer provided.'}"
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-8 border-t border-white/10">
                                            <div className="flex gap-4">
                                                <Button 
                                                    fullWidth 
                                                    onClick={() => {
                                                        saveToLocalStorage({ stage: 'Pre-Seed', status: 'Accepted' });
                                                        toast.success('Startup promoted to Pre-Seed!');
                                                        onClose();
                                                    }}
                                                    className="h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20"
                                                >
                                                    <TrendingUp className="mr-2 h-4 w-4" />
                                                    Promote to Pre-Seed
                                                </Button>
                                                <Button 
                                                    fullWidth 
                                                    variant="outline"
                                                    onClick={() => {
                                                        toast.warning('Promotion ignored for now.');
                                                        onClose();
                                                    }}
                                                    className="h-12 border-white/10 text-white hover:bg-white/5"
                                                >
                                                    Ignore Promotion
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="col-span-4 space-y-6">
                        {/* Status & Actions Sidebar Card */}
                        <section className="bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-0 shadow-xl">
                            <h4 className="text-xs font-bold text-cyan-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                                <Clock size={16} />
                                Submission Details
                            </h4>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Submission Date</span>
                                    <span className="text-white font-medium">{applicant.submittedAt}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Contact</span>
                                    <span className="text-white font-medium truncate ml-2">{applicant.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Project Sector</span>
                                    <span className="text-white font-medium">{applicant.answers.find(a => a.question === 'Sector')?.answer || 'N/A'}</span>
                                </div>
                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Schedule Pitch</span>
                                    <DateTimePicker 
                                        date={pitchDate} 
                                        setDate={(d) => {
                                            setPitchDate(d);
                                            saveToLocalStorage({ pitchDate: d?.toISOString() });
                                            toast.success(`Pitch scheduled for ${d?.toLocaleString()}`);
                                        }}
                                        className="!bg-white/5 !border-white/10 !h-10 !text-xs"
                                    />
                                    {pitchDate && (
                                        <p className="text-[10px] text-muted-foreground text-center">Founder has been notified of the pitch date.</p>
                                    )}
                                </div>
                            </div>

                            {applicant.status !== 'Accepted' && (
                                <div className="mt-8 flex flex-col gap-3">
                                    <Button fullWidth className="shadow-lg shadow-cyan-500/20">
                                        Accept Startup
                                    </Button>
                                    <Button fullWidth variant="outline" className="border-white/10 text-white hover:bg-white/5">
                                        Request Revision
                                    </Button>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function EventDetail({ event, onBack, navigate }: { event: AdminEvent; onBack: () => void; navigate: (path: string) => void }) {
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [searchApplicant, setSearchApplicant] = useState('');
    
    // Merge mock data with real applications from localStorage
    const [allApplicants, setAllApplicants] = useState<Applicant[]>([]);

    useState(() => {
        const mockApplicants = applicantsByEvent[event.id] || [];
        const realApplications: Applicant[] = [];
        
        // Scan localStorage for applications related to this event
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('application-')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key) || '{}');
                    // Check if it's the right event or program
                    if (data.eventId?.toString() === event.id.toString()) {
                        realApplications.push({
                            id: data.applicationId || `real-${i}`,
                            userId: 'real-user',
                            name: localStorage.getItem('userName') || 'Founder',
                            email: localStorage.getItem('userEmail') || 'founder@example.com',
                            startup: data.projectName || data.startupName || 'Unnamed Startup',
                            avatar: (data.projectName || data.startupName || 'U')[0].toUpperCase(),
                            status: data.status || 'Pending',
                            submittedAt: data.submittedDate ? new Date(data.submittedDate).toLocaleDateString() : 'Recent',
                            answers: [
                                { question: 'Project Tagline', answer: data.tagline || 'N/A', type: 'text' },
                                { question: 'Sector', answer: data.sector || 'N/A', type: 'text' },
                                { question: 'Pitch', answer: data.pitchOriginal || data.description || 'N/A', type: 'text' },
                                { question: 'GitHub', answer: data.githubUrl || 'N/A', type: 'url' },
                            ],
                            questionnaireAnswers: data.questionnaireAnswers,
                            milestones: data.milestones || []
                        });
                    }
                } catch (e) {
                    console.error('Error parsing application data', e);
                }
            }
        }

        // Filter out mock duplicates if real ones exist
        setAllApplicants([...realApplications, ...mockApplicants]);
    });

    const filtered = allApplicants.filter(a => a.name.toLowerCase().includes(searchApplicant.toLowerCase()) || a.startup.toLowerCase().includes(searchApplicant.toLowerCase()));

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div>
                <button onClick={onBack} className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"><ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />Back to Events</button>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-24 overflow-hidden rounded-xl border border-border">
                            <img src={event.image} alt={event.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{event.title}</h2>
                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]/60" />{event.date}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]/60" />{event.location}</span>
                                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00E5FF]/60" />{allApplicants.length} Applicants</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                            className="!px-4 !py-2 !text-sm border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                        >
                            <Pencil className="h-4 w-4" />
                            Modify Event
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                // @ts-ignore - we'll handle this in the parent EventsManager
                                document.dispatchEvent(new CustomEvent('open-partner-modal', { detail: event.id }));
                            }}
                            className="!px-4 !py-2 !text-sm border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
                        >
                            <UserPlus className="h-4 w-4" />
                            Add Partner
                        </Button>
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
                    <p className="text-sm text-muted-foreground">Viewing <span className="font-semibold text-foreground">{allApplicants.length}</span> startups participating</p>
                    <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" placeholder="Search startups or founders..." value={searchApplicant} onChange={e => setSearchApplicant(e.target.value)}
                            className="h-9 w-64 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20 transition-all" />
                    </div>
                </div>
                {allApplicants.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-12 text-center"><Users className="mx-auto h-10 w-10 text-muted-foreground/40" /><p className="mt-3 text-sm text-muted-foreground">No applications yet</p></div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                        <table className="w-full">
                            <thead><tr className="border-b border-border bg-muted">
                                {['Startup', 'Founder/Lead', 'Submitted', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {filtered.map((a, i) => (
                                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                        className="border-b border-border hover:bg-muted transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF]/10 to-[#7B2FFF]/10 text-xs font-bold text-cyan-600 dark:text-[#00E5FF] border border-[#00E5FF]/10">
                                                    {a.avatar || a.startup[0]}
                                                </div>
                                                <div className="font-semibold text-foreground text-sm">{a.startup}</div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div>
                                                <p className="text-sm font-medium text-foreground/80">{a.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{a.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-muted-foreground">{a.submittedAt}</td>
                                        <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                                        <td className="px-5 py-3.5 text-right">
                                            <Button
                                                variant="outline"
                                                onClick={() => setSelectedApplicant(a)}
                                                className="!px-3 !py-1.5 !text-xs"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Review
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
    const [partneringEventId, setPartneringEventId] = useState<string | null>(null);

    useEffect(() => {
        const handler = (e: any) => {
            if (e.detail) setPartneringEventId(e.detail);
        };
        document.addEventListener('open-partner-modal', handler);
        return () => document.removeEventListener('open-partner-modal', handler);
    }, []);

    const filtered = eventsList.filter(e => {
        const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || e.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalApplicants = eventsList.reduce((a, e) => a + e.applicants, 0);
    const openCount = eventsList.filter(e => e.status === 'Open').length;

    if (selectedEvent) return <EventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} navigate={navigate} />;

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
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedEvent(event)}
                                    className="!px-3 !py-2 !text-xs group/btn !h-9"
                                >
                                    Review
                                    <ArrowRight className="h-3.2 w-3.2 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                                    className="!px-3 !py-2 !text-xs group/btn !h-9 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                                >
                                    <Pencil className="h-3.2 w-3.2" />
                                    Modify
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPartneringEventId(event.id);
                                    }}
                                    className="col-span-2 !px-4 !py-2.5 !text-xs group/btn !h-9 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    Add Partner
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {partneringEventId && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-md"
                            onClick={() => setPartneringEventId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl"
                        >
                            <button
                                onClick={() => setPartneringEventId(null)}
                                className="absolute right-4 top-4 z-10 p-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <InviteExpertsPanel
                                eventId={partneringEventId}
                                onChange={() => {}}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
