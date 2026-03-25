import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const returnUrl = (location.state as any)?.returnUrl;
  const eventName = (location.state as any)?.eventName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('userName', 'Student User');

    if (returnUrl && eventName) {
      toast.success(`Welcome back! Resuming your application for ${eventName}`);
      navigate('/otp', { state: { email, returnUrl, eventName } });
    } else {
      toast.success('Welcome back!');
      navigate('/otp', { state: { email } });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <ParticleBackground />

      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[#00F5A0]/4 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Gradient border card */}
        <div className="p-px rounded-3xl bg-gradient-to-br from-primary/30 via-foreground/5 to-accent/20">
          <div className="bg-card backdrop-blur-2xl rounded-3xl p-10 shadow-glass">

            <div className="flex justify-center mb-8">
              <Logo size="md" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {eventName
                  ? `Sign in to continue your application for ${eventName}`
                  : 'Sign in to access your dashboard and applications'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                    placeholder="your@email.com"
                    className={`w-full pl-11 pr-4 py-3.5 bg-card rounded-xl border text-foreground text-sm outline-none transition-all placeholder:text-muted-foreground/40 ${errors.email ? 'border-[#FF4757]/60' : 'border-border focus:border-[#00F5A0]/50'
                      }`}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-destructive dark:text-[#FF4757]">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3.5 bg-card rounded-xl border text-foreground text-sm outline-none transition-all placeholder:text-muted-foreground/40 ${errors.password ? 'border-[#FF4757]/60' : 'border-border focus:border-[#00F5A0]/50'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-destructive dark:text-[#FF4757]">{errors.password}</p>}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setRememberMe(p => !p)}
                    className={`w-[18px] h-[18px] rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${rememberMe ? 'bg-[#00F5A0]/20 border-[#00F5A0]/60' : 'border-border bg-transparent'
                      }`}
                  >
                    {rememberMe && <span className="text-emerald-600 dark:text-[#00F5A0] text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors select-none">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-emerald-600 dark:text-[#00F5A0] transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                fullWidth
                className="mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-background text-muted-foreground">or</span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  state={{ returnUrl, eventName }}
                  className="text-cyan-500 hover:text-cyan-400 dark:text-[#00E5FF] transition-colors font-medium"
                >
                  Create one →
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
