import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Upload, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { GradientButton } from '../components/GradientButton';
import { GlassCard } from '../components/GlassCard';
import { ParticleBackground } from '../components/ParticleBackground';
import { programs } from '../data/mockData';
import { toast } from 'sonner';

export function ProgramApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const program = programs.find((p) => p.id === Number(id));

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    startupName: '',
    sector: '',
    logo: null as File | null,
    description: '',
    aiDescription: '',
    githubUrl: '',
    teamSize: '',
    techStack: '',
    pitchDeck: null as File | null,
    agreeToTerms: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  if (!program) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] text-white flex items-center justify-center">
        <p className="text-[#8892A4]">Program not found</p>
      </div>
    );
  }

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logo' | 'pitchDeck',
  ) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const generateEnhancedDescription = (original: string) => {
    if (!original.trim()) return '';

    return `**Problem**
The current market lacks accessible quantum-AI solutions for real-time data processing in edge computing environments. Traditional approaches are too complex and expensive for SMEs to adopt.

**Solution**
Our platform leverages hybrid quantum-classical algorithms to deliver 10x faster processing at 50% reduced cost. We provide a no-code interface that democratizes access to quantum computing power.

**Target Market**
Initially targeting FinTech and HealthTech sectors with 500+ potential enterprise clients. Total addressable market: $2.5B by 2028, growing at 45% CAGR.`;
  };

  const handleGenerateAI = () => {
    if (!formData.description.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const enhanced = generateEnhancedDescription(formData.description);
      setFormData({ ...formData, aiDescription: enhanced });
      setIsGenerating(false);
      setShowComparison(true);
    }, 1800);
  };

  const sectors = [
    'HealthTech',
    'FinTech',
    'EdTech',
    'GreenTech',
    'DeepTech',
    'AgriTech',
    'Cybersecurity',
  ];

  const handleSubmit = () => {
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms before submitting.');
      return;
    }

    toast.success('Your program application was sent successfully.');
    toast.message('A confirmation email has been sent to your inbox with your application details.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative bg-[#0A0E1A] text-white py-24 px-6">
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#8892A4] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-[#8892A4]">
            Program Application
          </span>
        </div>

        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="text-white">
              Apply to {program.title}
            </span>
          </h1>
          <p className="text-[#8892A4] text-sm uppercase tracking-[0.2em] mb-3">
            {program.axis}
          </p>
          <p className="text-[#8892A4] text-base max-w-2xl mx-auto">
            Share your startup vision and join the next generation of quantum‑AI
            builders at ENICarthage.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-white/5 overflow-hidden rounded-full">
              <div
                className="h-full bg-white/30 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>

            {[1, 2, 3].map((step) => (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step
                      ? 'bg-white/20 text-white border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                      : 'bg-[#0F1628] text-white/40 border border-white/10'
                  }`}
                >
                  {currentStep > step ? <Check size={20} /> : step}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    currentStep >= step ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {step === 1 ? 'Profile' : step === 2 ? 'Description' : 'Submit'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Startup Profile */}
        {currentStep === 1 && (
          <GlassCard>
            <div className="p-8">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Startup Profile
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Startup Name *
                  </label>
                  <input
                    type="text"
                    value={formData.startupName}
                    onChange={(e) =>
                      setFormData({ ...formData, startupName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#1A2035] border border-white/10 rounded-lg focus:border-[#00D9F5] focus:outline-none transition-colors text-white"
                    placeholder="Enter your startup name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sector *
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) =>
                      setFormData({ ...formData, sector: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#1A2035] border border-white/10 rounded-lg focus:border-[#00D9F5] focus:outline-none transition-colors text-white"
                  >
                    <option value="">Select a sector</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Logo
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#00D9F5]/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="hidden"
                      id="program-logo-upload"
                    />
                    <label htmlFor="program-logo-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-[#8892A4]" />
                      <p className="text-sm text-[#8892A4]">
                        {formData.logo
                          ? formData.logo.name
                          : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-[#8892A4]/60 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </label>
                  </div>
                </div>

                <GradientButton
                  fullWidth
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.startupName || !formData.sector}
                  className={
                    !formData.startupName || !formData.sector
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }
                >
                  Continue to Description{' '}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </GradientButton>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Step 2: AI-Assisted Description */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <GlassCard>
              <div className="p-8">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Project Description
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Describe your idea in your own words... *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={8}
                      className="w-full px-4 py-3 bg-[#1A2035] border border-white/10 rounded-lg focus:border-[#00D9F5] focus:outline-none transition-colors text-white resize-none"
                      placeholder="Tell us about the problem you're solving, your solution, and your target market..."
                    />
                  </div>

                  <GradientButton
                    fullWidth
                    onClick={handleGenerateAI}
                    disabled={!formData.description || isGenerating}
                    className={
                      !formData.description
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }
                  >
                    <Sparkles className="mr-2 w-5 h-5" />
                    {isGenerating ? 'Optimizing with AI...' : 'Optimize with AI'}
                  </GradientButton>
                </div>
              </div>
            </GlassCard>

            {isGenerating && (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <GlassCard key={i}>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-white/10 rounded animate-pulse" />
                      <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {showComparison && !isGenerating && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <GlassCard>
                    <div className="p-6">
                      <h3 className="text-sm font-bold text-[#8892A4] mb-3">
                        Your Original Text
                      </h3>
                      <p className="text-sm text-white/80 whitespace-pre-wrap">
                        {formData.description}
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard gradient>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[#00F5A0]" />
                        <h3 className="text-sm font-bold text-white">
                          AI-Enhanced Version
                        </h3>
                      </div>
                      <div className="text-sm text-white/90 space-y-3 whitespace-pre-wrap">
                        {formData.aiDescription}
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <GradientButton fullWidth onClick={() => setCurrentStep(3)}>
                  Use AI-Enhanced Version{' '}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </GradientButton>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 rounded-full font-semibold border-2 border-white/20 text-white hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              {!showComparison && (
                <GradientButton
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData.description}
                  className={`flex-grow ${
                    !formData.description ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Skip AI Enhancement
                </GradientButton>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Dynamic Form */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <GlassCard>
              <div className="p-8">
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Additional Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, githubUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#1A2035] border border-white/10 rounded-lg focus:border-[#00D9F5] focus:outline-none transition-colors text-white"
                      placeholder="https://github.com/your-repo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Team Size
                    </label>
                    <input
                      type="number"
                      value={formData.teamSize}
                      onChange={(e) =>
                        setFormData({ ...formData, teamSize: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#1A2035] border border-white/10 rounded-lg focus:border-[#00D9F5] focus:outline-none transition-colors text-white"
                      placeholder="Enter number of team members"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tech Stack Used
                    </label>
                    <input
                      type="text"
                      value={formData.techStack}
                      onChange={(e) =>
                        setFormData({ ...formData, techStack: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-[#1A2035] border border-white/10 rounded-lg focus:border-[#00D9F5] focus:outline-none transition-colors text-white"
                      placeholder="e.g., React, Python, TensorFlow, Qiskit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pitch Deck (PDF, max 10MB)
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#00D9F5]/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload(e, 'pitchDeck')}
                        className="hidden"
                        id="program-deck-upload"
                      />
                      <label htmlFor="program-deck-upload" className="cursor-pointer">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-[#8892A4]" />
                        <p className="text-sm text-[#8892A4]">
                          {formData.pitchDeck
                            ? formData.pitchDeck.name
                            : 'Upload your pitch deck'}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[#00D9F5]/10 rounded-lg border border-[#00D9F5]/30">
                    <input
                      type="checkbox"
                      id="program-terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agreeToTerms: e.target.checked,
                        })
                      }
                      className="mt-1 w-5 h-5 rounded accent-[#00D9F5]"
                    />
                    <label
                      htmlFor="program-terms"
                      className="text-sm text-white/90"
                    >
                      I agree to the terms and conditions. I understand that Q-Ai
                      Hub provides IP protection and confidentiality for all
                      submissions.
                    </label>
                  </div>

                  <GradientButton
                    fullWidth
                    disabled={!formData.agreeToTerms}
                    onClick={handleSubmit}
                    className={`!py-4 ${
                      !formData.agreeToTerms
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    Submit Application
                  </GradientButton>
                </div>
              </div>
            </GlassCard>

            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-full font-semibold border-2 border-white/20 text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-[#00D9F5] hover:text-[#00F5A0] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

