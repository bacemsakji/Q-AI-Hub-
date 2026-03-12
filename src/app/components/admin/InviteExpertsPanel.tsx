import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, X, Mail, Shield, Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export type ExpertRole = 'Field Expert' | 'Finance Expert' | 'Technical Expert' | 'Legal Expert' | 'Marketing Expert';

export interface EventExpert {
  email: string;
  role: ExpertRole;
  invitedAt: string;
}

const ROLES: ExpertRole[] = [
  'Field Expert',
  'Finance Expert',
  'Technical Expert',
  'Legal Expert',
  'Marketing Expert',
];

const ROLE_COLORS: Record<ExpertRole, { bg: string; text: string; border: string }> = {
  'Field Expert':     { bg: 'bg-[#00F5A0]/10', text: 'text-[#00F5A0]', border: 'border-[#00F5A0]/25' },
  'Finance Expert':   { bg: 'bg-[#00D9F5]/10', text: 'text-[#00D9F5]', border: 'border-[#00D9F5]/25' },
  'Technical Expert': { bg: 'bg-[#7B2FFF]/10', text: 'text-[#a78bfa]', border: 'border-[#7B2FFF]/25' },
  'Legal Expert':     { bg: 'bg-[#FFB800]/10', text: 'text-[#FFB800]', border: 'border-[#FFB800]/25' },
  'Marketing Expert': { bg: 'bg-[#FF4757]/10', text: 'text-[#FF4757]', border: 'border-[#FF4757]/25' },
};

interface InviteExpertsPanelProps {
  eventId?: string;
  initialExperts?: EventExpert[];
  onChange?: (experts: EventExpert[]) => void;
}

export function InviteExpertsPanel({ eventId, initialExperts = [], onChange }: InviteExpertsPanelProps) {
  const [experts, setExperts] = useState<EventExpert[]>(() => {
    if (eventId) {
      const stored = localStorage.getItem(`event-experts-${eventId}`);
      if (stored) return JSON.parse(stored);
    }
    return initialExperts;
  });
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ExpertRole>('Field Expert');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const save = (updated: EventExpert[]) => {
    setExperts(updated);
    if (eventId) {
      localStorage.setItem(`event-experts-${eventId}`, JSON.stringify(updated));
    }
    onChange?.(updated);
  };

  const handleAdd = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (experts.find(e => e.email === trimmed && e.role === role)) {
      toast.error('This person already has this role for this event');
      return;
    }
    const newExpert: EventExpert = { email: trimmed, role, invitedAt: new Date().toISOString() };
    const updated = [...experts, newExpert];
    save(updated);
    setEmail('');
    toast.success(`Invitation sent to ${trimmed} as ${role}`);
  };

  const handleRemove = (idx: number) => {
    const updated = experts.filter((_, i) => i !== idx);
    save(updated);
  };

  const c = ROLE_COLORS[role];

  return (
    <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-8">
      <h2 className="text-lg mb-1 text-white/90 flex items-center gap-2">
        <Shield size={18} className="text-[#7B2FFF]" />
        Invite Partners &amp; Experts
      </h2>
      <p className="text-[#8892A4] text-sm mb-6">
        Invite users by email and assign them an expert role for this event. They will be able to observe pitches alongside the admin.
      </p>

      {/* Add form */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Email */}
        <div className="relative flex-1">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8892A4]" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="partner@email.com"
            className="w-full pl-9 pr-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white text-sm outline-none focus:border-[#7B2FFF]/60 transition-colors placeholder:text-white/20"
          />
        </div>

        {/* Role dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(v => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm min-w-[180px] justify-between ${c.bg} ${c.text} ${c.border}`}
          >
            <span>{role}</span>
            <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-full mb-2 left-0 right-0 z-50 bg-[#0F1628] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
              >
                {ROLES.map(r => {
                  const rc = ROLE_COLORS[r];
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setRole(r); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors ${r === role ? 'bg-white/5' : ''}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${rc.bg.replace('/10', '')}`} style={{
                        background: rc.text.replace('text-[', '').replace(']', '')
                      }} />
                      <span className={rc.text}>{r}</span>
                      {r === role && <Check size={12} className="ml-auto text-white/40" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#7B2FFF]/20 border border-[#7B2FFF]/30 text-[#a78bfa] rounded-xl text-sm font-medium hover:bg-[#7B2FFF]/30 transition-all whitespace-nowrap"
        >
          <UserPlus size={16} />
          Add Invite
        </button>
      </div>

      {/* Invited list */}
      {experts.length === 0 ? (
        <div className="flex items-center justify-center py-8 rounded-xl border border-dashed border-white/10">
          <p className="text-sm text-[#8892A4]">No experts invited yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <p className="text-xs text-[#8892A4] mb-3 uppercase tracking-wider">{experts.length} expert{experts.length !== 1 ? 's' : ''} invited</p>
          <AnimatePresence>
            {experts.map((expert, idx) => {
              const rc = ROLE_COLORS[expert.role];
              return (
                <motion.div
                  key={`${expert.email}-${expert.role}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 bg-[#1A2035] border border-white/8 rounded-xl px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B2FFF]/20 to-[#00E5FF]/20 text-xs font-bold text-[#a78bfa]">
                    {expert.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{expert.email}</p>
                    <p className="text-xs text-[#8892A4]">
                      Invited {new Date(expert.invitedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs border ${rc.bg} ${rc.text} ${rc.border} whitespace-nowrap`}>
                    {expert.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-[#8892A4] hover:text-[#FF4757] transition-colors ml-1"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
