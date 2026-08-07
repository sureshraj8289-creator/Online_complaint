import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Mail, Key, Building, Phone, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    department: 'General Support',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'AGENT') navigate('/agent');
      else navigate('/dashboard');
    } catch (err) {
      // Handled by toast
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '520px', marginTop: '2rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Register to log, track, and resolve complaints
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                required
                className="glass-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                required
                className="glass-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                Role
              </label>
              <select
                name="role"
                className="glass-input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER" style={{ background: '#1e293b' }}>User / Client</option>
                <option value="AGENT" style={{ background: '#1e293b' }}>Support Agent</option>
                <option value="ADMIN" style={{ background: '#1e293b' }}>Administrator</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                Department
              </label>
              <select
                name="department"
                className="glass-input"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="General Support" style={{ background: '#1e293b' }}>General Support</option>
                <option value="Billing & Payment" style={{ background: '#1e293b' }}>Billing & Payment</option>
                <option value="Technical Issue" style={{ background: '#1e293b' }}>Technical Support</option>
                <option value="Account Access" style={{ background: '#1e293b' }}>Account Access</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="glass-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Key size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', padding: '0.85rem' }}
          >
            <UserPlus size={18} /> {loading ? 'Registering Account...' : 'Register Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
