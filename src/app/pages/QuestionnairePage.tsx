import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Brain, Target, Users, Sparkles, Rocket } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { DashboardHeader } from '../components/DashboardHeader';
import { Button } from '../components/Button';

export function QuestionnairePage() {
    const { id, type } = useParams<{ id: string; type: string }>(); // type is 'event' or 'program'
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({
        vision: '',
        validation: '',
        technical: '',
        team: '',
        expectations: ''
    });

    const profileName = localStorage.getItem('userName') || 'Founder';

    const questions = [
        {
            id: 'vision',
            title: 'Vision & Impact',
            question: 'Where do you see your startup in 3 years? What is the ultimate impact you want to create?',
            icon: <Rocket className="text-purple-500" size={24} />,
            placeholder: 'In 3 years, we aim to be the leading...'
        },
        {
            id: 'validation',
            title: 'Market Validation',
            question: 'What is the most significant piece of feedback you\'ve received from a potential customer so far?',
            icon: <Target className="text-cyan-500" size={24} />,
            placeholder: 'A key customer mentioned that our interface...'
        },
        {
            id: 'technical',
            title: 'Technical Depth',
            question: 'What is the biggest technical hurdle you are currently facing or anticipate in the next 6 months?',
            icon: <Brain className="text-emerald-500" size={24} />,
            placeholder: 'Scaling our quantum-inspired algorithm to handle...'
        },
        {
            id: 'team',
            title: 'Team Strength',
            question: 'What makes your founding team uniquely qualified to solve this specific problem?',
            icon: <Users className="text-amber-500" size={24} />,
            placeholder: 'Our team combines expertise in AI with...'
        },
        {
            id: 'expectations',
            title: 'Q-AI Hub Goals',
            question: 'What are your top 3 expectations from this program? How can we help you most?',
            icon: <Sparkles className="text-pink-500" size={24} />,
            placeholder: '1. Access to specialized hardware\n2. Mentorship in...\n3. Networking with...'
        }
    ];

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        // Find the application in localStorage and update it
        const storageKey = `application-${id}`;
        const existingApp = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const updatedApp = {
            ...existingApp,
            questionnaireAnswers: answers,
            hasCompletedQuestionnaire: true
        };
        localStorage.setItem(storageKey, JSON.stringify(updatedApp));
        
        navigate('/dashboard?tab=applications', { state: { showSuccess: true } });
    };

    const currentQ = questions[currentStep];

    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            <DashboardHeader activeTab="" profileName={profileName} />

            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Deep Dive Questionnaire</h1>
                        <span className="text-sm text-cyan-500 font-mono">Step {currentStep + 1} of {questions.length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-card/95 backdrop-blur-xl border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                                {currentQ.icon}
                            </div>
                            <h2 className="text-2xl font-bold">{currentQ.title}</h2>
                        </div>

                        <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                            {currentQ.question}
                        </p>

                        <textarea
                            autoFocus
                            value={answers[currentQ.id]}
                            onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                            className="w-full bg-foreground/5 border border-border rounded-2xl p-6 text-foreground outline-none focus:border-cyan-500/50 min-h-[200px] transition-all resize-none placeholder:text-muted-foreground/30"
                            placeholder={currentQ.placeholder}
                        />

                        <div className="mt-10 flex items-center justify-between gap-4">
                            <button
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                disabled={currentStep === 0}
                                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:bg-foreground/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            
                            <Button
                                onClick={handleNext}
                                disabled={!answers[currentQ.id].trim()}
                                className="group px-8 py-3"
                            >
                                {currentStep === questions.length - 1 ? 'Complete Application' : 'Next Question'}
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    Your answers will be saved securely and only shared with the review committee.
                </div>
            </main>
        </div>
    );
}
