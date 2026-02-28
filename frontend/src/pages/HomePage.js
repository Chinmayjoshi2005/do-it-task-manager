import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, ClipboardList, Flame, BarChart3, Moon } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navbar */}
      <nav style={{
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
      }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, var(--accent-1), var(--accent-5))',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 16,
          }}>T</div>
          <span className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>DO IT</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav >

      {/* Hero */}
      < div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 100, fontSize: 13, color: 'var(--accent-1)', marginBottom: 28,
        }}>
          <Target size={14} /> Your personal productivity command center
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 6vw, 64px)',
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-1.5px',
          maxWidth: 700,
          marginBottom: 20,
        }}>
          Organize your tasks,{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            build momentum
          </span>
        </h1>

        <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7, marginBottom: 36 }}>
          DO IT helps you stay on top of your daily tasks with a beautiful dashboard,
          streak tracking, and powerful organization tools.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            Start for free →
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign in
          </Link>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20, marginTop: 72, maxWidth: 900, width: '100%',
        }}>
          {[
            { icon: <ClipboardList size={32} color="var(--accent-1)" />, title: 'Smart Task Management', desc: 'Create, organize and prioritize tasks easily' },
            { icon: <Flame size={32} color="#f97316" />, title: 'Streak Tracking', desc: 'GitHub-style contribution graph to visualize your productivity' },
            { icon: <BarChart3 size={32} color="var(--accent-5)" />, title: 'Progress Analytics', desc: 'Completion rates, streaks, and daily insights at a glance' },
            { icon: <Moon size={32} color="#64748b" />, title: 'Dark / Light Mode', desc: 'Adapts to your system theme or choose your preference' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card" style={{ textAlign: 'left', padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: 16 }}>{icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div >

      {/* Footer */}
      < footer style={{ padding: '20px 40px', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
        DO IT — Built with React & Django
      </footer >
    </div >
  );
};

export default HomePage;
