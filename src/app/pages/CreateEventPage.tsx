import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Users, Clock, FileText, Tag, Image } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { DatePicker } from '../components/ui/date-picker';
import { Button } from '../components/Button';
import { InviteExpertsPanel, type EventExpert } from '../components/admin/InviteExpertsPanel';
import { toast } from 'sonner';

export function CreateEventPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingExperts, setPendingExperts] = useState<EventExpert[]>([]);
    const [form, setForm] = useState({
        name: '',
        category: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        maxParticipants: '',
        deadline: '',
        tags: '',
        imageUrl: '',
        status: 'active',
    });

    const categories = ['Hackathon', 'Bootcamp', 'Workshop', 'Masterclass', 'Summit', 'Competition'];

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.category || !form.startDate || !form.endDate) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Save experts with a temp event ID (timestamp-based)
        const tempEventId = `event-${Date.now()}`;
        if (pendingExperts.length > 0) {
            localStorage.setItem(`event-experts-${tempEventId}`, JSON.stringify(pendingExperts));
        }
        toast.success('Event created successfully!');
        toast.message('An email has been sent to the organizing team confirming the event creation.');
        if (pendingExperts.length > 0) {
            toast.success(`Invitations sent to ${pendingExperts.length} expert${pendingExperts.length > 1 ? 's' : ''}`);
        }
        navigate('/admin');
    };

    return (
        <div className="min-h-screen relative">
            <ParticleBackground />

            {/* Header */}
            <div className="relative z-10 border-b border-border bg-muted/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
                    <Link to="/admin">
                        <Logo size="sm" />
                    </Link>
                    <div className="h-6 w-px bg-foreground/10" />
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm">Back to Dashboard</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Page Title */}
                    <div className="mb-10">
                        <h1 className="text-4xl mb-2">Create New Event</h1>
                        <p className="text-muted-foreground">Fill in the details below to publish a new event on the Q-AI Hub platform.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Basic Info Card */}
                        <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-foreground/90 flex items-center gap-2">
                                <FileText size={18} className="text-emerald-600 dark:text-[#00F5A0]" />
                                Basic Information
                            </h2>
                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Event Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        placeholder="e.g. Quantum AI Hackathon 2026"
                                        className="w-full px-4 py-3 bg-card rounded-xl border border-border text-foreground outline-none focus:border-white/30 transition-colors placeholder:text-muted-foreground/40"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                        <Tag size={13} /> Category *
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => handleChange('category', cat)}
                                                className={`px-4 py-2 rounded-full text-sm border transition-all ${form.category === cat
                                                    ? 'bg-foreground/10 border-white/30 text-foreground'
                                                    : 'bg-transparent border-border text-muted-foreground hover:border-border hover:text-foreground'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Description *</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                        placeholder="Describe the event, its goals, and what participants will gain..."
                                        className="w-full px-4 py-3 bg-card rounded-xl border border-border text-foreground outline-none focus:border-white/30 transition-colors placeholder:text-muted-foreground/40 min-h-[120px] resize-none"
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={form.tags}
                                        onChange={e => handleChange('tags', e.target.value)}
                                        placeholder="AI, Deep Tech, Startups, Innovation"
                                        className="w-full px-4 py-3 bg-card rounded-xl border border-border text-foreground outline-none focus:border-white/30 transition-colors placeholder:text-muted-foreground/40"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date & Location Card */}
                        <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-foreground/90 flex items-center gap-2">
                                <Calendar size={18} className="text-cyan-700 dark:text-[#00D9F5]" />
                                Date & Location
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Start Date *</label>
                                    <DatePicker
                                        date={form.startDate ? new Date(form.startDate) : undefined}
                                        setDate={(d) => handleChange('startDate', d ? d.toISOString().split('T')[0] : '')}
                                        placeholder="Pick start date"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">End Date *</label>
                                    <DatePicker
                                        date={form.endDate ? new Date(form.endDate) : undefined}
                                        setDate={(d) => handleChange('endDate', d ? d.toISOString().split('T')[0] : '')}
                                        placeholder="Pick end date"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                        <Clock size={13} /> Application Deadline
                                    </label>
                                    <DatePicker
                                        date={form.deadline ? new Date(form.deadline) : undefined}
                                        setDate={(d) => handleChange('deadline', d ? d.toISOString().split('T')[0] : '')}
                                        placeholder="Pick deadline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                        <MapPin size={13} /> Location
                                    </label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={e => handleChange('location', e.target.value)}
                                        placeholder="City, Country or Online"
                                        className="w-full px-4 py-3 bg-card rounded-xl border border-border text-foreground outline-none focus:border-white/30 transition-colors placeholder:text-muted-foreground/40"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Participants & Media Card */}
                        <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-foreground/90 flex items-center gap-2">
                                <Users size={18} className="text-purple-700 dark:text-[#7B2FFF]" />
                                Participants & Media
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Max Participants</label>
                                    <input
                                        type="number"
                                        value={form.maxParticipants}
                                        onChange={e => handleChange('maxParticipants', e.target.value)}
                                        placeholder="e.g. 100"
                                        min={1}
                                        className="w-full px-4 py-3 bg-card rounded-xl border border-border text-foreground outline-none focus:border-white/30 transition-colors placeholder:text-muted-foreground/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                        <Image size={13} /> Cover Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={form.imageUrl}
                                        onChange={e => handleChange('imageUrl', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 bg-card rounded-xl border border-border text-foreground outline-none focus:border-white/30 transition-colors placeholder:text-muted-foreground/40"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-3">Publishing Status</label>
                                    <div className="flex gap-3">
                                        {[
                                            { value: 'active', label: 'Active', color: 'text-emerald-600 dark:text-[#00F5A0]' },
                                            { value: 'draft', label: 'Draft', color: 'text-amber-600 dark:text-[#FFB800]' },
                                            { value: 'closed', label: 'Closed', color: 'text-red-600 dark:text-[#FF4757]' },
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => handleChange('status', opt.value)}
                                                className={`px-5 py-2.5 rounded-full text-sm border transition-all ${form.status === opt.value
                                                    ? `bg-foreground/10 border-border ${opt.color}`
                                                    : 'bg-transparent border-border text-muted-foreground hover:border-white/15'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expert Invitations */}
                        <InviteExpertsPanel onChange={setPendingExperts} />

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating event...' : 'Create Event'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                fullWidth
                                onClick={() => navigate('/admin')}
                            >
                                Cancel
                            </Button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    );
}
