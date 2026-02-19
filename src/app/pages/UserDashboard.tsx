import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, FileText, Bell, Settings, LogOut } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

export function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState<any[]>([]);
  const userName = localStorage.getItem('userName') || 'Student';

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load applications from localStorage
    const savedApps = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('application-')) {
        const app = JSON.parse(localStorage.getItem(key) || '{}');
        savedApps.push(app);
      }
    }
    setApplications(savedApps);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const stats = [
    { label: 'Active Applications', value: applications.filter(a => a.status !== 'Rejected').length, color: 'from-[#00F5A0] to-[#00D9F5]' },
    { label: 'Events Available', value: 6, color: 'from-[#00D9F5] to-[#0061FF]' },
    { label: 'Notifications', value: 3, color: 'from-[#7B2FFF] to-[#0061FF]' },
  ];

  const statusColors: Record<string, string> = {
    Pending: 'bg-[#FFB800]/20 text-[#FFB800]',
    'Under Review': 'bg-[#00D9F5]/20 text-[#00D9F5]',
    Accepted: 'bg-white/15 text-white/90',
    Rejected: 'bg-[#FF4757]/20 text-[#FF4757]',
  };

  const navItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'applications', icon: FileText, label: 'My Applications' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <header className="w-full border-b border-white/8 bg-[rgba(10,14,26,0.95)] backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 rounded-full bg-white/5 px-2 py-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                  activeTab === item.id
                    ? 'bg-white/15 text-white border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                    : 'text-[#8892A4] hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-full bg-white/5 border border-white/10">
              <img
                src={`https://ui-avatars.com/api/?name=${userName}&background=00F5A0&color=0A0E1A`}
                alt={userName}
                className="w-9 h-9 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm leading-tight truncate max-w-[140px]">{userName}</span>
                <span className="text-xs text-[#8892A4]">Student</span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Mobile nav pills */}
        <nav className="md:hidden px-4 pt-3 pb-1 flex gap-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/5 text-[#8892A4]'
              }`}
            >
              <item.icon size={14} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto">
          <div className="p-6 md:p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl mb-2">Welcome back, {userName} 👋</h1>
              <p className="text-[#8892A4] mb-8">Track your applications and discover new opportunities</p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6 hover:border-white/20 transition-all"
                  >
                    <p className="text-[#8892A4] text-sm mb-2">{stat.label}</p>
                    <p className="text-4xl text-white font-semibold">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                <h2 className="text-2xl mb-6">My Recent Applications</h2>
                
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto mb-4 text-[#8892A4]" />
                    <p className="text-[#8892A4] mb-4">No applications yet</p>
                    <Link to="/">
                      <Button variant="primary">Browse Events</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/8">
                          <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Event Name</th>
                          <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Submitted Date</th>
                          <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Status</th>
                          <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app, index) => (
                          <tr key={index} className="border-b border-white/8 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4">{app.eventName}</td>
                            <td className="py-4 px-4 text-[#8892A4]">
                              {new Date(app.submittedDate).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button className="text-white/80 hover:text-white text-sm transition-colors">
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
              <h1 className="text-4xl mb-8">My Applications</h1>
              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto mb-4 text-[#8892A4]" />
                    <p className="text-[#8892A4] mb-4">No applications submitted yet</p>
                    <Link to="/">
                      <Button variant="primary">Apply to Events</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app, index) => (
                      <div
                        key={index}
                        className="bg-[#1A2035] border border-white/8 rounded-xl p-6 hover:border-white/20 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl mb-1">{app.projectName}</h3>
                            <p className="text-sm text-[#8892A4]">{app.eventName}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[#8892A4]">Sector</p>
                            <p>{app.sector}</p>
                          </div>
                          <div>
                            <p className="text-[#8892A4]">Submitted</p>
                            <p>{new Date(app.submittedDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[#8892A4]">Application ID</p>
                            <p className="font-mono text-xs text-white/70">{app.applicationId}</p>
                          </div>
                        </div>
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
              <h1 className="text-4xl mb-8">Notifications</h1>
              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                <div className="space-y-4">
                  {[
                    { title: 'Application Under Review', message: 'Your application for Quantum AI Hackathon is now being reviewed', time: '2 hours ago', type: 'info' },
                    { title: 'New Event Available', message: 'Neural Networks Workshop registration is now open', time: '1 day ago', type: 'success' },
                    { title: 'Reminder', message: 'Complete your profile to improve your application chances', time: '3 days ago', type: 'warning' },
                  ].map((notif, index) => (
                    <div
                      key={index}
                      className="bg-[#1A2035] border border-white/8 rounded-xl p-4 hover:border-white/20 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base">{notif.title}</h3>
                        <span className="text-xs text-[#8892A4]">{notif.time}</span>
                      </div>
                      <p className="text-sm text-[#8892A4]">{notif.message}</p>
                    </div>
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
              <h1 className="text-4xl mb-8">Settings</h1>
              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                <p className="text-[#8892A4]">Settings page coming soon...</p>
              </div>
            </motion.div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
