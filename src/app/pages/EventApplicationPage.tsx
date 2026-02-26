import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Upload, Check, Sparkles, Github, File, AlertCircle } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from 'sonner';
import { events } from '../data/mockData';
import { adminEvents, type EventQuestion } from '../data/adminData';
import { useTheme } from '../context/useTheme';
import { validateEmail, validateGithubUrl, validateTextField } from '../utils/formValidation';

export function EventApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAiVersion, setUseAiVersion] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const event = events.find(e => e.id === Number(id));
  const adminEvent = adminEvents.find(e => e.id === id);
  const eventQuestions = adminEvent?.questions || [];

  const [formData, setFormData] = useState({
    projectName: '',
    sector: '',
    tagline: '',
    logo: null as File | null,
    pitchOriginal: '',
    pitchEnhanced: '',
    githubUrl: '',
    teamSize: 1,
    userRole: '',
    teammates: [] as { email: string; role: string }[],
    techStack: [] as string[],
    pitchDeck: null as File | null,
    acceptTerms: false,
  });

  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string | File | null>>({});
  const [questionFiles, setQuestionFiles] = useState<Record<string, File | null>>({});

  const [aiPitch, setAiPitch] = useState({
    problem: '',
    solution: '',
    targetMarket: '',
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login', { state: { returnUrl: `/events/${id}/apply`, eventName: event?.title } });
    }
  }, [id, navigate, event]);

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center text-white">Event not found</div>;
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  const handlePitchDeckUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setFormData({ ...formData, pitchDeck: file });
      } else {
        toast.error('Please upload a PDF file under 10MB');
      }
    }
  };

  const handleEnhanceWithAi = async () => {
    if (!formData.pitchOriginal.trim()) {
      toast.error('Please enter your pitch first');
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock AI-enhanced pitch
    setAiPitch({
      problem: `Current healthcare systems struggle with delayed diagnoses and inefficient patient data management, leading to poor outcomes and increased costs. The lack of real-time insights prevents early intervention in critical cases.`,
      solution: `We leverage quantum-enhanced machine learning algorithms to analyze medical imaging and patient data in real-time, providing accurate early diagnosis with 95% accuracy. Our platform integrates seamlessly with existing hospital infrastructure.`,
      targetMarket: `Initially targeting major hospitals and diagnostic centers in Tunisia, then expanding to MENA region. Total addressable market of $2.4B in medical AI diagnostics by 2028.`,
    });

    setFormData({
      ...formData,
      pitchEnhanced: `${formData.pitchOriginal}\n\n[AI Enhanced Structure Applied]`,
    });

    setIsGenerating(false);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms to submit');
      return;
    }

    // Validate GitHub URL if provided
    if (formData.githubUrl.trim()) {
      const githubValidation = validateGithubUrl(formData.githubUrl);
      if (!githubValidation.isValid) {
        newErrors.githubUrl = githubValidation.error || 'Invalid GitHub URL';
      }
    }

    // Validate team member emails
    if (formData.teamSize > 1) {
      for (let i = 0; i < formData.teammates.length; i++) {
        const teammate = formData.teammates[i];
        if (teammate.email.trim()) {
          const emailValidation = validateEmail(teammate.email);
          if (!emailValidation.isValid) {
            newErrors[`teammate-${i}-email`] = emailValidation.error || 'Invalid email format';
          }
        }
      }
    }

    // Validate user role is selected
    if (!formData.userRole) {
      newErrors.userRole = 'Please select your role';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      toast.error('Please fix the errors in your form');
      return;
    }

    // Validate all required questions are answered
    const requiredUnanswered = eventQuestions.filter(q => q.required && !questionAnswers[q.id]);
    if (requiredUnanswered.length > 0) {
      toast.error(`Please answer all required questions`);
      return;
    }

    const applicationId = `QAI-${Date.now().toString(36).toUpperCase()}`;

    // Show confetti effect and success state
    setIsSubmitted(true);

    toast.success('Your application was sent successfully. A confirmation email has been sent to your inbox.');

    setTimeout(() => {
      localStorage.setItem(`application-${event?.id}`, JSON.stringify({
        ...formData,
        applicationId,
        eventId: event?.id,

        eventName: event?.title,
        status: 'Pending',
        submittedDate: new Date().toISOString(),
        questionAnswers,
      }));
    }, 1000);
  };

  const handleQuestionAnswerChange = (questionId: string, value: string) => {
    setQuestionAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleQuestionFileChange = (questionId: string, file: File) => {
    setQuestionFiles(prev => ({ ...prev, [questionId]: file }));
    setQuestionAnswers(prev => ({ ...prev, [questionId]: file.name }));
  };

  const canProceedToQuestionsStep = eventQuestions.length > 0 && formData.projectName && formData.sector && formData.tagline;
  const totalSteps = eventQuestions.length > 0 ? 4 : 3;
  const questionsStep = eventQuestions.length > 0 ? 2 : null;
  const pitchStep = eventQuestions.length > 0 ? 3 : 2;
  const submitStep = eventQuestions.length > 0 ? 4 : 3;
  const stepLabels = eventQuestions.length > 0
    ? ['Project Info', 'Event Questions', 'AI Pitch', 'Submit']
    : ['Project Info', 'AI Pitch', 'Submit'];

  const sectors = ['HealthTech', 'FinTech', 'EdTech', 'GreenTech', 'DeepTech'];

  const commonRoles = [
    'CEO (Chief Executive Officer)',
    'CTO (Chief Technology Officer)',
    'COO (Chief Operating Officer)',
    'Accountant',
    'Software Engineer',
    'Product Designer',
    'Marketing Manager',
    'Sales Representative',
    'Legal Counsel',
    'Data Scientist',
    'AI Researcher',
  ];

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-[#0A0E1A] text-white' : 'bg-white text-gray-900'}`}>
      <ParticleBackground />

      <div className="relative z-10 min-h-screen py-12 px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 transition-colors mb-6 ${isDark ? 'text-[#8892A4] hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <ArrowLeft size={20} />
            Events
          </Link>

          <div className="flex justify-between items-center">
            <h1 className="text-3xl">{event.title}</h1>
            <div className="flex items-center gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${localStorage.getItem('userName')}&background=00F5A0&color=0A0E1A`}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm text-[#8892A4]">{localStorage.getItem('userName')}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep === step
                      ? isDark ? 'bg-white/20 text-white border border-white/25 scale-110' : 'bg-blue-100 text-blue-600 border border-blue-300 scale-110'
                      : currentStep > step
                        ? isDark ? 'bg-white/15 text-white border border-white/20' : 'bg-gray-100 text-gray-600 border border-gray-300'
                        : isDark ? 'bg-[#1A2035] text-[#8892A4] border border-white/10' : 'bg-gray-100 text-gray-400 border border-gray-300'
                      }`}
                  >
                    {currentStep > step ? <Check size={20} /> : step}
                  </div>
                  <span
                    className={`text-sm ${currentStep >= step ? isDark ? 'text-white' : 'text-gray-900' : isDark ? 'text-[#8892A4]' : 'text-gray-500'
                      }`}
                  >
                    {stepLabels[step - 1]}
                  </span>
                </div>
                {step < totalSteps && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${currentStep > step ? isDark ? 'bg-white/25' : 'bg-blue-200' : isDark ? 'bg-[#1A2035]' : 'bg-gray-200'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <>
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`backdrop-blur-xl rounded-3xl p-8 ${isDark ? 'bg-[rgba(15,22,40,0.95)] border border-white/8' : 'bg-slate-50 border border-gray-200'}`}
                  >
                    <h2 className={`text-2xl mb-6 ${isDark ? '' : 'text-gray-900'}`}>Project Information</h2>

                    <div className="space-y-6">
                      <Input
                        label="Project Name"
                        type="text"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      />

                      <div>
                        <label className={`block text-sm mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>Sector</label>
                        <select
                          value={formData.sector}
                          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${isDark ? 'bg-[#1A2035] border-white/8 text-white focus:border-[#00F5A0]' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'}`}
                        >
                          <option value="">Select a sector</option>
                          {sectors.map((sector) => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="One-line Tagline"
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="Summarize your idea in one sentence"
                      />

                      <div>
                        <label className={`block text-sm mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>Project Logo</label>
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDark ? 'border-white/20 hover:border-[#00F5A0]' : 'border-gray-300 hover:border-blue-500'}`}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            {formData.logo ? (
                              <div>
                                <Check className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-[#00F5A0]' : 'text-green-500'}`} />
                                <p className={isDark ? 'text-white' : 'text-gray-900'}>{formData.logo.name}</p>
                              </div>
                            ) : (
                              <>
                                <Upload className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-400'}`} />
                                <p className={isDark ? 'text-[#8892A4]' : 'text-gray-500'}>Click or drag your logo here</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (eventQuestions.length > 0) {
                            setCurrentStep(questionsStep!);
                          } else {
                            setCurrentStep(pitchStep);
                          }
                        }}
                        disabled={!formData.projectName || !formData.sector || !formData.tagline}
                      >
                        Next
                      </Button>
                    </div>
                  </motion.div>
                )}

                {questionsStep !== null && currentStep === questionsStep && eventQuestions.length > 0 && (
                  <motion.div
                    key="questions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`backdrop-blur-xl rounded-3xl p-8 ${isDark ? 'bg-[rgba(15,22,40,0.95)] border border-white/8' : 'bg-slate-50 border border-gray-200'}`}
                  >
                    <h2 className={`text-2xl mb-6 ${isDark ? '' : 'text-gray-900'}`}>Event Questions</h2>
                    <p className={isDark ? 'text-[#8892A4] mb-8' : 'text-gray-600 mb-8'}>Please answer the following questions to complete your registration.</p>

                    <div className="space-y-8">
                      {eventQuestions.map((question: EventQuestion, idx: number) => (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="space-y-3"
                        >
                          <label className="flex items-start gap-2">
                            <span className={`text-sm font-semibold flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {question.text}
                              {question.required && <span className={isDark ? 'text-[#FF4757]' : 'text-red-500'}>*</span>}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-white/10 text-[#8892A4]' : 'bg-gray-200 text-gray-700'}`}>
                              {question.type}
                            </span>
                          </label>

                          {/* Long Text */}
                          {question.type === 'Long Text' && (
                            <textarea
                              value={(questionAnswers[question.id] as string) || ''}
                              onChange={(e) => handleQuestionAnswerChange(question.id, e.target.value)}
                              placeholder="Enter your answer..."
                              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none h-32 ${isDark ? 'bg-[#1A2035] border-white/8 text-white focus:border-white/30 placeholder:text-white/20' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 placeholder:text-gray-400'}`}
                            />
                          )}

                          {/* Short Text */}
                          {question.type === 'Short Text' && (
                            <input
                              type="text"
                              value={(questionAnswers[question.id] as string) || ''}
                              onChange={(e) => handleQuestionAnswerChange(question.id, e.target.value)}
                              placeholder="Enter your answer..."
                              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${isDark ? 'bg-[#1A2035] border-white/8 text-white focus:border-white/30 placeholder:text-white/20' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 placeholder:text-gray-400'}`}
                            />
                          )}

                          {/* URL */}
                          {question.type === 'URL' && (
                            <input
                              type="url"
                              value={(questionAnswers[question.id] as string) || ''}
                              onChange={(e) => handleQuestionAnswerChange(question.id, e.target.value)}
                              placeholder="https://..."
                              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${isDark ? 'bg-[#1A2035] border-white/8 text-white focus:border-white/30 placeholder:text-white/20' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 placeholder:text-gray-400'}`}
                            />
                          )}

                          {/* File Upload */}
                          {question.type === 'File Upload' && (
                            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${isDark ? 'border-white/20 hover:border-[#00E5FF]' : 'border-gray-300 hover:border-blue-500'}`}>
                              <input
                                type="file"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleQuestionFileChange(question.id, e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                                id={`file-${question.id}`}
                              />
                              <label htmlFor={`file-${question.id}`} className="cursor-pointer flex flex-col items-center gap-2">
                                {questionFiles[question.id] ? (
                                  <>
                                    <File className="w-8 h-8 text-[#00E5FF]" />
                                    <p className="text-white text-sm">{questionFiles[question.id]?.name}</p>
                                    <p className="text-xs text-[#8892A4]">
                                      ({((questionFiles[question.id]?.size || 0) / 1024).toFixed(2)} KB)
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-8 h-8 text-[#8892A4]" />
                                    <p className="text-[#8892A4] text-sm">Click to upload file</p>
                                  </>
                                )}
                              </label>
                            </div>
                          )}

                          {/* Yes/No */}
                          {question.type === 'Yes/No' && (
                            <div className="flex gap-3">
                              {['Yes', 'No'].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleQuestionAnswerChange(question.id, option)}
                                  className={`px-6 py-3 rounded-lg border transition-all font-medium ${
                                    questionAnswers[question.id] === option
                                      ? 'bg-white/20 border-white/30 text-white'
                                      : 'bg-transparent border-white/10 text-[#8892A4] hover:border-white/20'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Multiple Choice */}
                          {question.type === 'Multiple Choice' && (
                            <div className="space-y-2">
                              {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleQuestionAnswerChange(question.id, option)}
                                  className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                                    questionAnswers[question.id] === option
                                      ? 'bg-white/15 border-white/30 text-white'
                                      : 'bg-transparent border-white/10 text-[#8892A4] hover:border-white/20'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => setCurrentStep(pitchStep)}
                        disabled={eventQuestions.filter(q => q.required).some(q => !questionAnswers[q.id])}
                      >
                        Next
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === pitchStep && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`backdrop-blur-xl rounded-3xl p-8 ${isDark ? 'bg-[rgba(15,22,40,0.95)] border border-white/8' : 'bg-slate-50 border border-gray-200'}`}
                  >
                    <h2 className={`text-2xl mb-6 ${isDark ? '' : 'text-gray-900'}`}>AI Pitch Enhancement</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-[#8892A4] mb-2">
                          Describe your idea in plain language
                        </label>
                        <textarea
                          value={formData.pitchOriginal}
                          onChange={(e) => setFormData({ ...formData, pitchOriginal: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors min-h-[150px] resize-none ${isDark ? 'bg-[#1A2035] border-white/8 text-white focus:border-[#00F5A0]' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'}`}
                          placeholder="Tell us about your project, what problem it solves, and who it helps..."
                        />
                        <div className={`text-right text-xs mt-1 ${isDark ? 'text-[#8892A4]' : 'text-gray-500'}`}>
                          {formData.pitchOriginal.length} characters
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        onClick={handleEnhanceWithAi}
                        disabled={isGenerating || !formData.pitchOriginal.trim()}
                        className="w-full sm:w-auto"
                      >
                        <Sparkles size={18} className="mr-2" />
                        {isGenerating ? 'Enhancing...' : 'Enhance with AI'}
                      </Button>

                      {isGenerating && (
                        <div className="space-y-3">
                          <div className={`h-4 rounded animate-pulse ${isDark ? 'bg-[#1A2035]' : 'bg-gray-300'}`} />
                          <div className={`h-4 rounded animate-pulse w-3/4 ${isDark ? 'bg-[#1A2035]' : 'bg-gray-300'}`} />
                          <div className={`h-4 rounded animate-pulse w-5/6 ${isDark ? 'bg-[#1A2035]' : 'bg-gray-300'}`} />
                          <p className={`text-sm text-center ${isDark ? 'text-[#8892A4]' : 'text-gray-500'}`}>Structuring your pitch...</p>
                        </div>
                      )}

                      {aiPitch.problem && !isGenerating && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#1A2035]/50 border-white/8' : 'bg-gray-100 border-gray-300'}`}>
                            <p className={`text-xs mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>Your Original</p>
                            <p className={`text-sm line-clamp-6 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>{formData.pitchOriginal}</p>
                          </div>

                          <div className={`rounded-xl p-6 relative border ${isDark ? 'bg-white/10 border-white/20' : 'bg-blue-50 border-blue-200'}`}>
                            <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-white/80">
                              <Sparkles size={14} />
                              AI Enhanced
                            </div>
                            <div className="space-y-4 mt-2">
                              <div>
                                <p className="text-xs text-[#FF4757] mb-1">Problem</p>
                                <p className="text-sm">{aiPitch.problem}</p>
                              </div>
                              <div>
                                <p className="text-xs text-white/80 mb-1">Solution</p>
                                <p className="text-sm">{aiPitch.solution}</p>
                              </div>
                              <div>
                                <p className="text-xs text-white/70 mb-1">Target Market</p>
                                <p className="text-sm">{aiPitch.targetMarket}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {aiPitch.problem && !isGenerating && (
                        <div className="flex gap-4">
                          <Button variant="primary" onClick={() => { setUseAiVersion(true); setCurrentStep(submitStep); }}>
                            Use Enhanced Version
                          </Button>
                          <Button variant="ghost" onClick={() => { setUseAiVersion(false); setCurrentStep(submitStep); }}>
                            Keep Original
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" onClick={() => {
                        if (questionsStep !== null && eventQuestions.length > 0) {
                          setCurrentStep(questionsStep);
                        } else {
                          setCurrentStep(1);
                        }
                      }}>
                        Back
                      </Button>
                      {!aiPitch.problem && (
                        <Button variant="ghost" onClick={() => setCurrentStep(submitStep)}>
                          Skip AI Enhancement
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentStep === submitStep && (
                  <motion.div
                    key="step-submit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`backdrop-blur-xl rounded-3xl p-8 ${isDark ? 'bg-[rgba(15,22,40,0.95)] border border-white/8' : 'bg-slate-50 border border-gray-200'}`}
                  >
                    <h2 className={`text-2xl mb-6 ${isDark ? '' : 'text-gray-900'}`}>Final Details</h2>

                    <div className="space-y-6">
                      <div>
                        <Input
                          label="GitHub Repository URL"
                          type="url"
                          value={formData.githubUrl}
                          onChange={(e) => {
                            setFormData({ ...formData, githubUrl: e.target.value });
                            setValidationErrors(prev => ({ ...prev, githubUrl: '' }));
                          }}
                          placeholder="https://github.com/..."
                        />
                        {validationErrors.githubUrl && (
                          <p className="mt-1.5 text-xs text-[#FF4757]">{validationErrors.githubUrl}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-[#8892A4] mb-2">Team Size</label>
                          <input
                            type="number"
                            min="1"
                            max="6"
                            value={formData.teamSize}
                            onChange={(e) => {
                              const size = Number(e.target.value);
                              const newTeammates = [...formData.teammates];

                              if (size > 1) {
                                // Adjust teammates array based on new size
                                const diff = size - 1 - newTeammates.length;
                                if (diff > 0) {
                                  for (let i = 0; i < diff; i++) {
                                    newTeammates.push({ email: '', role: '' });
                                  }
                                } else if (diff < 0) {
                                  newTeammates.splice(size - 1);
                                }
                              } else {
                                newTeammates.splice(0);
                              }

                              setFormData({ ...formData, teamSize: size, teammates: newTeammates });
                            }}
                            className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-[#00F5A0] transition-colors"
                          />
                        </div>

                        <div>
                          <label className={`block text-sm mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>Your Role *</label>
                          <select
                            value={formData.userRole}
                            onChange={(e) =>
                              setFormData({ ...formData, userRole: e.target.value })
                            }
                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${isDark ? 'bg-[#1A2035] border-white/8 text-white focus:border-[#00F5A0]' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'}`}
                          >
                            <option value="">Select your role</option>
                            {commonRoles.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Team Member Email Invitations */}
                      {formData.teamSize > 1 && (
                        <div className={`rounded-xl p-5 border ${isDark ? 'bg-[#0F1628] border-white/8' : 'bg-gray-100 border-gray-300'}`}>
                          <div className="flex items-center gap-2 mb-4">
                            <svg className={`h-4 w-4 ${isDark ? 'text-[#00F5A0]' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Invite Team Members</p>
                          </div>
                          <p className={`text-xs mb-4 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>
                            Send email invitations to your {formData.teamSize - 1} teammate{formData.teamSize > 2 ? 's' : ''} to join your application.
                          </p>
                          <div className="space-y-4">
                            {formData.teammates.map((teammate, i) => (
                          <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF]/15 to-[#7B2FFF]/15 text-xs font-bold text-[#00E5FF]">
                                    {i + 1}
                                  </div>
                                  <div className="flex-1">
                                    <input
                                      type="email"
                                      value={teammate.email}
                                      onChange={(e) => {
                                        const newTeammates = [...formData.teammates];
                                        newTeammates[i].email = e.target.value;
                                        setFormData({ ...formData, teammates: newTeammates });
                                        setValidationErrors(prev => ({ ...prev, [`teammate-${i}-email`]: '' }));
                                      }}
                                      placeholder={`teammate${i + 1}@email.com`}
                                      className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all ${isDark ? 'bg-[#1A2035] border-white/10 text-white focus:border-[#00F5A0]/50 placeholder:text-white/20' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 placeholder:text-gray-400'} ${validationErrors[`teammate-${i}-email`] ? 'border-[#FF4757]/60' : ''}`}
                                    />
                                    {validationErrors[`teammate-${i}-email`] && (
                                      <p className="mt-1 text-xs text-[#FF4757]">{validationErrors[`teammate-${i}-email`]}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="pl-10">
                                  <select
                                    value={teammate.role}
                                    onChange={(e) => {
                                      const newTeammates = [...formData.teammates];
                                      newTeammates[i].role = e.target.value;
                                      setFormData({ ...formData, teammates: newTeammates });
                                    }}
                                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${isDark ? 'bg-[#1A2035] border-white/10 text-white focus:border-[#00F5A0]' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'}`}
                                  >
                                    <option value="">Select teammate role</option>
                                    {commonRoles.map((role) => (
                                      <option key={role} value={role}>{role}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className={`block text-sm mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>Tech Stack</label>
                        <input
                          type="text"
                          placeholder="React, Python, TensorFlow... (comma separated)"
                          onChange={(e) => setFormData({ ...formData, techStack: e.target.value.split(',').map(s => s.trim()) })}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${isDark ? 'bg-[#1A2035] border-white/8 text-white focus:border-[#00F5A0]' : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'}`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>Pitch Deck (PDF, max 10MB)</label>
                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${isDark ? 'border-white/20 hover:border-[#00F5A0]' : 'border-gray-300 hover:border-blue-500'}`}>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePitchDeckUpload}
                            className="hidden"
                            id="deck-upload"
                          />
                          <label htmlFor="deck-upload" className="cursor-pointer">
                            {formData.pitchDeck ? (
                              <div>
                                <Check className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-[#00F5A0]' : 'text-green-500'}`} />
                                <p className={isDark ? 'text-white' : 'text-gray-900'}>{formData.pitchDeck.name}</p>
                                <p className={`text-xs ${isDark ? 'text-[#8892A4]' : 'text-gray-500'}`}>
                                  {(formData.pitchDeck.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <>
                                <Upload className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-400'}`} />
                                <p className={isDark ? 'text-[#8892A4]' : 'text-gray-500'}>Upload your pitch deck</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className={`rounded-xl p-6 border ${isDark ? 'bg-[#1A2035]/50 border-white/8' : 'bg-gray-100 border-gray-300'}`}>
                        <p className={`text-xs mb-3 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>Application Summary</p>
                        <div className="space-y-2 text-sm">
                          <p><span className={isDark ? 'text-[#8892A4]' : 'text-gray-600'}>Project:</span> {formData.projectName}</p>
                          <p><span className={isDark ? 'text-[#8892A4]' : 'text-gray-600'}>Sector:</span> {formData.sector}</p>
                          <p className={`line-clamp-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>
                            {useAiVersion ? 'Using AI-enhanced pitch' : formData.pitchOriginal}
                          </p>
                        </div>
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.acceptTerms}
                          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                          className={`mt-1 w-5 h-5 rounded ${isDark ? 'border-white/20' : 'border-gray-400'}`}
                        />
                        <span className={`text-sm ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>
                          I confirm this is my original work and accept the confidentiality terms
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" onClick={() => {
                        if (questionsStep !== null && eventQuestions.length > 0) {
                          setCurrentStep(questionsStep);
                        } else {
                          setCurrentStep(1);
                        }
                      }}>
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={!formData.acceptTerms}
                        className="text-lg px-8"
                      >
                        Submit Application
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`backdrop-blur-xl rounded-3xl p-12 text-center ${isDark ? 'bg-[rgba(15,22,40,0.95)] border border-white/20' : 'bg-slate-50 border border-gray-200'}`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                >
                  <Check size={48} className="text-white" />
                </motion.div>

                <h2 className={`text-4xl mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Application Submitted!</h2>
                <p className={`mb-8 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>
                  Your application has been successfully submitted and is now under review.
                </p>

                <div className={`rounded-xl p-6 mb-8 inline-block border ${isDark ? 'bg-[#1A2035] border-white/8' : 'bg-gray-100 border-gray-300'}`}>
                  <p className={`text-xs mb-2 ${isDark ? 'text-[#8892A4]' : 'text-gray-600'}`}>Application Reference ID</p>
                  <p className={`text-2xl font-mono ${isDark ? 'text-white/90' : 'text-gray-900'}`}>
                    QAI-{Date.now().toString(36).toUpperCase()}
                  </p>
                </div>

                <div className="mt-6">
                  <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                    Track your application
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
