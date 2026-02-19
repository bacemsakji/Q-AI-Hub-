import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Users, Clock, FileText, Tag, Trash2 } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { toast } from 'sonner';

/* ─── Mock event data (shared with AdminDashboard in a real app this would come from a store/API) ─── */
const MOCK_EVENTS: Record<string, any> = {
    '1': {
        id: 1,
        name: 'Quantum AI Hackathon',
        category: 'Hackathon',
        description:
            'A 48-hour deep-tech hackathon focused on AI, quantum computing, and next-generation infrastructure. Build, pitch, and win.',
        startDate: '2026-03-15',
        endDate: '2026-03-17',
        deadline: '2026-03-10',
        location: 'Tunis, Tunisia',
        maxParticipants: '80',
        tags: 'AI, Quantum, Hackathon, Deep Tech',
        imageUrl: '',
        status: 'active',
    },
    '2': {
        id: 2,
        name: 'Deep Tech Bootcamp',
        category: 'Bootcamp',
        description:
            'An intensive 5-day bootcamp for startup founders and engineers looking to accelerate their deep tech knowledge.',
        startDate: '2026-02-10',
        endDate: '2026-02-14',
        deadline: '2026-02-05',
        location: 'Sfax, Tunisia',
        maxParticipants: '40',
        tags: 'Deep Tech, Bootcamp, Founders',
        imageUrl: '',
        status: 'draft',
    },
    '3': {
        id: 3,
        name: 'Neural Networks Workshop',
        category: 'Workshop',
        description:
            'Hands-on workshop covering neural network architectures, training techniques, and deployment strategies.',
        startDate: '2026-03-08',
        endDate: '2026-03-08',
        deadline: '2026-03-02',
        location: 'Online',
        maxParticipants: '200',
        tags: 'Neural Networks, AI, Workshop',
        imageUrl: '',
        status: 'active',
    },
};

const categories = ['Hackathon', 'Bootcamp', 'Workshop', 'Masterclass', 'Summit', 'Competition'];

export function EditEventPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

    /* Pre-fill form from mock data */
    useEffect(() => {
        if (id && MOCK_EVENTS[id]) {
            setForm(MOCK_EVENTS[id]);
        } else {
            toast.error('Event not found');
            navigate('/admin');
        }
    }, [id, navigate]);

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
        toast.success('Event updated successfully!');
        navigate('/admin');
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Event deleted.');
        navigate('/admin');
    };

    return (
        <div className="min-h-screen relative">
            <ParticleBackground />

            {/* Header */}
            <div className="relative z-10 border-b border-white/8 bg-[#0F1628]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
                    <Link to="/admin">
                        <Logo size="sm" />
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-[#8892A4] hover:text-white transition-colors"
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
                    <div className="mb-10 flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl mb-2">Edit Event</h1>
                            <p className="text-[#8892A4]">Update the details for <span className="text-white/80">{form.name}</span></p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF4757]/30 text-[#FF4757] hover:bg-[#FF4757]/10 transition-all text-sm"
                        >
                            <Trash2 size={14} />
                            Delete Event
                        </button>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-6 bg-[#FF4757]/10 border border-[#FF4757]/30 rounded-2xl"
                        >
                            <p className="text-white mb-4">Are you sure you want to delete <strong>{form.name}</strong>? This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                                    {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
                                </Button>
                                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Basic Info Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90 flex items-center gap-2">
                                <FileText size={18} className="text-[#00F5A0]" />
                                Basic Information
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Event Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2 flex items-center gap-1">
                                        <Tag size={13} /> Category *
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => handleChange('category', cat)}
                                                className={`px-4 py-2 rounded-full text-sm border transition-all ${form.category === cat
                                                        ? 'bg-white/15 border-white/30 text-white'
                                                        : 'bg-transparent border-white/10 text-[#8892A4] hover:border-white/20 hover:text-white'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors min-h-[120px] resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={form.tags}
                                        onChange={e => handleChange('tags', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date & Location Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90 flex items-center gap-2">
                                <Calendar size={18} className="text-[#00D9F5]" />
                                Date & Location
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Start Date *</label>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        onChange={e => handleChange('startDate', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">End Date *</label>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={e => handleChange('endDate', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2 flex items-center gap-1">
                                        <Clock size={13} /> Application Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={form.deadline}
                                        onChange={e => handleChange('deadline', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2 flex items-center gap-1">
                                        <MapPin size={13} /> Location
                                    </label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={e => handleChange('location', e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Participants & Status Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90 flex items-center gap-2">
                                <Users size={18} className="text-[#7B2FFF]" />
                                Participants & Status
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Max Participants</label>
                                    <input
                                        type="number"
                                        value={form.maxParticipants}
                                        onChange={e => handleChange('maxParticipants', e.target.value)}
                                        min={1}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-3">Publishing Status</label>
                                    <div className="flex gap-3">
                                        {[
                                            { value: 'active', label: 'Active', color: 'text-[#00F5A0]' },
                                            { value: 'draft', label: 'Draft', color: 'text-[#FFB800]' },
                                            { value: 'closed', label: 'Closed', color: 'text-[#FF4757]' },
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => handleChange('status', opt.value)}
                                                className={`px-5 py-2.5 rounded-full text-sm border transition-all ${form.status === opt.value
                                                        ? `bg-white/10 border-white/25 ${opt.color}`
                                                        : 'bg-transparent border-white/8 text-[#8892A4] hover:border-white/15'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '✨ Saving Changes...' : '💾 Save Changes'}
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
