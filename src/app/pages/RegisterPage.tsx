import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Info, Lock } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const returnUrl = (location.state as any)?.returnUrl;
  const eventName = (location.state as any)?.eventName;

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Mock registration
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('userName', formData.fullName);

    if (returnUrl && eventName) {
      toast.success(`Account created! Resuming your application for ${eventName}`);
      navigate(returnUrl);
    } else {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    }
  };

  const strengthLabels = ['', 'Too weak', 'Weak', 'Medium', 'Strong'];
  const strengthColors = ['', '#FF4757', '#FFB800', '#00D9F5', '#00F5A0'];

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
          <h1 className="text-3xl mb-2">Join Q-Ai Hub</h1>
          <p className="text-[#8892A4]">
            Start your Quantum-AI entrepreneurship journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />

          <div className="relative">
            <Input
              label="ENICarthage Student ID"
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              error={errors.studentId}
            />
            <div className="group absolute right-3 top-7">
              <Info size={16} className="text-[#8892A4] cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-[#1A2035] rounded-lg text-xs text-[#8892A4] border border-white/8">
                Used to verify your enrollment
              </div>
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <div>
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={errors.password}
            />
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: level <= passwordStrength ? strengthColors[passwordStrength] : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
                <p
                  className="text-xs"
                  style={{ color: strengthColors[passwordStrength] }}
                >
                  {strengthLabels[passwordStrength]}
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" fullWidth>
            Create Account
          </Button>

          <p className="text-center text-sm text-[#8892A4]">
            Already have an account?{' '}
            <Link
              to="/login"
              state={{ returnUrl, eventName }}
              className="text-[#00F5A0] hover:text-[#00D9F5] transition-colors"
            >
              Log In →
            </Link>
          </p>

          <div className="mt-6 p-3 bg-[#1A2035]/50 rounded-lg border border-white/8 flex items-start gap-2">
            <Lock size={16} className="text-[#00F5A0] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#8892A4]">
              Your ideas are protected under our confidentiality policy
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
