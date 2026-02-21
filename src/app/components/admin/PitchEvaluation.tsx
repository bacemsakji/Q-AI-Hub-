import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Star, Brain, CheckCircle, XCircle, Timer, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminEvents, applicantsByEvent, evaluationCriteria, startups, type AdminEvent, type Startup } from '../../data/adminData';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const cardItem = { hidden: { opacity: 0, y: 24, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } } };

/* Group applicants by startup name and return unique startups per event */
function getStartupsForEvent(eventId: string) {
    const applicants = (applicantsByEvent[eventId] || []).filter(a => a.status === 'Accepted');
    const seen = new Set<string>();
    const result: { startupName: string; startup?: Startup; members: typeof applicants }[] = [];
    for (const a of applicants) {
        if (!seen.has(a.startup)) {
            seen.add(a.startup);
            const members = applicants.filter(x => x.startup === a.startup);
            const startup = startups.find(s => s.name === a.startup);
            result.push({ startupName: a.startup, startup, members });
        }
    }
    return result;
}

function EventsList({ onSelectEvent }: { onSelectEvent: (event: AdminEvent) => void }) {
    const eventsWithStartups = adminEvents.filter(e => getStartupsForEvent(e.id).length > 0);
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-white">Pitch Evaluation</h2>
                <p className="mt-1 text-sm text-[#8892A4]">Select an event to evaluate accepted startups</p>
            </motion.div>
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventsWithStartups.map(event => {
                    const eventStartups = getStartupsForEvent(event.id);
                    return (
                        <motion.button key={event.id} variants={cardItem}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,229,255,0.08)' }}
                            onClick={() => onSelectEvent(event)}
                            className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[rgba(15,22,40,0.95)] text-left transition-colors hover:border-white/[0.12]">
                            <div className="relative h-32 overflow-hidden">
                                <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" crossOrigin="anonymous" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/40 to-transparent" />
                                <div className="absolute bottom-3 left-3"><h3 className="text-sm font-bold text-white drop-shadow-lg">{event.title}</h3></div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-3 text-xs text-[#8892A4] mb-3"><Calendar className="h-3 w-3 text-[#00E5FF]/50" />{event.date}<MapPin className="h-3 w-3 ml-1 text-[#00E5FF]/50" />{event.location}</div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[#00FFC2]" /><span className="text-sm font-semibold text-white">{eventStartups.length}</span><span className="text-xs text-[#8892A4]">{eventStartups.length === 1 ? 'startup' : 'startups'}</span></div>
                                    <span className="text-xs font-semibold text-[#00E5FF] group-hover:translate-x-1 transition-transform">Evaluate →</span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}

function StartupsList({ event, onSelectStartup, onBack }: { event: AdminEvent; onSelectStartup: (s: ReturnType<typeof getStartupsForEvent>[0]) => void; onBack: () => void }) {
    const eventStartups = getStartupsForEvent(event.id);
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div>
                <button onClick={onBack} className="mb-3 flex items-center gap-2 text-sm font-medium text-[#8892A4] hover:text-white transition-colors group"><ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />Back to Events</button>
                <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                <p className="mt-1 text-sm text-[#8892A4]">Select a startup to evaluate their pitch</p>
            </div>
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventStartups.map(s => (
                    <motion.button key={s.startupName} variants={cardItem}
                        whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(0,229,255,0.06)' }}
                        onClick={() => onSelectStartup(s)}
                        className="rounded-2xl border border-white/[0.06] bg-[rgba(15,22,40,0.95)] p-5 text-left hover:border-white/[0.12] transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#7B2FFF]/20 text-lg font-bold text-[#00E5FF] ring-2 ring-[#00E5FF]/15">
                                {s.startup?.logo || s.startupName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-white">{s.startupName}</h3>
                                {s.startup && <p className="text-xs text-[#8892A4]">{s.startup.industry} · {s.startup.stage}</p>}
                            </div>
                            <span className="text-xs font-semibold text-[#00E5FF]">Evaluate →</span>
                        </div>
                        {/* Team Members */}
                        <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 text-[#8892A4]" />
                            <span className="text-xs text-[#8892A4]">Team:</span>
                            <div className="flex -space-x-2">
                                {s.members.map((m, i) => (
                                    <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#7B2FFF]/20 text-[10px] font-bold text-[#00E5FF] ring-2 ring-[#0F1628]">
                                        {m.avatar}
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs text-white/60 ml-1">{s.members.map(m => m.name.split(' ')[0]).join(', ')}</span>
                        </div>
                    </motion.button>
                ))}
            </motion.div>
        </motion.div>
    );
}

function EvaluationView({ event, startupInfo, onBack }: { event: AdminEvent; startupInfo: ReturnType<typeof getStartupsForEvent>[0]; onBack: () => void }) {
    const [scores, setScores] = useState<Record<string, number>>({});
    const [notes, setNotes] = useState('');
    const [aiFeedback, setAiFeedback] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const totalScore = Object.values(scores).reduce((a, v) => a + v, 0);
    const maxScore = evaluationCriteria.length * 10;
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    useEffect(() => {
        if (timerActive) {
            timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [timerActive]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 2000));
        const avg = evaluationCriteria.length > 0 ? totalScore / evaluationCriteria.length : 0;
        const strengths = Object.entries(scores).filter(([, v]) => v >= 7).map(([k]) => evaluationCriteria.find(c => c.key === k)?.label).filter(Boolean);
        setAiFeedback(
            `${startupInfo.startupName} demonstrates ${avg >= 7 ? 'exceptional' : avg >= 5 ? 'promising' : 'early-stage'} potential across the evaluation criteria. ` +
            `With an overall score of ${totalScore}/${maxScore} (${percentage}%), ${percentage >= 70 ? 'this startup is well-positioned for advancement to the next stage of the program' : 'we recommend providing targeted mentorship before making a final decision'}. ` +
            (strengths.length > 0 ? `Key strengths include ${strengths.join(', ')}. ` : '') +
            `Team size: ${startupInfo.members.length} members (${startupInfo.members.map(m => m.name).join(', ')}). ` +
            `${percentage >= 70 ? '✅ Recommended for advancement.' : '⚠️ Consider additional mentorship sessions.'}`
        );
        setIsGenerating(false);
    };

    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div>
                <button onClick={onBack} className="mb-3 flex items-center gap-2 text-sm font-medium text-[#8892A4] hover:text-white transition-colors group"><ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />Back to Startups</button>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF]/25 to-[#7B2FFF]/25 text-lg font-bold text-[#00E5FF] ring-2 ring-[#00E5FF]/20">
                            {startupInfo.startup?.logo || startupInfo.startupName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{startupInfo.startupName}</h2>
                            {startupInfo.startup && <p className="text-sm text-[#00E5FF]">{startupInfo.startup.industry} · {startupInfo.startup.stage}</p>}
                            <p className="text-xs text-[#8892A4]">Event: {event.title}</p>
                        </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setTimerActive(!timerActive)}
                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${timerActive ? 'bg-[#FF4757]/15 text-[#FF4757] border border-[#FF4757]/25 shadow-[0_0_15px_rgba(255,71,87,0.1)]' : 'bg-white/[0.04] text-white border border-white/[0.08]'}`}>
                        <Timer className="h-4 w-4" />{formatTime(timer)}{timerActive ? ' ■ Stop' : ' ▶ Start'}
                    </motion.button>
                </div>
            </div>

            {/* Team Members Card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-[#00FFC2]" />
                    <h3 className="text-sm font-bold text-white">Team Members ({startupInfo.members.length})</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {startupInfo.members.map((m, i) => (
                        <div key={i} className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#7B2FFF]/20 text-xs font-bold text-[#00E5FF]">{m.avatar}</div>
                            <div>
                                <p className="text-sm font-medium text-white">{m.name}</p>
                                <p className="text-[10px] text-[#8892A4]">{m.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Scoring */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="h-5 w-5 text-[#00E5FF]" />
                            <h3 className="text-lg font-bold text-white">Evaluation Criteria</h3>
                        </div>
                        <div className="space-y-6">
                            {evaluationCriteria.map((criterion, i) => {
                                const score = scores[criterion.key || ''] || 0;
                                return (
                                    <motion.div key={criterion.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="text-sm font-semibold" style={{ color: criterion.color }}>{criterion.label}</p>
                                                <p className="text-xs text-[#8892A4]">{criterion.description}</p>
                                            </div>
                                            <motion.span key={score} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-2xl font-bold tabular-nums" style={{ color: criterion.color }}>
                                                {score}<span className="text-sm text-[#8892A4]">/10</span>
                                            </motion.span>
                                        </div>
                                        <input type="range" min="0" max="10" value={score}
                                            onChange={e => setScores({ ...scores, [criterion.key || '']: Number(e.target.value) })}
                                            className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/30 [&::-webkit-slider-thumb]:shadow-lg"
                                            style={{
                                                background: `linear-gradient(to right, ${criterion.color} 0%, ${criterion.color} ${score * 10}%, #1A2035 ${score * 10}%, #1A2035 100%)`,
                                                // @ts-ignore
                                                '--thumb-color': criterion.color,
                                            }}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Notes */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
                        <label className="block text-sm font-semibold text-white mb-2">Evaluator Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Capture observations about the startup, team strengths, risks, or follow-up questions..."
                            className="w-full px-4 py-3 bg-[#0F1628] rounded-xl border border-white/[0.08] text-white text-sm leading-relaxed outline-none focus:border-[#00E5FF]/40 focus:ring-1 focus:ring-[#00E5FF]/20 min-h-[120px] resize-none placeholder:text-[#8892A4]/40 transition-all" />
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Score Summary */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 text-center">
                        <p className="text-xs text-[#8892A4] mb-2 uppercase tracking-wider">Total Score</p>
                        <motion.p key={totalScore} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-5xl font-bold text-white tabular-nums">
                            {totalScore}<span className="text-xl text-[#8892A4]">/{maxScore}</span>
                        </motion.p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                            <motion.div animate={{ width: `${percentage}%` }} transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                                className="h-full rounded-full" style={{ background: percentage >= 70 ? 'linear-gradient(to right, #00E5FF, #00FFC2)' : percentage >= 50 ? 'linear-gradient(to right, #FFB800, #FF8800)' : 'linear-gradient(to right, #FF4757, #FF3344)' }} />
                        </div>
                        <p className="mt-2 text-lg font-bold" style={{ color: percentage >= 70 ? '#00FFC2' : percentage >= 50 ? '#FFB800' : '#FF4757' }}>{percentage}%</p>
                        <p className="mt-1 text-xs text-[#8892A4]">{percentage >= 70 ? 'Strong startup for advancement' : percentage >= 50 ? 'Promising — consider mentorship' : 'Needs significant improvement'}</p>
                    </motion.div>

                    {/* AI Feedback — Premium */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="relative overflow-hidden bg-[rgba(15,22,40,0.95)] backdrop-blur-xl rounded-2xl p-6"
                        style={{ border: '1px solid transparent', backgroundClip: 'padding-box', backgroundImage: 'linear-gradient(rgba(15,22,40,0.95), rgba(15,22,40,0.95)), linear-gradient(135deg, #00E5FF40, #7B2FFF40, #00FFC240)', backgroundOrigin: 'border-box' }}>
                        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-[#00E5FF]/10 to-[#7B2FFF]/10 blur-2xl pointer-events-none" />
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-[#7B2FFF]/8 to-[#00FFC2]/8 blur-xl pointer-events-none" />

                        <div className="relative">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00E5FF]/20 to-[#7B2FFF]/20">
                                    <Brain className="h-4 w-4 text-[#00E5FF]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">AI Analysis</p>
                                    <p className="text-[10px] text-[#8892A4]">Powered by Q-AI Engine</p>
                                </div>
                            </div>

                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={handleGenerate} disabled={isGenerating}
                                className="w-full relative overflow-hidden flex items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-50 mb-5 group"
                                style={{ background: 'linear-gradient(135deg, #00E5FF, #7B2FFF, #00FFC2)', backgroundSize: '200% 200%' }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <Sparkles className="h-4 w-4" />
                                {isGenerating ? 'Analyzing startup data...' : 'Generate AI Analysis'}
                            </motion.button>

                            <AnimatePresence mode="wait">
                                {isGenerating && (
                                    <motion.div key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                        className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        {[1, 0.9, 0.75, 0.6].map((w, i) => (
                                            <div key={i} className="h-2.5 rounded-full overflow-hidden" style={{ width: `${w * 100}%`, background: '#1A2035' }}>
                                                <motion.div animate={{ x: ['0%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15, ease: 'easeInOut' }}
                                                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />
                                            </div>
                                        ))}
                                        <p className="text-[10px] text-[#8892A4] text-center mt-2">Processing startup evaluation…</p>
                                    </motion.div>
                                )}
                                {aiFeedback && !isGenerating && (
                                    <motion.div key="result" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="relative overflow-hidden rounded-xl border border-[#00E5FF]/15">
                                        <div className="h-1 w-full bg-gradient-to-r from-[#00E5FF] via-[#7B2FFF] to-[#00FFC2]" />
                                        <div className="p-4 bg-gradient-to-b from-[#00E5FF]/[0.03] to-transparent">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#00E5FF]/10">
                                                    <Brain className="h-3 w-3 text-[#00E5FF]" />
                                                </div>
                                                <span className="text-[10px] font-bold tracking-[0.15em] text-[#00E5FF] uppercase">AI Assessment</span>
                                                <div className="ml-auto flex items-center gap-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#00FFC2] animate-pulse" />
                                                    <span className="text-[9px] text-[#00FFC2]">Live</span>
                                                </div>
                                            </div>
                                            <p className="text-[13px] text-white/75 leading-[1.7]">{aiFeedback}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-2">
                        <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,255,194,0.25)' }} whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00FFC2] px-4 py-3 text-sm font-bold text-[#0A0E1A] shadow-lg shadow-[#00FFC2]/20"><CheckCircle className="h-4 w-4" />Pass Startup</motion.button>
                        <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255,71,87,0.25)' }} whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF4757] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF4757]/20"><XCircle className="h-4 w-4" />Fail Startup</motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="w-full rounded-xl border border-white/[0.08] px-4 py-3 text-sm font-medium text-white hover:bg-white/[0.04] transition-colors"><Star className="inline h-4 w-4 mr-1.5 text-[#FFB800]" />Save Draft</motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

type PitchView = 'events' | 'startups' | 'evaluate';

export function PitchEvaluation() {
    const [view, setView] = useState<PitchView>('events');
    const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
    const [selectedStartup, setSelectedStartup] = useState<ReturnType<typeof getStartupsForEvent>[0] | null>(null);

    if (view === 'evaluate' && selectedEvent && selectedStartup) {
        return <EvaluationView event={selectedEvent} startupInfo={selectedStartup} onBack={() => { setView('startups'); setSelectedStartup(null); }} />;
    }
    if (view === 'startups' && selectedEvent) {
        return <StartupsList event={selectedEvent} onSelectStartup={s => { setSelectedStartup(s); setView('evaluate'); }} onBack={() => { setView('events'); setSelectedEvent(null); }} />;
    }
    return <EventsList onSelectEvent={e => { setSelectedEvent(e); setView('startups'); }} />;
}
