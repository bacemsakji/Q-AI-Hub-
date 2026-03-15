import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, Eye, EyeOff, CreditCard, Shield } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const returnUrl = (location.state as any)?.returnUrl;
  const eventName = (location.state as any)?.eventName;

  const calcStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) s++;
    if (/\d/.test(pwd)) s++;
    if (/[^a-zA-Z0-9]/.test(pwd)) s++;
    return s;
  };

  const set = (field: string, value: string) => {
    setFormData(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
    if (field === 'password') setPasswordStrength(calcStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('userName', formData.fullName);

    if (returnUrl && eventName) {
      toast.success(`Account created! Resuming your application for ${eventName}`);
      toast.message('A confirmation email has been sent to your inbox with your account details.');
      navigate(returnUrl);
    } else {
      toast.success('Account created successfully!');
      toast.message('A confirmation email has been sent to your inbox with your account details.');
      navigate('/dashboard');
    }
  };

  const strengthLabel = ['', 'Too weak', 'Weak', 'Medium', 'Strong'];
  const strengthColor = ['', '#FF4757', '#FFB800', '#00D9F5', '#00F5A0'];

  const Field = ({
    label, icon: Icon, type, field, placeholder, showToggle, onToggle, show,
  }: {
    label: string; icon: any; type: string; field: string;
    placeholder: string; showToggle?: boolean; onToggle?: () => void; show?: boolean;
  }) => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type={showToggle ? (show ? 'text' : 'password') : type}
          value={(formData as any)[field]}
          onChange={e => set(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-11 ${showToggle ? 'pr-12' : 'pr-4'} py-3.5 bg-input rounded-xl border text-foreground text-sm outline-none transition-all placeholder:text-muted-foreground/40 ${errors[field] ? 'border-destructive/60' : 'border-border focus:border-primary/50'
            }`}
        />
        {showToggle && (
          <button type="button" onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {errors[field] && <p className="mt-1.5 text-xs text-red-600 dark:text-[#FF4757]">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 py-10">
      <ParticleBackground />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[#7B2FFF]/4 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="p-px rounded-3xl bg-gradient-to-br from-primary/30 via-foreground/5 to-accent/20">
          <div className="bg-card backdrop-blur-2xl rounded-3xl p-10 shadow-glass">

            <div className="flex justify-center mb-8">
              <Logo size="md" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Join Q-AI Hub</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Start your Quantum-AI entrepreneurship journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Full Name" icon={User} type="text" field="fullName" placeholder="Your full name" />

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">ENICarthage Student ID</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={e => set('studentId', e.target.value)}
                    placeholder="e.g. 2024-ENIC-XXXX"
                    className={`w-full pl-11 pr-4 py-3.5 bg-input rounded-xl border text-foreground text-sm outline-none transition-all placeholder:text-muted-foreground/40 ${errors.studentId ? 'border-destructive/60' : 'border-border focus:border-primary/50'
                      }`}
                  />
                </div>
                {errors.studentId && <p className="mt-1.5 text-xs text-red-600 dark:text-[#FF4757]">{errors.studentId}</p>}
                <p className="mt-1 text-xs text-muted-foreground">Used to verify your enrollment at ENICarthage</p>
              </div>

              <Field label="Email" icon={Mail} type="email" field="email" placeholder="your@email.com" />

              <div>
                <Field label="Password" icon={Lock} type="password" field="password" placeholder="Create a strong password"
                  showToggle onToggle={() => setShowPassword(p => !p)} show={showPassword} />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(lvl => (
                        <div key={lvl} className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: lvl <= passwordStrength ? strengthColor[passwordStrength] : 'rgba(255,255,255,0.08)' }} />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strengthColor[passwordStrength] }}>{strengthLabel[passwordStrength]}</p>
                  </div>
                )}
              </div>

              <Field label="Confirm Password" icon={Lock} type="password" field="confirmPassword" placeholder="Repeat your password"
                showToggle onToggle={() => setShowConfirm(p => !p)} show={showConfirm} />

              <Button
                type="submit"
                disabled={isLoading}
                fullWidth
                className="mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" state={{ returnUrl, eventName }}
                  className="text-cyan-500 hover:text-cyan-400 dark:text-[#00E5FF] transition-colors font-medium">
                  Log In →
                </Link>
              </p>

              {/* Security note */}
              <div className="mt-2 p-3 bg-card/60 rounded-xl border border-border flex items-center gap-3">
                <Shield size={16} className="text-emerald-600 dark:text-[#00F5A0] flex-shrink-0" />
                <p className="text-xs text-muted-foreground">Your ideas are protected under our confidentiality policy</p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
