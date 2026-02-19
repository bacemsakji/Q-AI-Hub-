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
  const [platformSettings, setPlatformSettings] = useState({
    allowPublicRegistrations: true,
    requireEmailVerification: true,
    allowLateSubmissions: false,
    showAnonymisedToJury: false,
  });
  const [applicationsFilter, setApplicationsFilter] = useState<'All' | 'Pending' | 'Under Review' | 'Accepted' | 'Rejected'>('All');
  const [gradingSettings, setGradingSettings] = useState({
    requireTotalScore: true,
    allowDrafts: true,
    hideNames: false,
    allowSeeOthersScores: false,
    enableAiAssistant: true,
  });

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
    { id: 'analytics', icon: TrendingUp, label: 'Statistics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const getApplicationsForFilter = (filter: typeof applicationsFilter) => {
    if (filter === 'All') return mockApplications;
    if (filter === 'Pending') {
      return mockApplications.filter((app) => app.status === 'Pending');
    }
    if (filter === 'Under Review') {
      return mockApplications.filter((app) => app.status === 'Under Review');
    }
    return mockApplications.filter((app) => app.status === filter);
  };

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
                  <motion.button
                    key={stat.label}
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setActiveTab('applications');
                      if (stat.label === 'Total Applications') {
                        setApplicationsFilter('All');
                      } else if (stat.label === 'Pending Review') {
                        setApplicationsFilter('Pending');
                      } else {
                        setApplicationsFilter(stat.label as 'Accepted' | 'Rejected');
                      }
                    }}
                    className="text-left bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6 hover:border-white/20 hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <stat.icon size={24} className="text-white/80" />
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <TrendingUp size={14} />
                        {stat.trend}
                      </div>
                    </div>
                    <p className={`text-4xl mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                    <p className="text-[#8892A4] text-sm">{stat.label}</p>
                    <p className="mt-1 text-[11px] text-[#556070]">
                      Click to view {stat.label === 'Total Applications' ? 'all applications' : 'this segment'}.
                    </p>
                  </motion.button>
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
                  {['All', 'Pending', 'Under Review', 'Accepted', 'Rejected'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setApplicationsFilter(f as typeof applicationsFilter)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        applicationsFilter === f
                          ? 'border-white/30 text-white bg-white/10'
                          : 'border-white/10 text-[#8892A4] hover:border-white/20 hover:text-white'
                      }`}
                    >
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
                      {getApplicationsForFilter(applicationsFilter).map((app) => (
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
              className="max-w-5xl mx-auto"
            >
              <h1 className="text-4xl mb-8">Jury Grading</h1>

              <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-3xl p-8">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-white/8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl">{gradingApp?.startup || 'HealthAI'}</h2>
                    <p className="text-sm text-[#8892A4]">
                      Event: {gradingApp?.event || 'Quantum AI Hackathon 2026'}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end text-xs text-[#8892A4] gap-1">
                    <span>
                      Submitted: {gradingApp?.submitted || '2026-02-15'}
                    </span>
                    <span>Reviewer: Admin User</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: scoring + notes */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-5">
                      {[
                        { label: 'Technical score', key: 'technical', color: '#0061FF' },
                        { label: 'Business score', key: 'business', color: '#7B2FFF' },
                        { label: 'Soft skills', key: 'softSkills', color: '#00F5A0' },
                      ].map((metric) => (
                        <div key={metric.key}>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium" style={{ color: metric.color }}>
                              {metric.label}
                            </label>
                            <span className="text-2xl font-semibold" style={{ color: metric.color }}>
                              {scores[metric.key as keyof typeof scores]}/10
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={scores[metric.key as keyof typeof scores]}
                            onChange={(e) =>
                              setScores({ ...scores, [metric.key]: Number(e.target.value) })
                            }
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, ${metric.color} 0%, ${metric.color} ${
                                scores[metric.key as keyof typeof scores] * 10
                              }%, #1A2035 ${
                                scores[metric.key as keyof typeof scores] * 10
                              }%, #1A2035 100%)`,
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm text-[#8892A4] mb-2">Notes to keep</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Capture quick observations, risks, or follow-up questions for this startup."
                        className="w-full px-4 py-3 bg-[#1A2035] rounded-xl border border-white/8 text-white outline-none focus:border-white/20 transition-colors min-h-[140px] resize-none"
                      />
                    </div>
                  </div>

                  {/* Right: total score + AI feedback + actions */}
                  <div className="space-y-6">
                    <div className="p-5 bg-white/10 rounded-2xl border border-white/20">
                      <p className="text-xs text-[#8892A4] mb-1">Total score</p>
                      <p className="text-4xl text-white font-bold mb-1">
                        {totalScore}/30
                      </p>
                      <p className="text-xs text-[#8892A4]">
                        {totalScore >= 24
                          ? 'Strong candidate for next round.'
                          : totalScore >= 18
                          ? 'Promising, consider for mentorship.'
                          : 'Early stage, needs significant work.'}
                      </p>
                    </div>

                    <div>
                      <Button
                        variant="primary"
                        onClick={handleGenerateAiFeedback}
                        disabled={isGeneratingFeedback}
                        className="w-full mb-3"
                      >
                        {isGeneratingFeedback ? 'Generating feedback...' : 'Generate AI feedback'}
                      </Button>

                      {isGeneratingFeedback && (
                        <div className="space-y-2">
                          <div className="h-3 bg-[#1A2035] rounded animate-pulse" />
                          <div className="h-3 bg-[#1A2035] rounded animate-pulse w-4/5" />
                          <div className="h-3 bg-[#1A2035] rounded animate-pulse w-5/6" />
                        </div>
                      )}

                      {aiFeedback && !isGeneratingFeedback && (
                        <div className="mt-3 p-4 bg-white/10 border border-white/20 rounded-2xl max-h-64 overflow-y-auto">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-medium text-white/90">
                              AI-generated feedback
                            </span>
                            <span className="text-[11px] text-[#8892A4]">Visible to jury only</span>
                          </div>
                          <p className="text-xs text-white/90 leading-relaxed whitespace-pre-line">
                            {aiFeedback}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button variant="primary" fullWidth>
                        Submit evaluation
                      </Button>
                      <Button variant="ghost" fullWidth>
                        Save draft
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl mb-8">Statistics</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <p className="text-xs text-[#8892A4] mb-1">Total applications</p>
                  <p className="text-3xl font-semibold text-white mb-1">42</p>
                  <p className="text-[11px] text-[#8892A4]">Across all active events</p>
                </div>
                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <p className="text-xs text-[#8892A4] mb-1">Acceptance rate</p>
                  <p className="text-3xl font-semibold text-white mb-1">36%</p>
                  <p className="text-[11px] text-[#8892A4]">Accepted vs reviewed submissions</p>
                </div>
                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <p className="text-xs text-[#8892A4] mb-1">Estimated budget spent</p>
                  <p className="text-3xl font-semibold text-white mb-1">€24,500</p>
                  <p className="text-[11px] text-[#8892A4]">Events, mentoring and operations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <h2 className="text-lg mb-4">Applications by status</h2>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Pending', value: 18 },
                      { label: 'Under Review', value: 9 },
                      { label: 'Accepted', value: 15 },
                      { label: 'Rejected', value: 9 },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3">
                        <span className="w-24 text-[#8892A4] text-xs">{row.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-[#111729] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]"
                            style={{ width: `${(row.value / 42) * 100}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs text-white/80">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <h2 className="text-lg mb-2">Events overview</h2>
                  <p className="text-xs text-[#8892A4] mb-4">
                    Quick view of pipeline strength across your main events.
                  </p>
                  <div className="space-y-3 text-sm">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="px-3 py-2 rounded-xl bg-[#111729] border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-white truncate max-w-[10rem]">{event.name}</p>
                          <span className="text-xs text-[#8892A4]">{event.dates}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-[#8892A4]">Applications</span>
                          <div className="flex-1 h-1.5 rounded-full bg-[#0F1628] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#00D9F5] to-[#0061FF]"
                              style={{ width: `${Math.min((event.applications / 30) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-xs text-white/80">
                            {event.applications}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                  <h2 className="text-lg mb-2">AI insights</h2>
                  <p className="text-xs text-[#8892A4] mb-3">
                    Ask a quick question about your applications or events to assist decision making.
                  </p>
                  <textarea
                    placeholder="For example: Which events should I expand next cohort based on application volume?"
                    className="w-full px-3 py-2 bg-[#111729] rounded-xl border border-white/10 text-xs text-white/90 outline-none focus:border-white/30 transition-colors min-h-[90px] resize-none mb-3"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      window.alert('AI insights assistant – demo only, no real analysis yet.')
                    }
                    className="w-full px-4 py-2 rounded-full text-xs bg-white text-[#0A0E1A] font-medium hover:bg-[#E5ECFF] transition-colors"
                  >
                    Ask AI for a suggestion
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl mb-2">Settings</h1>
              <p className="text-[#8892A4] mb-8 text-sm md:text-base">
                Configure how the Q-AI Hub platform operates for applicants, events, and jury members.
              </p>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Platform & workflows */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                    <h2 className="text-lg mb-1">Platform</h2>
                    <p className="text-[#8892A4] text-sm mb-5">Core rules for registrations and visibility.</p>
                    {[
                      { key: 'allowPublicRegistrations' as const, label: 'Allow public registrations' },
                      { key: 'requireEmailVerification' as const, label: 'Require email verification' },
                      { key: 'allowLateSubmissions' as const, label: 'Allow late submissions with penalty' },
                      {
                        key: 'showAnonymisedToJury' as const,
                        label: 'Show anonymised applications to all jury members',
                      },
                    ].map((item) => {
                      const isOn = platformSettings[item.key];
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() =>
                            setPlatformSettings((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                          }
                          className="w-full flex items-center justify-between py-3 border-b border-white/5 last:border-0 text-left"
                        >
                          <span className="text-sm">{item.label}</span>
                          <div
                            className={`w-9 h-5 rounded-full flex items-center px-0.5 border transition-all ${
                              isOn
                                ? 'bg-[#00F5A0]/20 border-[#00F5A0]/40'
                                : 'bg-[#1A2035] border-white/10'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                isOn ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                    <h2 className="text-lg mb-1">Students management</h2>
                    <p className="text-[#8892A4] text-sm mb-4">
                      Moderate student accounts and communication from a single place.
                    </p>
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#8892A4] mb-1">
                          <span>Status</span>
                          <span>Count</span>
                        </div>
                        <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-[#111729]">
                          <div className="flex items-center justify-between px-3 py-2.5">
                            <span>Active students</span>
                            <span className="text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full min-w-[3rem] text-center">
                              124
                            </span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2.5">
                            <span>Flagged for review</span>
                            <span className="text-xs text-[#FFB800] bg-[#FFB800]/15 px-2 py-0.5 rounded-full min-w-[3rem] text-center">
                              5
                            </span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2.5">
                            <span>Temporarily banned</span>
                            <span className="text-xs text-[#FF4757] bg-[#FF4757]/15 px-2 py-0.5 rounded-full min-w-[3rem] text-center">
                              2
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-[#8892A4] uppercase tracking-[0.18em] mb-2">Quick actions</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => window.alert('Open student list – demo action.')}
                            className="px-3 py-2 rounded-xl border border-white/15 hover:border-white/30 text-xs text-left bg-[#111729]"
                          >
                            View all students
                          </button>
                          <button
                            type="button"
                            onClick={() => window.alert('Send notification to selected students – demo action.')}
                            className="px-3 py-2 rounded-xl border border-white/15 hover:border-white/30 text-xs text-left bg-[#111729]"
                          >
                            Send notification
                          </button>
                          <button
                            type="button"
                            onClick={() => window.alert('Manage bans – demo action.')}
                            className="px-3 py-2 rounded-xl border border-[#FF4757]/40 text-[#FFCDD2] bg-[#FF4757]/10 hover:bg-[#FF4757]/20 text-xs text-left"
                          >
                            Manage bans
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                    <h2 className="text-lg mb-1">Upcoming events</h2>
                    <p className="text-[#8892A4] text-sm mb-4">
                      Quick overview of what&apos;s coming next, with fast actions.
                    </p>
                    <div className="space-y-3">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#111729] border border-white/10"
                        >
                          <div>
                            <p className="text-sm">{event.name}</p>
                            <p className="text-xs text-[#8892A4]">{event.dates}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                              className="px-3 py-1.5 rounded-full text-xs border border-white/30 hover:bg-white/10"
                            >
                              Modify
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                window.confirm(`Cancel ${event.name}?`) &&
                                window.alert('Event cancelled – demo action.')
                              }
                              className="px-3 py-1.5 rounded-full text-xs border border-[#FF4757]/60 text-[#FFCDD2] hover:bg-[#FF4757]/20"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Admin profile & data / destructive actions */}
                <div className="xl:col-span-1 space-y-6">
                  <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                    <h2 className="text-lg mb-1">Admin profile</h2>
                    <p className="text-[#8892A4] text-sm mb-4">Context about who is operating this workspace.</p>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src="https://ui-avatars.com/api/?name=Admin&background=7B2FFF&color=fff&size=80"
                        alt="Admin"
                        className="w-16 h-16 rounded-2xl"
                      />
                      <div>
                        <p className="font-medium">Admin User</p>
                        <p className="text-sm text-[#8892A4]">Jury Member · Q-AI Hub</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-[#8892A4]">
                      <p>Last sign-in: 2 hours ago</p>
                      <p>Role: Super admin</p>
                    </div>
                  </div>

                  <div className="bg-[rgba(15,22,40,0.95)] backdrop-blur-xl border border-white/8 rounded-2xl p-6">
                    <h2 className="text-lg mb-1">Data & exports</h2>
                    <p className="text-[#8892A4] text-sm mb-4">Quick access to structured data exports.</p>
                    <div className="space-y-2">
                      {['Download applications CSV', 'Download jury scores CSV', 'Export event list'].map(
                        (label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => window.alert(`${label} – demo action (no real export yet).`)}
                            className="w-full text-left text-xs px-3 py-2 rounded-xl bg-[#111729] border border-white/10 hover:border-white/25 transition-all"
                          >
                            {label}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="bg-[rgba(20,12,18,0.98)] backdrop-blur-xl border border-[#FF4757]/40 rounded-2xl p-6">
                    <h2 className="text-lg mb-1 text-[#FF4757]">Destructive actions</h2>
                    <p className="text-[#FFCDD2] text-xs mb-4">
                      High-impact operations. Make sure you have backups before proceeding.
                    </p>
                    <div className="space-y-2">
                      <button
                        type="button"
                          onClick={() => {
                            if (window.confirm('Reset all jury scores? This cannot be undone in this demo.')) {
                              window.alert('Scores reset – demo only, no real data changed.');
                            }
                          }}
                        className="w-full px-4 py-2 rounded-xl text-xs bg-[#FF4757]/20 text-[#FFEBEE] border border-[#FF4757]/70 hover:bg-[#FF4757]/30 transition-all"
                      >
                        Reset all jury scores
                      </button>
                      <button
                        type="button"
                          onClick={() => window.alert('Archive finished events – demo action.')}
                        className="w-full px-4 py-2 rounded-xl text-xs bg-transparent text-[#FFCDD2] border border-[#FFCDD2]/40 hover:bg-[#FF4757]/15 transition-all"
                      >
                        Archive finished events
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
