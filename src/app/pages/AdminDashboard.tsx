import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ParticleBackground } from '../components/ParticleBackground';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { DashboardHome } from '../components/admin/DashboardHome';
import { EventsManager } from '../components/admin/EventsManager';
import { UsersSection } from '../components/admin/UsersSection';
import { StartupsSection } from '../components/admin/StartupsSection';
import { PitchEvaluation } from '../components/admin/PitchEvaluation';
import { Settings, Shield, Globe, Database, Download, Lock, Eye, EyeOff, Check } from 'lucide-react';

function AdminPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) { setError('All fields are required.'); return; }
    if (newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setSuccess(true);
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-[#8892A4] mb-1">Current password</label>
        <div className="relative">
          <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password"
            className="w-full rounded-xl bg-[#111729] border border-white/10 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-white/40 pr-10 placeholder:text-white/20 transition-all" />
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892A4] hover:text-white transition-colors">
            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs text-[#8892A4] mb-1">New password</label>
        <div className="relative">
          <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 8 characters"
            className="w-full rounded-xl bg-[#111729] border border-white/10 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-white/40 pr-10 placeholder:text-white/20 transition-all" />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892A4] hover:text-white transition-colors">
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs text-[#8892A4] mb-1">Confirm new password</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"
          className="w-full rounded-xl bg-[#111729] border border-white/10 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-white/40 placeholder:text-white/20 transition-all" />
      </div>
      {error && <p className="text-sm text-[#FF4757]">{error}</p>}
      {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#00FFC2] flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Password updated successfully</motion.p>}
      <button type="submit" className="w-full px-4 py-2.5 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/25 text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF]/25 transition-all">Update Password</button>
    </form>
  );
}

function SettingsSection() {
  const [platformSettings, setPlatformSettings] = useState({
    allowPublicRegistrations: true,
    requireEmailVerification: true,
    allowLateSubmissions: false,
    showAnonymisedToJury: false,
  });

  const toggleSetting = (key: keyof typeof platformSettings) => {
    setPlatformSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="mt-1 text-sm text-[#8892A4]">Configure platform behavior, permissions, and data exports</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Platform Settings + Change Password */}
        <div className="space-y-6">
          <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-[#00E5FF]" />
              <h3 className="text-lg font-bold text-white">Platform Settings</h3>
            </div>
            {([
              { key: 'allowPublicRegistrations' as const, label: 'Allow public registrations', desc: 'Anyone can create an account' },
              { key: 'requireEmailVerification' as const, label: 'Require email verification', desc: 'Users must verify email before access' },
              { key: 'allowLateSubmissions' as const, label: 'Allow late submissions', desc: 'Accept applications after deadline with penalty' },
              { key: 'showAnonymisedToJury' as const, label: 'Show anonymised to jury', desc: 'Hide applicant names during evaluation' },
            ] as const).map(item => {
              const isOn = platformSettings[item.key];
              return (
                <button key={item.key} type="button" onClick={() => toggleSetting(item.key)}
                  className="w-full flex items-center justify-between py-4 border-b border-white/5 last:border-0 text-left">
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-[#8892A4]">{item.desc}</p>
                  </div>
                  <div className={`w-11 h-6 rounded-full flex items-center px-0.5 border transition-all ${isOn ? 'bg-[#00FFC2]/20 border-[#00FFC2]/40' : 'bg-[#1A2035] border-white/10'}`}>
                    <span className={`w-4 h-4 bg-white rounded-full transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Change Password */}
          <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-[#00E5FF]" />
              <h3 className="text-lg font-bold text-white">Change Password</h3>
            </div>
            <AdminPasswordForm />
          </div>
        </div>

        {/* Right Column: Admin Profile + Data & Exports */}
        <div className="space-y-6">
          <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-[#00E5FF]" />
              <h3 className="text-lg font-bold text-white">Admin Profile</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00E5FF]/20 text-lg font-bold text-[#00E5FF]">AD</div>
              <div>
                <p className="font-medium text-white">Admin User</p>
                <p className="text-sm text-[#8892A4]">Super Admin · Q-AI Hub</p>
                <p className="mt-0.5 text-xs text-[#8892A4]">Last sign-in: 2 hours ago</p>
              </div>
            </div>
          </div>

          <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-[#00E5FF]" />
              <h3 className="text-lg font-bold text-white">Data & Exports</h3>
            </div>
            <div className="space-y-2">
              {['Download applications CSV', 'Download jury scores CSV', 'Export event list'].map(label => (
                <button key={label} type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-[#1A2035] text-sm text-white hover:border-white/20 hover:bg-white/5 transition-all">
                  <Download className="h-4 w-4 text-[#8892A4]" />{label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardHome onNavigate={setActiveSection} />;
      case 'events': return <EventsManager />;
      case 'users': return <UsersSection />;
      case 'startups': return <StartupsSection />;
      case 'pitch': return <PitchEvaluation />;
      case 'settings': return <SettingsSection />;
      default: return <DashboardHome onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen relative flex">
      <ParticleBackground />
      <AdminSidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="w-full ml-64 flex-1 relative z-10 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
