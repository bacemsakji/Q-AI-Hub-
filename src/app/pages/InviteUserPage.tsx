import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Send } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { toast } from 'sonner';

export function InviteUserPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: '',
        message: '',
    });

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email) {
            toast.error('Please enter an email address.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Invitation sent successfully!');
        toast.message(`An invitation email has been sent to ${form.email}.`);
        navigate('/admin');
    };

    return (
        <div className="min-h-screen relative flex">
            <ParticleBackground />
            <AdminSidebar activeSection="users" onNavigate={(section) => {
                navigate(`/admin?section=${section}`);
            }} />
            <main className="w-full ml-64 flex-1 relative z-10 overflow-y-auto">
                <div className="p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Page Header */}
                        <div className="mb-8 flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center gap-2 text-[#8892A4] hover:text-white transition-colors"
                            >
                                <ArrowLeft size={18} />
                                <span className="text-sm">Back to Dashboard</span>
                            </button>
                        </div>

                        {/* Page Title */}
                        <div className="mb-10">
                            <h1 className="text-4xl mb-2">Invite New User</h1>
                            <p className="text-[#8892A4]">Send an invitation to join the Q-AI Hub platform as a startup founder or team member.</p>
                        </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90">
                                Email Address
                            </h2>
                            <div>
                                <label className="block text-sm text-[#8892A4] mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    placeholder="john.doe@example.com"
                                    className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                />
                            </div>
                        </div>

                        {/* Message Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90">
                                Personal Message
                            </h2>
                            <div>
                                <label className="block text-sm text-[#8892A4] mb-2">Add a personal message (optional)</label>
                                <textarea
                                    value={form.message}
                                    onChange={e => handleChange('message', e.target.value)}
                                    placeholder="Welcome to Q-AI Hub! We're excited to have you join our community of innovators..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20 resize-none"
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
            </main>
        </div>
    );
}
