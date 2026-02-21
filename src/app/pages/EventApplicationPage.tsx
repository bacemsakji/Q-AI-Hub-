import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Upload, Check, Sparkles, Github } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { toast } from 'sonner';
import { events } from '../data/mockData';

export function EventApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAiVersion, setUseAiVersion] = useState(false);

  const event = events.find(e => e.id === Number(id));

  const [formData, setFormData] = useState({
    projectName: '',
    sector: '',
    tagline: '',
    logo: null as File | null,
    pitchOriginal: '',
    pitchEnhanced: '',
    githubUrl: '',
    teamSize: 1,
    techStack: [] as string[],
    pitchDeck: null as File | null,
    acceptTerms: false,
  });

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
    if (!formData.acceptTerms) {
      toast.error('Please accept the terms to submit');
      return;
    }

    const applicationId = `QAI-${Date.now().toString(36).toUpperCase()}`;

    // Show confetti effect and success state
    setIsSubmitted(true);

    toast.success('Your application was sent successfully. A confirmation email has been sent to your inbox.');

    setTimeout(() => {
      localStorage.setItem(`application-${event.id}`, JSON.stringify({
        ...formData,
        applicationId,
        eventId: event.id,
        eventName: event.title,
        status: 'Pending',
        submittedDate: new Date().toISOString(),
      }));
    }, 1000);
  };

  const sectors = ['HealthTech', 'FinTech', 'EdTech', 'GreenTech', 'DeepTech'];

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen py-12 px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#8892A4] hover:text-white transition-colors mb-6"
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
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep === step
                      ? 'bg-white/20 text-white border border-white/25 scale-110'
                      : currentStep > step
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'bg-[#1A2035] text-[#8892A4] border border-white/10'
                      }`}
                  >
                    {currentStep > step ? <Check size={20} /> : step}
                  </div>
                  <span
                    className={`text-sm ${currentStep >= step ? 'text-white' : 'text-[#8892A4]'
                      }`}
                  >
                    {step === 1 ? 'Project Info' : step === 2 ? 'AI Pitch' : 'Submit'}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${currentStep > step ? 'bg-white/25' : 'bg-[#1A2035]'
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
                    className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-3xl p-8"
                  >
                    <h2 className="text-2xl mb-6">Project Information</h2>

                    <div className="space-y-6">
                      <Input
                        label="Project Name"
                        type="text"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      />

                      <div>
                        <label className="block text-sm text-[#8892A4] mb-2">Sector</label>
                        <select
                          value={formData.sector}
                          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-[#00F5A0] transition-colors"
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
                        <label className="block text-sm text-[#8892A4] mb-2">Project Logo</label>
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#00F5A0] transition-colors cursor-pointer">
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
                                <Check className="w-12 h-12 mx-auto mb-2 text-[#00F5A0]" />
                                <p className="text-white">{formData.logo.name}</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-12 h-12 mx-auto mb-2 text-[#8892A4]" />
                                <p className="text-[#8892A4]">Click or drag your logo here</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <Button
                        variant="primary"
                        onClick={() => setCurrentStep(2)}
                        disabled={!formData.projectName || !formData.sector || !formData.tagline}
                      >
                        Next
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-3xl p-8"
                  >
                    <h2 className="text-2xl mb-6">AI Pitch Assistant</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-[#8892A4] mb-2">
                          Describe your idea in plain language
                        </label>
                        <textarea
                          value={formData.pitchOriginal}
                          onChange={(e) => setFormData({ ...formData, pitchOriginal: e.target.value })}
                          className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-[#00F5A0] transition-colors min-h-[150px] resize-none"
                          placeholder="Tell us about your project, what problem it solves, and who it helps..."
                        />
                        <div className="text-right text-xs text-[#8892A4] mt-1">
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
                          <div className="h-4 bg-[#1A2035] rounded animate-pulse" />
                          <div className="h-4 bg-[#1A2035] rounded animate-pulse w-3/4" />
                          <div className="h-4 bg-[#1A2035] rounded animate-pulse w-5/6" />
                          <p className="text-sm text-[#8892A4] text-center">Structuring your pitch...</p>
                        </div>
                      )}

                      {aiPitch.problem && !isGenerating && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-[#1A2035]/50 border border-white/8 rounded-xl p-6">
                            <p className="text-xs text-[#8892A4] mb-2">Your Original</p>
                            <p className="text-sm text-[#8892A4] line-clamp-6">{formData.pitchOriginal}</p>
                          </div>

                          <div className="bg-white/10 border border-white/20 rounded-xl p-6 relative">
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
                          <Button variant="primary" onClick={() => { setUseAiVersion(true); setCurrentStep(3); }}>
                            Use Enhanced Version
                          </Button>
                          <Button variant="ghost" onClick={() => { setUseAiVersion(false); setCurrentStep(3); }}>
                            Keep Original
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      {!aiPitch.problem && (
                        <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                          Skip AI Enhancement
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-3xl p-8"
                  >
                    <h2 className="text-2xl mb-6">Final Details</h2>

                    <div className="space-y-6">
                      <Input
                        label="GitHub Repository URL"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                      />

                      <div>
                        <label className="block text-sm text-[#8892A4] mb-2">Team Size</label>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={formData.teamSize}
                          onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })}
                          className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-[#00F5A0] transition-colors"
                        />
                      </div>

                      {/* Team Member Email Invitations */}
                      {formData.teamSize > 1 && (
                        <div className="bg-[#0F1628] border border-white/8 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <svg className="h-4 w-4 text-[#00F5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <p className="text-sm font-medium text-white">Invite Team Members</p>
                          </div>
                          <p className="text-xs text-[#8892A4] mb-4">
                            Send email invitations to your {formData.teamSize - 1} teammate{formData.teamSize > 2 ? 's' : ''} to join your application.
                          </p>
                          <div className="space-y-3">
                            {Array.from({ length: Math.min(formData.teamSize - 1, 5) }, (_, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF]/15 to-[#7B2FFF]/15 text-xs font-bold text-[#00E5FF]">
                                  {i + 1}
                                </div>
                                <input
                                  type="email"
                                  placeholder={`teammate${i + 1}@email.com`}
                                  className="flex-1 px-3 py-2.5 bg-[#1A2035] rounded-lg border border-white/10 text-sm text-white outline-none focus:border-[#00F5A0]/50 placeholder:text-white/20 transition-all"
                                />
                                <button
                                  type="button"
                                  className="px-3 py-2.5 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/20 text-[#00F5A0] text-xs font-medium hover:bg-[#00F5A0]/20 transition-all whitespace-nowrap"
                                >
                                  Invite
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm text-[#8892A4] mb-2">Tech Stack</label>
                        <input
                          type="text"
                          placeholder="React, Python, TensorFlow... (comma separated)"
                          onChange={(e) => setFormData({ ...formData, techStack: e.target.value.split(',').map(s => s.trim()) })}
                          className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-[#00F5A0] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#8892A4] mb-2">Pitch Deck (PDF, max 10MB)</label>
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-[#00F5A0] transition-colors cursor-pointer">
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
                                <Check className="w-10 h-10 mx-auto mb-2 text-[#00F5A0]" />
                                <p className="text-white">{formData.pitchDeck.name}</p>
                                <p className="text-xs text-[#8892A4]">
                                  {(formData.pitchDeck.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mx-auto mb-2 text-[#8892A4]" />
                                <p className="text-[#8892A4]">Upload your pitch deck</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="bg-[#1A2035]/50 border border-white/8 rounded-xl p-6">
                        <p className="text-xs text-[#8892A4] mb-3">Application Summary</p>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-[#8892A4]">Project:</span> {formData.projectName}</p>
                          <p><span className="text-[#8892A4]">Sector:</span> {formData.sector}</p>
                          <p className="text-[#8892A4] line-clamp-2">
                            {useAiVersion ? 'Using AI-enhanced pitch' : formData.pitchOriginal}
                          </p>
                        </div>
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.acceptTerms}
                          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                          className="mt-1 w-5 h-5 rounded border-white/20"
                        />
                        <span className="text-sm text-[#8892A4]">
                          I confirm this is my original work and accept the confidentiality terms
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="ghost" onClick={() => setCurrentStep(2)}>
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
                className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                >
                  <Check size={48} className="text-white" />
                </motion.div>

                <h2 className="text-4xl mb-4">Application Submitted!</h2>
                <p className="text-[#8892A4] mb-8">
                  Your application has been successfully submitted and is now under review.
                </p>

                <div className="bg-[#1A2035] rounded-xl p-6 mb-8 inline-block">
                  <p className="text-xs text-[#8892A4] mb-2">Application Reference ID</p>
                  <p className="text-2xl font-mono text-white/90">
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
