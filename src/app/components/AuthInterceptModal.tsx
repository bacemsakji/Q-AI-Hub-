import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

interface AuthInterceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName?: string;
  eventDate?: string;
  returnUrl?: string;
}

export function AuthInterceptModal({ 
  isOpen, 
  onClose, 
  eventName, 
  eventDate,
  returnUrl 
}: AuthInterceptModalProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login', { state: { returnUrl, eventName } });
  };

  const handleRegister = () => {
    navigate('/register', { state: { returnUrl, eventName } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-3xl p-8 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#8892A4] hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <Lock className="text-white/90" size={28} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-2xl mb-2">Sign in to Apply</h3>
                <p className="text-[#8892A4]">
                  Log in or create your account to submit your application and track your progress.
                </p>
              </div>

              {/* Event Context */}
              {eventName && (
                <div className="bg-[#1A2035] rounded-xl p-4 border border-white/8">
                  <p className="text-sm text-[#8892A4] mb-1">Applying to</p>
                  <p className="text-white">{eventName}</p>
                  {eventDate && <p className="text-xs text-[#8892A4] mt-1">{eventDate}</p>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button variant="primary" fullWidth onClick={handleLogin}>
                  Log In
                </Button>
                <Button variant="ghost" fullWidth onClick={handleRegister}>
                  Create Account
                </Button>
              </div>

              {/* Helper text */}
              <p className="text-xs text-[#8892A4]">
                Your application will resume after login
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
