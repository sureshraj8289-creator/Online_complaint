import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        margin: '4rem auto 2rem auto',
        maxWidth: '1280px',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
        borderTop: '1px solid var(--glass-border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <ShieldCheck size={16} color="var(--status-resolved)" />
        <span>ResolvHub Complaint & Transparency Platform • Enterprise Grade</span>
      </div>
      <div>
        Built with MERN Stack (MongoDB, Express, React, Node) & Glassmorphism Design System.
      </div>
    </footer>
  );
};
