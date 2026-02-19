import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EventApplicationPage } from './pages/EventApplicationPage';
import { ProgramApplicationPage } from './pages/ProgramApplicationPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CreateEventPage } from './pages/CreateEventPage';
import { EditEventPage } from './pages/EditEventPage';
import { EventsPage } from './pages/EventsPage';
import { RequireAuth } from './components/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0A0E1A] text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route
            path="/events/:id/apply"
            element={
              <RequireAuth>
                <EventApplicationPage />
              </RequireAuth>
            }
          />
          <Route
            path="/events/:id/register"
            element={
              <RequireAuth>
                <EventApplicationPage />
              </RequireAuth>
            }
          />
          <Route
            path="/programs/:id/apply"
            element={
              <RequireAuth>
                <ProgramApplicationPage />
              </RequireAuth>
            }
          />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events/create" element={<CreateEventPage />} />
          <Route path="/admin/events/:id/edit" element={<EditEventPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0F1628',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
