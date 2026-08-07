import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, LifeBuoy, LayoutDashboard, UserCheck, LogOut, LogIn, UserPlus } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'AGENT') return '/agent';
    return '/dashboard';
  };

  return (
    <nav
      className="glass-card"
      style={{
        margin: '1rem auto 2rem auto',
        maxWidth: '1280px',
        padding: '0.85rem 1.5rem',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '1rem',
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
          }}
        >
          <LifeBuoy color="#ffffff" size={22} />
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.35rem', color: '#fff' }}>
            Resolv<span style={{ color: 'var(--accent-cyan)' }}>Hub</span>
          </span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '-2px' }}>
            Complaint & Transparency Engine
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <Link to={getDashboardPath()} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <LayoutDashboard size={16} />
              {user?.role === 'ADMIN' ? 'Admin Suite' : user?.role === 'AGENT' ? 'Agent Portal' : 'My Tickets'}
            </Link>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingLeft: '0.75rem',
                borderLeft: '1px solid var(--glass-border)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '0.9rem',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{user?.name}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: user?.role === 'ADMIN' ? '#f43f5e' : user?.role === 'AGENT' ? '#38bdf8' : '#10b981',
                    fontWeight: 600,
                  }}
                >
                  {user?.role} {user?.department ? `• ${user.department}` : ''}
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 0.85rem', color: '#ef4444' }}>
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
              <LogIn size={16} /> Sign In
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}>
              <UserPlus size={16} /> Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
