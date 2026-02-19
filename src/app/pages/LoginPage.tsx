import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const returnUrl = (location.state as any)?.returnUrl;
  const eventName = (location.state as any)?.eventName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock authentication
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('userName', 'Student User');

    if (returnUrl && eventName) {
      toast.success(`Welcome back! Resuming your application for ${eventName}`);
      navigate(returnUrl);
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-3xl p-10 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">Welcome Back</h1>
          <p className="text-[#8892A4]">
            Sign in to access your dashboard and applications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-[#8892A4]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-transparent"
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="text-[#8892A4] hover:text-[#00F5A0] transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Log In
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0F1628] text-[#8892A4]">or</span>
            </div>
          </div>

          <p className="text-center text-sm text-[#8892A4]">
            Don't have an account?{' '}
            <Link
              to="/register"
              state={{ returnUrl, eventName }}
              className="text-[#00F5A0] hover:text-[#00D9F5] transition-colors"
            >
              Create one →
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
