import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Users, Clock, FileText, Tag, Image, Plus, X, HelpCircle, Award } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { toast } from 'sonner';
import { questionSuggestions, evaluationCriteria as suggestedCriteria, type EventQuestion, type EvaluationCriterion } from '../data/adminData';
import { validateDate, validateUrl, validateTextField } from '../utils/formValidation';

export function CreateEventPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
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

    const [questions, setQuestions] = useState<EventQuestion[]>([]);
    const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriterion[]>([]);
    const [showQuestionSuggestions, setShowQuestionSuggestions] = useState(false);
    const [showCriteriaSuggestions, setShowCriteriaSuggestions] = useState(false);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [newQuestionType, setNewQuestionType] = useState<'Long Text' | 'Short Text' | 'File Upload' | 'URL' | 'Multiple Choice' | 'Yes/No'>('Long Text');
    const [newCriteriaLabel, setNewCriteriaLabel] = useState('');
    const [newCriteriaDescription, setNewCriteriaDescription] = useState('');

    const categories = ['Hackathon', 'Bootcamp', 'Workshop', 'Masterclass', 'Summit', 'Competition'];
    const questionTypes: Array<'Long Text' | 'Short Text' | 'File Upload' | 'URL' | 'Multiple Choice' | 'Yes/No'> = ['Long Text', 'Short Text', 'File Upload', 'URL', 'Yes/No', 'Multiple Choice'];

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const addQuestion = (text: string, type: typeof newQuestionType) => {
        if (!text.trim()) {
            toast.error('Please enter a question');
            return;
        }
        const newQuestion: EventQuestion = {
            id: `q-${Date.now()}`,
            text: text.trim(),
            type,
            required: true,
        };
        setQuestions([...questions, newQuestion]);
        setNewQuestionText('');
        setNewQuestionType('Long Text');
        setShowQuestionSuggestions(false);
        toast.success('Question added');
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
        toast.success('Question removed');
    };

    const addCriteria = (label: string, description: string) => {
        if (!label.trim() || !description.trim()) {
            toast.error('Please enter both label and description');
            return;
        }
        const newCriterion: EvaluationCriterion = {
            id: `c-${Date.now()}`,
            key: label.toLowerCase().replace(/\s+/g, '_'),
            label: label.trim(),
            description: description.trim(),
            color: suggestedCriteria[evaluationCriteria.length % suggestedCriteria.length]?.color || '#00E5FF',
        };
        setEvaluationCriteria([...evaluationCriteria, newCriterion]);
        setNewCriteriaLabel('');
        setNewCriteriaDescription('');
        setShowCriteriaSuggestions(false);
        toast.success('Criteria added');
    };

    const addSuggestedCriteria = (criteria: EvaluationCriterion) => {
        if (!evaluationCriteria.find(c => c.key === criteria.key)) {
            setEvaluationCriteria([...evaluationCriteria, { ...criteria, id: `c-${Date.now()}` }]);
            toast.success('Criteria added');
        } else {
            toast.error('This criteria already exists');
        }
    };

    const removeCriteria = (id: string | undefined) => {
        setEvaluationCriteria(evaluationCriteria.filter(c => c.id !== id));
        toast.success('Criteria removed');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        // Validate required fields
        if (!form.name) {
            newErrors.name = 'Event name is required';
        } else if (form.name.length < 3) {
            newErrors.name = 'Event name must be at least 3 characters';
        }

        if (!form.category) {
            newErrors.category = 'Category is required';
        }

        if (!form.location) {
            newErrors.location = 'Location is required';
        }

        // Validate dates
        if (!form.startDate) {
            newErrors.startDate = 'Start date is required';
        } else {
            const startDateValidation = validateDate(form.startDate, 'Start date');
            if (!startDateValidation.isValid) {
                newErrors.startDate = startDateValidation.error || 'Invalid start date';
            }
        }

        if (!form.endDate) {
            newErrors.endDate = 'End date is required';
        } else {
            const endDateValidation = validateDate(form.endDate, 'End date');
            if (!endDateValidation.isValid) {
                newErrors.endDate = endDateValidation.error || 'Invalid end date';
            }
        }

        // Validate image URL if provided
        if (form.imageUrl && form.imageUrl.trim()) {
            const urlValidation = validateUrl(form.imageUrl, 'Image URL');
            if (!urlValidation.isValid) {
                newErrors.imageUrl = urlValidation.error || 'Invalid image URL';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix the errors in your form');
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Event created successfully!');
        toast.message(`Event created with ${questions.length} questions and ${evaluationCriteria.length} evaluation criteria.`);
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
                    <div className="mb-10">
                        <h1 className="text-4xl mb-2">Create New Event</h1>
                        <p className="text-[#8892A4]">Fill in the details below to publish a new event on the Q-AI Hub platform.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Basic Info Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90 flex items-center gap-2">
                                <FileText size={18} className="text-[#00F5A0]" />
                                Basic Information
                            </h2>
                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Event Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        placeholder="e.g. Quantum AI Hackathon 2026"
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="flex text-sm text-[#8892A4] mb-2 items-center gap-1">
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

                                {/* Description */}
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Description *</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                        placeholder="Describe the event, its goals, and what participants will gain..."
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20 min-h-[120px] resize-none"
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={form.tags}
                                        onChange={e => handleChange('tags', e.target.value)}
                                        placeholder="AI, Deep Tech, Startups, Innovation"
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
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
                                    <label className="flex text-sm text-[#8892A4] mb-2 items-center gap-1">
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
                                    <label className="flex text-sm text-[#8892A4] mb-2 items-center gap-1">
                                        <MapPin size={13} /> Location
                                    </label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={e => handleChange('location', e.target.value)}
                                        placeholder="City, Country or Online"
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Participants & Media Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90 flex items-center gap-2">
                                <Users size={18} className="text-[#7B2FFF]" />
                                Participants & Media
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-[#8892A4] mb-2">Max Participants</label>
                                    <input
                                        type="number"
                                        value={form.maxParticipants}
                                        onChange={e => handleChange('maxParticipants', e.target.value)}
                                        placeholder="e.g. 100"
                                        min={1}
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                    />
                                </div>
                                <div>
                                    <label className="flex text-sm text-[#8892A4] mb-2 items-center gap-1">
                                        <Image size={13} /> Cover Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={form.imageUrl}
                                        onChange={e => handleChange('imageUrl', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                    />
                                </div>

                                {/* Status */}
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

                        {/* Event Questions Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90 flex items-center gap-2">
                                <HelpCircle size={18} className="text-[#00E5FF]" />
                                Event Questions
                            </h2>
                            <div className="space-y-5">
                                <p className="text-sm text-[#8892A4]">Add questions that users must answer before registering for this event.</p>

                                {/* Question Input */}
                                <div className="space-y-4 p-4 bg-[#1A2035] rounded-xl border border-white/8">
                                    <div>
                                        <label className="block text-sm text-[#8892A4] mb-2">Question Text</label>
                                        <textarea
                                            value={newQuestionText}
                                            onChange={e => setNewQuestionText(e.target.value)}
                                            placeholder="Enter your question..."
                                            className="w-full px-4 py-3 bg-[#0F1628] rounded-lg border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20 resize-none h-20"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm text-[#8892A4] mb-2">Question Type</label>
                                            <select
                                                value={newQuestionType}
                                                onChange={e => setNewQuestionType(e.target.value as typeof newQuestionType)}
                                                className="w-full px-4 py-3 bg-[#0F1628] rounded-lg border border-white/8 text-white outline-none focus:border-white/30 transition-colors"
                                            >
                                                {questionTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="pt-6">
                                            <button
                                                type="button"
                                                onClick={() => addQuestion(newQuestionText, newQuestionType)}
                                                className="w-full px-4 py-3 bg-[#00F5A0] text-[#0A0E1A] rounded-lg font-semibold hover:bg-[#00D9F5] transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} />
                                                Add Question
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowQuestionSuggestions(!showQuestionSuggestions)}
                                        className="text-sm text-[#00E5FF] hover:text-[#00D9F5] transition-colors"
                                    >
                                        {showQuestionSuggestions ? '✕ Hide' : '+ Use Suggestions'}
                                    </button>
                                    {showQuestionSuggestions && (
                                        <div className="space-y-2 pt-3 border-t border-white/10">
                                            <p className="text-xs text-[#8892A4]">Pick from suggested questions:</p>
                                            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                                {questionSuggestions.map((suggestion, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            setNewQuestionText(suggestion);
                                                            setShowQuestionSuggestions(false);
                                                        }}
                                                        className="text-left px-3 py-2 bg-[#0F1628] hover:bg-[#2A3050] rounded-lg text-sm text-white/80 hover:text-white transition-colors border border-transparent hover:border-white/20"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Questions List */}
                                {questions.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-white/80">Added Questions ({questions.length})</p>
                                        {questions.map((question, idx) => (
                                            <motion.div
                                                key={question.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-start gap-3 p-4 bg-[#1A2035] rounded-lg border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 transition-colors"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00E5FF]/20 text-xs font-semibold text-[#00E5FF]">
                                                        {idx + 1}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white">{question.text}</p>
                                                    <p className="text-xs text-[#8892A4] mt-1">Type: {question.type}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(question.id)}
                                                    className="flex-shrink-0 p-2 text-[#FF4757] hover:bg-[#FF4757]/10 rounded-lg transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Evaluation Criteria Card */}
                        <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
                            <h2 className="text-lg mb-6 text-white/90 flex items-center gap-2">
                                <Award size={18} className="text-[#7B2FFF]" />
                                Evaluation Criteria
                            </h2>
                            <div className="space-y-5">
                                <p className="text-sm text-[#8892A4]">Define criteria that admins will use to evaluate participants for this event.</p>

                                {/* Criteria Input */}
                                <div className="space-y-4 p-4 bg-[#1A2035] rounded-xl border border-white/8">
                                    <div>
                                        <label className="block text-sm text-[#8892A4] mb-2">Criteria Label</label>
                                        <input
                                            type="text"
                                            value={newCriteriaLabel}
                                            onChange={e => setNewCriteriaLabel(e.target.value)}
                                            placeholder="e.g. Technical Innovation"
                                            className="w-full px-4 py-3 bg-[#0F1628] rounded-lg border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#8892A4] mb-2">Description</label>
                                        <textarea
                                            value={newCriteriaDescription}
                                            onChange={e => setNewCriteriaDescription(e.target.value)}
                                            placeholder="What will you evaluate for this criteria?"
                                            className="w-full px-4 py-3 bg-[#0F1628] rounded-lg border border-white/8 text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20 resize-none h-20"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addCriteria(newCriteriaLabel, newCriteriaDescription)}
                                        className="w-full px-4 py-3 bg-[#7B2FFF] text-white rounded-lg font-semibold hover:bg-[#9945FF] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Add Criteria
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCriteriaSuggestions(!showCriteriaSuggestions)}
                                        className="text-sm text-[#7B2FFF] hover:text-[#9945FF] transition-colors"
                                    >
                                        {showCriteriaSuggestions ? '✕ Hide' : '+ Use Suggestions'}
                                    </button>
                                    {showCriteriaSuggestions && (
                                        <div className="space-y-2 pt-3 border-t border-white/10 max-h-64 overflow-y-auto">
                                            <p className="text-xs text-[#8892A4]">Pick from suggested criteria:</p>
                                            {suggestedCriteria.map((suggestion) => (
                                                <button
                                                    key={suggestion.key}
                                                    type="button"
                                                    onClick={() => addSuggestedCriteria(suggestion)}
                                                    className="block w-full text-left px-3 py-2 bg-[#0F1628] hover:bg-[#2A3050] rounded-lg text-sm text-white/80 hover:text-white transition-colors border border-transparent hover:border-white/20"
                                                >
                                                    <p className="font-medium">{suggestion.label}</p>
                                                    <p className="text-xs text-white/50">{suggestion.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Criteria List */}
                                {evaluationCriteria.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-white/80">Added Criteria ({evaluationCriteria.length})</p>
                                        {evaluationCriteria.map((criteria, idx) => (
                                            <motion.div
                                                key={criteria.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-start gap-3 p-4 bg-[#1A2035] rounded-lg border border-white/8 hover:border-white/20 transition-colors"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full font-semibold text-xs"
                                                        style={{ backgroundColor: criteria.color + '30', color: criteria.color }}
                                                    >
                                                        {idx + 1}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white">{criteria.label}</p>
                                                    <p className="text-xs text-[#8892A4] mt-1">{criteria.description}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCriteria(criteria.id)}
                                                    className="flex-shrink-0 p-2 text-[#FF4757] hover:bg-[#FF4757]/10 rounded-lg transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
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
