import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Send } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { toast } from 'sonner';
import { validateEmail } from '../utils/formValidation';
import { DashboardHeader } from '../components/DashboardHeader';

export function InviteTeammatePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        email: '',
        message: '',
    });
    const profileName = localStorage.getItem('userName') || 'Founder';

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        
        // Validate email format
        const emailValidation = validateEmail(form.email);
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.error || 'Please enter a valid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Invitation sent successfully!');
        toast.message(`An invitation email has been sent to ${form.email}.`);
        navigate(`/startup/${id}`);
    };

    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            <DashboardHeader activeTab="applications" profileName={profileName} />

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Page Title */}
                    <div className="mb-10">
                        <h1 className="text-4xl mb-2">Invite Teammate</h1>
                        <p className="text-muted-foreground">Send an invitation to join your startup team on Q-AI Hub.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Card */}
                        <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-foreground/90">
                                Email Address
                            </h2>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    placeholder="teammate@example.com"
                                    className={`w-full px-4 py-3 bg-card rounded-xl border text-foreground outline-none focus:border-white/30 transition-colors placeholder:text-muted-foreground/40 ${errors.email ? 'border-[#FF4757]/60' : 'border-border'}`}
                                />
                                {errors.email && <p className="mt-1.5 text-xs text-[#FF4757]">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Message Card */}
                        <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-foreground/90">
                                Personal Message
                            </h2>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Add a personal message (optional)</label>
                                <textarea
                                    value={form.message}
                                    onChange={e => handleChange('message', e.target.value)}
                                    placeholder="Hey! Join our startup team on Q-AI Hub. We're building something amazing..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-card rounded-xl border border-border text-foreground outline-none focus:border-white/30 transition-colors placeholder:text-muted-foreground/40 resize-none"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#00E5FF] to-[#7B2FFF] rounded-xl font-semibold text-[#0A0E1A] shadow-lg shadow-[#00E5FF]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#0A0E1A]/30 border-t-[#0A0E1A] rounded-full animate-spin" />
                                    <span>Sending Invitation...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Send Invitation</span>
                                </>
                            )}
                        </motion.button>

                    </form>
                </motion.div>
            </div>
        </div>
    );
}
