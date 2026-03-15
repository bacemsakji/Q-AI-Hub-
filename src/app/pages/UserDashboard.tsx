import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, FileText, Bell, Settings, LogOut, Rocket, Calendar, BellRing, Lock, Eye, EyeOff, Check, Users, Shield } from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

function PasswordChangeForm() {
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
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Simulate password update
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Current password</label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full rounded-xl bg-input border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/40 pr-10 placeholder:text-muted-foreground/50 transition-all"
          />
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {/* New Password */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">New password</label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-xl bg-input border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/40 pr-10 placeholder:text-muted-foreground/50 transition-all"
          />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {/* Confirm Password */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Confirm new password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          className="w-full rounded-xl bg-input border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/40 placeholder:text-muted-foreground/50 transition-all"
        />
      </div>
      {error && <p className="text-sm text-destructive flex items-center gap-1.5">{error}</p>}
      {success && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary flex items-center gap-1.5">
          <Check size={14} /> Password updated successfully
        </motion.p>
      )}
      <button
        type="submit"
        className="w-full px-4 py-2.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-sm font-medium hover:bg-primary/25 transition-all"
      >
        Update Password
      </button>
    </form>
  );
}

export function UserDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [applications, setApplications] = useState<any[]>([]);
  const [primaryInterest, setPrimaryInterest] = useState('Hybrid Quantum-AI');
  const [availability, setAvailability] = useState<string[]>(['Weekdays', 'Weekends', 'Evenings']);
  const [notificationPrefs, setNotificationPrefs] = useState({
    appStatus: true,
    newEvents: true,
    juryFeedback: true,
  });
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const storedUserName = localStorage.getItem('userName') || 'Student';
  const [profileName, setProfileName] = useState(storedUserName);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load applications from localStorage
    let savedApps = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('application-')) {
        const app = JSON.parse(localStorage.getItem(key) || '{}');
        savedApps.push(app);
      }
    }

    // DEMO: If no accepted applications exist, let's pretend one is accepted as requested
    if (savedApps.length > 0 && !savedApps.some(a => a.status === 'Accepted')) {
      const firstApp = { ...savedApps[0], status: 'Accepted' };
      localStorage.setItem(`application-${firstApp.applicationId}`, JSON.stringify(firstApp));
      savedApps[0] = firstApp;
    } else if (savedApps.length === 0) {
      // Create a dummy accepted application for demo if list is empty
      const dummyApp = {
        applicationId: 'demo-123',
        eventName: 'Quantum AI Hackathon',
        projectName: 'Neural Quantum Engine',
        sector: 'Deep Tech',
        submittedDate: new Date().toISOString(),
        status: 'Accepted'
      };
      localStorage.setItem(`application-demo-123`, JSON.stringify(dummyApp));
      savedApps.push(dummyApp);
    }

    setApplications(savedApps);

    // Load expert roles from localStorage
    const userEmail = localStorage.getItem('userEmail') || 'student@eni.tn';
    let roles: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('event-experts-')) {
        const eventId = key.replace('event-experts-', '');
        const eventExperts = JSON.parse(localStorage.getItem(key) || '[]');
        const userExpertEntry = eventExperts.find((e: any) => e.email.toLowerCase() === userEmail.toLowerCase());

        if (userExpertEntry) {
          roles.push({
            eventId,
            role: userExpertEntry.role,
            invitedAt: userExpertEntry.invitedAt
          });
        }
      }
    }
    setUserRoles(roles);

    // Update active tab if query param changes
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }

    // Keep localStorage and profileName in sync on mount
    if (!localStorage.getItem('userName')) {
      localStorage.setItem('userName', storedUserName);
    }
  }, [navigate, searchParams, activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // Remove stored applications
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('application-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Clear basic user session/profile
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    navigate('/');
  };

  const stats = [
    { label: 'Active Applications', value: applications.filter(a => a.status !== 'Rejected').length, color: 'from-[#00F5A0] to-[#00D9F5]', icon: FileText, bg: 'bg-[#00F5A0]/10' },
    { label: 'Events Available', value: 6, color: 'from-[#00D9F5] to-[#0061FF]', icon: Calendar, bg: 'bg-[#00D9F5]/10' },
    { label: 'Notifications', value: 3, color: 'from-[#7B2FFF] to-[#0061FF]', icon: BellRing, bg: 'bg-[#7B2FFF]/10' },
  ];

  const statusColors: Record<string, string> = {
    Pending: 'bg-[#FFB800]/20 text-amber-600 dark:text-[#FFB800]',
    'Under Review': 'bg-primary/20 text-primary',
    Accepted: 'bg-foreground/15 text-foreground/90',
    Rejected: 'bg-destructive/20 text-destructive',
  };

  const navItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'applications', icon: FileText, label: 'My Applications' },
    { id: 'roles', icon: Shield, label: 'My Roles' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <DashboardHeader
          activeTab={activeTab}
          profileName={profileName}
          onTabChange={handleTabChange}
        />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8">

          {/* Mobile nav pills */}
          <nav className="md:hidden px-4 pt-3 pb-1 flex gap-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${activeTab === item.id
                  ? 'bg-foreground/15 text-foreground border border-foreground/20'
                  : 'bg-foreground/5 text-muted-foreground'
                  }`}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl mb-2 text-foreground">Welcome back, {profileName}</h1>
                <p className="text-muted-foreground mb-8">Track your applications and discover new opportunities</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 group transition-colors hover:border-border/80"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                          <stat.icon size={18} className="text-foreground/90" />
                        </div>
                      </div>
                      <p className={`text-4xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Applications */}
                <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6">
                  <h2 className="text-2xl mb-6 text-foreground">My Recent Applications</h2>

                  {applications.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <Rocket size={28} className="text-muted-foreground" />
                      </div>
                      <p className="text-foreground/70 font-medium mb-1">No applications yet</p>
                      <p className="text-muted-foreground text-sm mb-6">Browse events and submit your first application</p>
                      <Link to="/">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] text-[#0A0E1A] font-semibold text-sm"
                        >
                          Browse Events
                        </motion.button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-muted-foreground text-sm">Event Name</th>
                            <th className="text-left py-3 px-4 text-muted-foreground text-sm">Submitted Date</th>
                            <th className="text-left py-3 px-4 text-muted-foreground text-sm">Status</th>
                            <th className="text-left py-3 px-4 text-muted-foreground text-sm">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app, index) => (
                            <tr key={index} className="border-b border-border hover:bg-foreground/5 transition-colors text-foreground">
                              <td className="py-4 px-4">{app.eventName}</td>
                              <td className="py-4 px-4 text-muted-foreground">
                                {new Date(app.submittedDate).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => app.status === 'Accepted' ? navigate(`/startup/${app.applicationId}`) : null}
                                  className={`text-foreground/80 hover:text-foreground text-sm transition-colors ${app.status !== 'Accepted' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl mb-8 text-foreground">My Applications</h1>
                <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6">
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No applications submitted yet</p>
                      <Link to="/">
                        <Button variant="primary">Apply to Events</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app, index) => (
                        <div
                          key={index}
                          className="bg-muted border border-border rounded-xl p-6 hover:border-border/80 transition-all text-foreground"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl mb-1">{app.projectName}</h3>
                              <p className="text-sm text-muted-foreground">{app.eventName}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Sector</p>
                              <p>{app.sector}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Submitted</p>
                              <p>{new Date(app.submittedDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Application ID</p>
                              <p className="font-mono text-xs text-foreground/70">{app.applicationId}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                            <button
                              onClick={() => app.status === 'Accepted' ? navigate(`/startup/${app.applicationId}`) : null}
                              className={`text-sm font-medium transition-all ${app.status === 'Accepted' ? 'text-primary hover:text-accent' : 'text-muted-foreground opacity-50 cursor-not-allowed'}`}
                            >
                              {app.status === 'Accepted' ? 'Manage Startup →' : 'View Application'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'roles' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl mb-2">My Special Roles</h1>
                <p className="text-[#8892A4] mb-8">Events where you are invited as an expert or partner</p>

                <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-6">
                  {userRoles.length === 0 ? (
                    <div className="text-center py-12">
                      <Shield size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground mb-2">No special roles assigned yet</p>
                      <p className="text-xs text-foreground/30">Roles are assigned by event administrators via email invitation.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userRoles.map((role, index) => (
                        <div
                          key={index}
                          className="bg-muted border border-border rounded-xl p-6 hover:border-accent/40 transition-all flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            <Shield className="text-accent" size={24} />
                          </div>
                          <div className="flex-1 text-foreground">
                            <h3 className="text-lg font-medium mb-1">Event {role.eventId.includes('1') ? 'Quantum Hackathon' : 'Innovation Showcase'}</h3>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-accent/20 text-accent border border-accent/30">
                                {role.role}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Joined {new Date(role.invitedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-all"
                            title="View event details as observer"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl mb-8 text-foreground">Notifications</h1>
                <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6">
                  <div className="space-y-3">
                    {[
                      { title: 'Application Under Review', message: 'Your application for Quantum AI Hackathon is now being reviewed by the jury', time: '2 hours ago', type: 'info', color: '#00D9F5' },
                      { title: 'New Event Available', message: 'Neural Networks Workshop registration is now open. Deadline: March 2, 2026', time: '1 day ago', type: 'success', color: '#00F5A0' },
                      { title: 'Action Required', message: 'Complete your profile to improve your application chances by 40%', time: '3 days ago', type: 'warning', color: '#FFB800' },
                    ].map((notif, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.07 }}
                        className="bg-muted border border-border rounded-xl p-4 hover:border-border/80 transition-all flex items-start gap-4 text-foreground"
                      >
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: notif.color, boxShadow: `0 0 8px ${notif.color}60` }} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-sm font-medium">{notif.title}</h3>
                            <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl mb-2 text-foreground">Settings</h1>
                <p className="text-muted-foreground mb-8 text-sm md:text-base">
                  Tune your profile, study preferences, and notifications for a smoother Q-AI Hub experience.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile & study preferences */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 text-foreground">
                      <h2 className="text-lg mb-1 flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10"><Users size={12} className="text-primary" /></span>
                        Profile
                      </h2>
                      <p className="text-muted-foreground text-sm mb-5">Manage your personal information and public profile.</p>

                      {/* Avatar + Name */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                        <div className="relative group">
                          <div className="rounded-2xl p-[2px] bg-gradient-to-br from-[#00F5A0] to-[#00D9F5]">
                            <img
                              src={`https://ui-avatars.com/api/?name=${profileName}&background=0F1628&color=00F5A0&size=96&bold=true`}
                              alt={profileName}
                              className="w-20 h-20 rounded-[14px]"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                            <Check size={10} className="text-background" />
                          </div>
                        </div>
                        <div className="flex-1 w-full">
                          <p className="text-sm font-semibold text-foreground mb-0.5">{profileName || 'Student'}</p>
                          <p className="text-xs text-muted-foreground mb-3">Student · ENICarthage</p>
                          <div className="flex gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20">Active</span>
                            <span className="px-2.5 py-1 rounded-full text-[10px] bg-accent/10 text-accent border border-accent/20">Verified</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">Full name</label>
                          <input
                            type="text"
                            value={profileName}
                            onChange={(e) => {
                              setProfileName(e.target.value);
                              localStorage.setItem('userName', e.target.value || 'Student');
                            }}
                            className="w-full rounded-xl bg-input border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15 transition-all"
                            placeholder="Your name"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">Email address</label>
                          <input
                            type="email"
                            defaultValue="student@eni.tn"
                            className="w-full rounded-xl bg-input border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15 transition-all"
                            placeholder="your@email.com"
                          />
                        </div>

                        {/* Role + Institution */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1.5">Role</label>
                            <div className="w-full rounded-xl bg-input border border-border px-3.5 py-2.5 text-sm text-foreground/60">
                              Student
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1.5">Institution</label>
                            <div className="w-full rounded-xl bg-input border border-border px-3.5 py-2.5 text-sm text-foreground/60">
                              ENICarthage
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1.5">Bio</label>
                          <textarea
                            defaultValue=""
                            placeholder="Tell us a bit about yourself, your interests and goals..."
                            className="w-full rounded-xl bg-input border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15 min-h-[80px] resize-none placeholder:text-muted-foreground/50 transition-all"
                          />
                        </div>

                        <button type="button" className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/20 text-primary text-sm font-medium hover:from-primary/25 hover:to-accent/25 transition-all">
                          Save Profile
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 text-foreground">
                      <h2 className="text-lg mb-1">Study preferences</h2>
                      <p className="text-muted-foreground text-sm mb-4">
                        Indicate what you want to focus on so we can surface more relevant opportunities.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Primary interest</p>
                          <div className="flex flex-wrap gap-2">
                            {['Quantum Computing', 'Artificial Intelligence', 'Hybrid Quantum-AI'].map((area) => {
                              const isActive = primaryInterest === area;
                              return (
                                <button
                                  key={area}
                                  type="button"
                                  onClick={() => setPrimaryInterest(area)}
                                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${isActive
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'border-border text-foreground hover:border-foreground/40'
                                    }`}
                                >
                                  {area}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Availability</p>
                          <div className="flex flex-wrap gap-2">
                            {['Weekdays', 'Weekends', 'Evenings'].map((slot) => {
                              const isSelected = availability.includes(slot);
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() =>
                                    setAvailability((prev) =>
                                      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
                                    )
                                  }
                                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${isSelected
                                    ? 'border-foreground/60 bg-foreground/10 text-foreground'
                                    : 'border-border bg-foreground/5 text-foreground/70 hover:border-foreground/30'
                                    }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 text-foreground">
                      <h2 className="text-lg mb-1 flex items-center gap-2"><Lock size={18} className="text-primary" /> Change Password</h2>
                      <p className="text-muted-foreground text-sm mb-5">Update your password to keep your account secure.</p>
                      <PasswordChangeForm />
                    </div>
                  </div>

                  {/* Notifications & account actions */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 text-foreground">
                      <h2 className="text-lg mb-1">Notifications</h2>
                      <p className="text-muted-foreground text-sm mb-4">Choose what you want to stay informed about.</p>
                      {[
                        { key: 'appStatus' as const, label: 'Application status updates' },
                        { key: 'newEvents' as const, label: 'New events & programs' },
                        { key: 'juryFeedback' as const, label: 'Jury feedback' },
                      ].map((item) => {
                        const isOn = notificationPrefs[item.key];
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() =>
                              setNotificationPrefs((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                            }
                            className="w-full flex items-center justify-between py-3 border-b border-border/50 last:border-0 text-left"
                          >
                            <span className="text-sm">{item.label}</span>
                            <div
                              className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors border ${isOn
                                ? 'bg-primary/40 border-primary/60'
                                : 'bg-foreground/5 border-border'
                                }`}
                            >
                              <span
                                className={`w-4 h-4 bg-foreground rounded-full shadow-sm transition-transform ${isOn ? 'translate-x-4' : ''
                                  }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 text-foreground">
                      <h2 className="text-lg mb-1">Session</h2>
                      <p className="text-muted-foreground text-sm mb-4">
                        You are currently signed in on this device.
                      </p>
                      <Button
                        variant="ghost"
                        className="w-full justify-center text-sm"
                        onClick={handleLogout}
                      >
                        Log out
                      </Button>
                    </div>

                    <div className="bg-slate-400/20 dark:bg-card/95 backdrop-blur-xl border border-destructive/40 rounded-2xl p-6">
                      <h2 className="text-lg mb-1 text-destructive">Delete account</h2>
                      <p className="text-destructive/80 text-xs md:text-sm mb-4">
                        This will remove your profile and stored applications from this device. This action cannot be
                        undone.
                      </p>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="w-full px-5 py-2.5 rounded-xl border border-destructive/60 text-destructive-foreground text-sm bg-destructive/80 hover:bg-destructive transition-all"
                      >
                        Delete my account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div >
    </div >
  );
}
