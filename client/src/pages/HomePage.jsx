import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, MessageSquare, BarChart3, Clock, CheckCircle2, ArrowRight, UserCheck, Headset, ShieldAlert } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="app-container">
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '4rem 1rem 3rem 1rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--primary-light)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            color: '#a5b4fc',
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          <Zap size={15} color="#818cf8" /> Transformed Complaint Handling & Audit Engine
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3.25rem',
            lineHeight: 1.15,
            fontWeight: 800,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Transparent Resolutions.<br />
          <span style={{ color: 'var(--accent-cyan)', WebkitTextFillColor: 'initial' }}>
            Empowered Users & Agents.
          </span>
        </h1>

        <p
          style={{
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
          }}
        >
          A unified, full-stack platform designed to streamline ticket submission, automate agent allocation, deliver real-time chat updates, and present real-time SLA metrics for complete transparency.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
            File a Complaint <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
            Portal Sign In
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ margin: '4rem 0' }}>
        <h2
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.85rem',
            marginBottom: '2.5rem',
          }}
        >
          Built for Seamless End-to-End Transparency
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Clock size={24} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Real-Time Ticket Tracking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Follow every stage of your complaint through visual timeline steppers from initial log to final agent closure.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <MessageSquare size={24} color="#22d3ee" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>User ↔ Agent Direct Chat</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Communicate directly with your assigned agent within the ticket interface to clarify details and send updates.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <BarChart3 size={24} color="#c084fc" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Admin Executive Analytics</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              High-level overview dashboards with category statistics, agent workload distribution, and user satisfaction trends.
            </p>
          </div>
        </div>
      </section>

      {/* Role Cards Demo Section */}
      <section style={{ margin: '4rem 0' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            Explore Role-Based Demo Portals
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, marginBottom: '0.5rem' }}>
                <UserCheck size={20} /> User Portal
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Submit complaints, attach documents, view live ticket status, and chat with assigned agents.
              </p>
              <code style={{ display: 'block', fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4rem', color: '#a7f3d0' }}>
                user@complaint.com
              </code>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Headset size={20} /> Agent Portal
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Manage assigned tickets, transition complaint statuses, and submit resolution notes.
              </p>
              <code style={{ display: 'block', fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4rem', color: '#bae6fd' }}>
                agent@complaint.com
              </code>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontWeight: 700, marginBottom: '0.5rem' }}>
                <ShieldAlert size={20} /> Admin Suite
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Assign agents to unassigned complaints, inspect system analytics, and manage user roles.
              </p>
              <code style={{ display: 'block', fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '4rem', color: '#fecdd3' }}>
                admin@complaint.com
              </code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
