import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Key, Mail, Shield, User, Headset, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'AGENT') navigate('/agent');
      else navigate('/dashboard');
    } catch (err) {
      // Handled by toast
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="app-container" style={{ maxWidth: '460px', marginTop: '2rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Portal Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Access your complaint management dashboard
          </p>
        </div>

        {/* Demo Login Shortcuts */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid var(--glass-border)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} color="var(--accent-cyan)" /> Quick Fill Demo Account:
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillDemo('user@complaint.com', 'user123')}
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              <User size={12} /> User
            </button>
            <button
              type="button"
              onClick={() => fillDemo('agent@complaint.com', 'agent123')}
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              <Headset size={12} /> Agent
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@complaint.com', 'admin123')}
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            >
              <Shield size={12} /> Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="glass-input"
                placeholder="name@complaint.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="glass-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Key size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            <LogIn size={18} /> {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
