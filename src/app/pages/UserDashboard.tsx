import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, FileText, Bell, Settings, LogOut, Rocket, Calendar, BellRing, Lock, Eye, EyeOff, Check, Users, Shield, ArrowLeft, ChevronRight, Target, X, CheckCircle, Clock, Star, CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { adminEvents, startups, applicantsByEvent, evaluationCriteria, type AdminEvent, type Startup, type Applicant } from '../data/adminData';
import { AnimatePresence } from 'motion/react';

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
  const [selectedExpertEventId, setSelectedExpertEventId] = useState<string | null>(null);

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

    // DEMO: If no expert roles exist, add a dummy one for the Quantum Hackathon
    if (roles.length === 0) {
      const dummyRole = {
        eventId: '1',
        role: 'Expert Jury',
        invitedAt: new Date().toISOString()
      };
      roles.push(dummyRole);

      // Also ensure it's in localStorage for persistence in this session
      const userEmail = localStorage.getItem('userEmail') || 'student@eni.tn';
      localStorage.setItem('event-experts-1', JSON.stringify([{
        email: userEmail,
        role: 'Expert Jury',
        invitedAt: dummyRole.invitedAt
      }]));
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
                      className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 group transition-colors hover:border-border/80 shadow-sm"
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
                <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 shadow-sm">
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
                <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 shadow-sm">
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
                  ) : (                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRoles.map((role, index) => {
                        const event = adminEvents.find(e => e.id === role.eventId);
                        if (!event) return null;
                        
                        return (
                          <motion.div
                            key={index}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,229,255,0.08)' }}
                            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/30 flex flex-col"
                          >
                            <div className="relative h-40 overflow-hidden shrink-0">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                crossOrigin="anonymous" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                              <div className="absolute left-3 top-3">
                                <span className="rounded-lg bg-foreground/15 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur-md border border-white/5 uppercase tracking-wider">
                                  {event.category}
                                </span>
                              </div>
                              <div className="absolute right-3 top-3">
                                <span className="rounded-lg bg-accent/80 px-2.5 py-1 text-[10px] font-bold text-background backdrop-blur-md uppercase tracking-wider">
                                  {role.role}
                                </span>
                              </div>
                              <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-base font-bold leading-tight text-foreground drop-shadow-lg">{event.title}</h3>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-4 p-5 flex-1 justify-between">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <CalendarDays className="h-3.5 w-3.5 text-accent" />
                                  {event.date}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground line-clamp-1">
                                  <MapPin className="h-3.5 w-3.5 text-accent" />
                                  {event.location}
                                </div>
                                <div className="mt-2 text-[10px] font-bold text-accent/60 uppercase tracking-widest flex items-center gap-1.5">
                                  <Clock size={10} />
                                  Joined {new Date(role.invitedAt).toLocaleDateString()}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setSelectedExpertEventId(role.eventId)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card hover:bg-accent/5 hover:border-accent/30 text-xs font-bold transition-all group/btn"
                              >
                                Review Details
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                  )}
                </div>

                {/* Expert Event Portal Overlay */}
                <AnimatePresence>
                  {selectedExpertEventId && (
                    <ExpertEventPortal
                      eventId={selectedExpertEventId}
                      onClose={() => setSelectedExpertEventId(null)}
                    />
                  )}
                </AnimatePresence>
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
} function ExpertEventPortal({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const event = adminEvents.find(e => e.id === eventId);
  const eventStartups = startups.filter(s => {
    const applicants = applicantsByEvent[eventId] || [];
    // Map by userId/founderId since the applicant 'startup' field contains user descriptions
    return applicants.some(a => a.userId === s.founderId && a.status === 'Accepted');
  });

  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-6xl h-full max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-foreground/5 text-muted-foreground transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                <Shield className="text-accent" size={24} />
                {event.title} <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest bg-accent/10 px-2 py-1 rounded-md ml-2 text-accent border border-accent/20">Expert View</span>
              </h2>
              <p className="text-sm text-muted-foreground">{event.date} · {event.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Event Info & Startups List */}
            <div className="lg:col-span-1 space-y-6">
              <section className="bg-muted/20 border border-border/50 rounded-2xl p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText size={16} /> About Event
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">{event.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-background/50 border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase">Category</p>
                    <p className="text-xs font-semibold text-primary">{event.category}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-background/50 border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                    <p className="text-xs font-semibold text-emerald-500">{event.status}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Users size={16} /> Participating Startups ({eventStartups.length})
                </h3>
                <div className="space-y-3">
                  {eventStartups.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStartup(s)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedStartup?.id === s.id
                        ? 'bg-accent/10 border-accent shadow-sm'
                        : 'bg-muted/10 border-border hover:border-border/80'
                        }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-accent font-bold">
                        {s.logo}
                      </div>
                      <div className="flex-1 min-w-0 text-foreground">
                        <p className="font-bold truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.industry}</p>
                      </div>
                      <ChevronRight size={16} className={selectedStartup?.id === s.id ? 'text-accent' : 'text-muted-foreground'} />
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Startup Details */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selectedStartup ? (
                  <motion.div
                    key={selectedStartup.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Startup Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center text-3xl font-bold text-accent shadow-lg shadow-accent/10">
                          {selectedStartup.logo}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-foreground">{selectedStartup.name}</h3>
                          <p className="text-muted-foreground">{selectedStartup.industry} · {selectedStartup.stage}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                              {selectedStartup.status}
                            </span>
                            <span className="text-xs text-muted-foreground">by {selectedStartup.founderName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-foreground/70 leading-relaxed italic border-l-4 border-accent/30 pl-6 py-2">
                      "{selectedStartup.description}"
                    </p>

                    {/* Progress & Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-muted/10 border border-border rounded-2xl p-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Development Progress</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-3 rounded-full bg-foreground/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedStartup.progress}%` }}
                              className="h-full bg-gradient-to-r from-accent to-primary"
                            />
                          </div>
                          <span className="text-xl font-bold text-foreground">{selectedStartup.progress}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {selectedStartup.metrics.map(m => (
                          <div key={m.label} className="p-4 rounded-2xl bg-muted/10 border border-border">
                            <p className="text-[10px] text-muted-foreground uppercase">{m.label}</p>
                            <p className="text-lg font-bold text-foreground">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Section */}
                    <section>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                        <Users size={16} /> Team Members
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedStartup.members.map(m => (
                          <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs border border-accent/20">
                              {m.avatar}
                            </div>
                            <div className="text-foreground">
                              <p className="text-sm font-bold">{m.name}</p>
                              <p className="text-[10px] text-muted-foreground">{m.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Milestones */}
                    <section>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                        <CheckCircle size={16} /> Key Milestones
                      </h4>
                      <div className="space-y-3">
                        {selectedStartup.milestones.map(m => (
                          <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/5 border border-border">
                            <div className={`mt-0.5 ${m.status === 'completed' ? 'text-emerald-500' : m.status === 'in-progress' ? 'text-accent' : 'text-muted-foreground'}`}>
                              {m.status === 'completed' ? <CheckCircle size={16} /> : m.status === 'in-progress' ? <Clock size={16} /> : <Target size={16} />}
                            </div>
                            <div className="flex-1 min-w-0 text-foreground">
                              <p className={`text-sm font-bold ${m.status === 'completed' ? 'text-foreground/60' : 'text-foreground'}`}>{m.title}</p>
                              <p className="text-xs text-muted-foreground">{m.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Rating/Evaluation Preview */}
                    <section className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-foreground">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                          <Star size={16} className="fill-accent" /> Expert Evaluation Preview
                        </h4>
                        <div className="text-2xl font-black text-accent">
                          8.5<span className="text-xs font-normal text-accent/60 ml-1">/10</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {evaluationCriteria.slice(0, 4).map(c => (
                          <div key={c.key} className="space-y-1">
                            <p className="text-[9px] text-muted-foreground uppercase truncate">{c.label}</p>
                            <div className="h-1 rounded-full bg-foreground/5 flex">
                              <div className="h-full rounded-full bg-accent" style={{ width: '85%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-muted/5 rounded-3xl border border-dashed border-border">
                    <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
                      <Target size={40} className="text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Select a Startup</h3>
                    <p className="text-muted-foreground max-w-xs">Click on a startup from the list to view its detailed profile, metrics, and milestones.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
