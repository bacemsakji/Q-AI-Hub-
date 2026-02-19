import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BarChart3, Calendar, FileText, Scale, Settings, LogOut, TrendingUp, Users, CheckCircle, XCircle, Plus } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gradingApp, setGradingApp] = useState<any>(null);
  const [scores, setScores] = useState({ technical: 0, business: 0, softSkills: 0 });
  const [notes, setNotes] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const stats = [
    { label: 'Total Applications', value: 42, icon: FileText, trend: '+12%', color: 'from-[#00F5A0] to-[#00D9F5]' },
    { label: 'Pending Review', value: 18, icon: Users, trend: '+5', color: 'from-[#FFB800] to-[#FF8800]' },
    { label: 'Accepted', value: 15, icon: CheckCircle, trend: '36%', color: 'from-[#00F5A0] to-[#00D9F5]' },
    { label: 'Rejected', value: 9, icon: XCircle, trend: '21%', color: 'from-[#FF4757] to-[#FF3344]' },
  ];

  const mockApplications = [
    { id: 1, startup: 'HealthAI', event: 'Quantum AI Hackathon', submitted: '2026-02-15', status: 'Pending' },
    { id: 2, startup: 'FinTech Pro', event: 'Deep Tech Bootcamp', submitted: '2026-02-14', status: 'Under Review' },
    { id: 3, startup: 'EduLearn AI', event: 'Quantum AI Hackathon', submitted: '2026-02-13', status: 'Pending' },
    { id: 4, startup: 'GreenEnergy Plus', event: 'VC Pitch Masterclass', submitted: '2026-02-12', status: 'Accepted' },
    { id: 5, startup: 'CyberShield', event: 'Neural Networks Workshop', submitted: '2026-02-11', status: 'Pending' },
  ];

  const [events, setEvents] = useState([
    { id: 1, name: 'Quantum AI Hackathon', dates: 'Mar 15-17, 2026', status: true, applications: 24 },
    { id: 2, name: 'Deep Tech Bootcamp', dates: 'Feb 10-14, 2026', status: false, applications: 12 },
    { id: 3, name: 'Neural Networks Workshop', dates: 'Mar 8, 2026', status: true, applications: 18 },
  ]);

  const toggleEventStatus = (id: number) => {
    setEvents(prev =>
      prev.map(ev => (ev.id === id ? { ...ev, status: !ev.status } : ev))
    );
  };

  const statusColors: Record<string, string> = {
    Pending: 'bg-[#FFB800]/20 text-[#FFB800]',
    'Under Review': 'bg-[#00D9F5]/20 text-[#00D9F5]',
    Accepted: 'bg-white/15 text-white/90',
    Rejected: 'bg-[#FF4757]/20 text-[#FF4757]',
  };

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'applications', icon: FileText, label: 'Applications' },
    { id: 'grading', icon: Scale, label: 'Jury Grading' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleGenerateAiFeedback = async () => {
    setIsGeneratingFeedback(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const totalScore = scores.technical + scores.business + scores.softSkills;
    setAiFeedback(
      `This ${gradingApp?.startup} demonstrates ${totalScore >= 24 ? 'strong' : 'moderate'} potential across key evaluation criteria. ` +
      `The technical implementation shows ${scores.technical >= 8 ? 'excellent' : 'good'} understanding of deep tech fundamentals. ` +
      `Business model viability is ${scores.business >= 8 ? 'well-articulated' : 'developing'} with clear market positioning. ` +
      `Team dynamics and presentation skills are ${scores.softSkills >= 8 ? 'highly professional' : 'satisfactory'}. ` +
      `${totalScore >= 24 ? 'Recommended for advancement to the next stage.' : 'Consider for additional mentorship before final decision.'}`
    );
    setIsGeneratingFeedback(false);
  };

  const totalScore = scores.technical + scores.business + scores.softSkills;

  return (
    <div className="min-h-screen relative flex">
      <ParticleBackground />

      {/* Sidebar */}
      <div className="w-64 bg-[#0F1628] border-r border-white/8 relative z-10 flex flex-col">
        <div className="p-6">
          <Link to="/">
            <Logo size="sm" />
          </Link>
        </div>

        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${activeTab === item.id
                ? 'bg-white/10 text-white border-l-4 border-white/30'
                : 'text-[#8892A4] hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/8">
          <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=7B2FFF&color=fff"
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">Admin User</p>
              <p className="text-xs text-[#8892A4]">Jury Member</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-y-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl mb-8">Admin Dashboard</h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6 hover:border-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <stat.icon size={24} className="text-white/80" />
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <TrendingUp size={14} />
                        {stat.trend}
                      </div>
                    </div>
                    <p className={`text-4xl mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                    <p className="text-[#8892A4] text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl">Recent Applications</h2>
                  <Button variant="ghost" onClick={() => setActiveTab('grading')}>
                    Open Grading Interface
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Startup Name</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Event</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Submitted</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Status</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockApplications.map((app) => (
                        <tr key={app.id} className="border-b border-white/8 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">{app.startup}</td>
                          <td className="py-4 px-4 text-[#8892A4]">{app.event}</td>
                          <td className="py-4 px-4 text-[#8892A4]">{app.submitted}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="ghost"
                              className="text-sm py-2"
                              onClick={() => {
                                setGradingApp(app);
                                setActiveTab('grading');
                              }}
                            >
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl">Event Management</h1>
                <Button variant="primary" onClick={() => navigate('/admin/events/create')}>
                  Create Event
                </Button>
              </div>

              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Name</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Dates</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Applications</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Status</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id} className="border-b border-white/8 hover:bg-white/5">
                          <td className="py-4 px-4">{event.name}</td>
                          <td className="py-4 px-4 text-[#8892A4]">{event.dates}</td>
                          <td className="py-4 px-4">{event.applications}</td>
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => toggleEventStatus(event.id)}
                              className={`relative inline-flex items-center w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${event.status ? 'bg-[#00F5A0]/30 border border-[#00F5A0]/50' : 'bg-[#1A2035] border border-white/10'
                                }`}
                              title={event.status ? 'Active – click to deactivate' : 'Inactive – click to activate'}
                            >
                              <span
                                className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${event.status ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="ghost"
                              className="text-sm py-2"
                              onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl">All Applications</h1>
                <div className="flex gap-2">
                  {['All', 'Pending', 'Under Review', 'Accepted', 'Rejected'].map(f => (
                    <button key={f}
                      className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-[#8892A4] hover:border-white/20 hover:text-white transition-all">
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Startup</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Event</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Submitted</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Status</th>
                        <th className="text-left py-3 px-4 text-[#8892A4] text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockApplications.map((app) => (
                        <tr key={app.id} className="border-b border-white/8 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-medium">{app.startup}</td>
                          <td className="py-4 px-4 text-[#8892A4]">{app.event}</td>
                          <td className="py-4 px-4 text-[#8892A4]">{app.submitted}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="ghost"
                              className="text-sm py-2"
                              onClick={() => { setGradingApp(app); setActiveTab('grading'); }}
                            >
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'grading' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl mb-8">Jury Grading Interface</h1>

              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-3xl p-8">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-white/8">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl">{gradingApp?.startup || 'HealthAI'}</h2>
                    <span className="text-sm text-[#8892A4]">
                      Submitted: {gradingApp?.submitted || '2026-02-15'}
                    </span>
                  </div>
                  <p className="text-[#8892A4]">Event: {gradingApp?.event || 'Quantum AI Hackathon 2026'}</p>
                </div>

                {/* Scoring */}
                <div className="space-y-6 mb-8">
                  {[
                    { label: 'Technical Score', key: 'technical', color: '#0061FF' },
                    { label: 'Business Score', key: 'business', color: '#7B2FFF' },
                    { label: 'Soft Skills', key: 'softSkills', color: '#00F5A0' },
                  ].map((metric) => (
                    <div key={metric.key}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm" style={{ color: metric.color }}>
                          {metric.label}
                        </label>
                        <span className="text-2xl" style={{ color: metric.color }}>
                          {scores[metric.key as keyof typeof scores]}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={scores[metric.key as keyof typeof scores]}
                        onChange={(e) => setScores({ ...scores, [metric.key]: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${metric.color} 0%, ${metric.color} ${scores[metric.key as keyof typeof scores] * 10}%, #1A2035 ${scores[metric.key as keyof typeof scores] * 10}%, #1A2035 100%)`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Total Score */}
                <div className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/20">
                  <p className="text-sm text-[#8892A4] mb-2">Total Score</p>
                  <p className="text-5xl text-white font-bold">
                    {totalScore}/30
                  </p>
                </div>

                <div className="h-px bg-white/8 mb-8" />

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm text-[#8892A4] mb-2">Raw Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter quick keywords or observations..."
                    className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/20 transition-colors min-h-[120px] resize-none"
                  />
                </div>

                {/* AI Feedback Generation */}
                <Button
                  variant="primary"
                  onClick={handleGenerateAiFeedback}
                  disabled={isGeneratingFeedback}
                  className="mb-6"
                >
                  🤖 {isGeneratingFeedback ? 'Generating...' : 'Generate AI Feedback'}
                </Button>

                {isGeneratingFeedback && (
                  <div className="mb-6 space-y-2">
                    <div className="h-3 bg-[#1A2035] rounded animate-pulse" />
                    <div className="h-3 bg-[#1A2035] rounded animate-pulse w-4/5" />
                    <div className="h-3 bg-[#1A2035] rounded animate-pulse w-5/6" />
                  </div>
                )}

                {aiFeedback && !isGeneratingFeedback && (
                  <div className="mb-8 p-6 bg-white/10 border border-white/20 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-white/90">✨ AI-Generated Feedback</span>
                    </div>
                    <p className="text-white leading-relaxed">{aiFeedback}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <Button variant="primary" fullWidth>
                    Submit Evaluation
                  </Button>
                  <Button variant="ghost" fullWidth>
                    Save Draft
                  </Button>
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
              <div className="space-y-5">
                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <h2 className="text-lg mb-1">Platform</h2>
                  <p className="text-[#8892A4] text-sm mb-5">General platform configuration</p>
                  {[
                    { label: 'Allow public registrations', on: true },
                    { label: 'Require email verification', on: true },
                    { label: 'Show applications to other jury members', on: false },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <span className="text-sm">{s.label}</span>
                      <div className={`w-9 h-5 rounded-full flex items-center px-0.5 border transition-all ${s.on ? 'bg-[#00F5A0]/20 border-[#00F5A0]/40' : 'bg-[#1A2035] border-white/10'}`}>
                        <span className={`w-4 h-4 bg-white rounded-full transition-transform ${s.on ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <h2 className="text-lg mb-1">Admin Profile</h2>
                  <p className="text-[#8892A4] text-sm mb-5">Manage your administrator account</p>
                  <div className="flex items-center gap-4">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=7B2FFF&color=fff&size=80"
                      alt="Admin" className="w-16 h-16 rounded-2xl" />
                    <div>
                      <p className="font-medium">Admin User</p>
                      <p className="text-sm text-[#8892A4]">Jury Member · Q-AI Hub</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <h2 className="text-lg mb-1 text-[#FF4757]">Danger Zone</h2>
                  <p className="text-[#8892A4] text-sm mb-4">Destructive platform actions</p>
                  <button className="px-5 py-2.5 rounded-xl border border-[#FF4757]/30 text-[#FF4757] text-sm hover:bg-[#FF4757]/10 transition-all">
                    Reset All Scores
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
