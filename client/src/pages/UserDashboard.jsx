import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ComplaintContext } from '../context/ComplaintContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { PlusCircle, Search, Filter, MessageSquare, ArrowUpRight, FileText, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

export const UserDashboard = () => {
  const { complaints, fetchComplaints, createComplaint, loading } = useContext(ComplaintContext);
  const [showModal, setShowModal] = useState(false);

  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Billing & Payment',
    priority: 'Medium',
    description: '',
  });

  useEffect(() => {
    fetchComplaints({ status: filterStatus, search: searchTerm });
  }, [fetchComplaints, filterStatus, searchTerm]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createComplaint(formData);
      setShowModal(false);
      setFormData({ title: '', category: 'Billing & Payment', priority: 'Medium', description: '' });
    } catch (err) {
      // Error toast
    }
  };

  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length;

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Complaints Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Submit tickets, track resolution progress, and message your agent</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusCircle size={18} /> New Complaint
        </button>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--status-pending-bg)', padding: '0.75rem', borderRadius: '12px', color: 'var(--status-pending)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{pendingCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Triage</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--status-progress-bg)', padding: '0.75rem', borderRadius: '12px', color: 'var(--status-progress)' }}>
            <RefreshCw size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{inProgressCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>In Investigation</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--status-resolved-bg)', padding: '0.75rem', borderRadius: '12px', color: 'var(--status-resolved)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{resolvedCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resolved Tickets</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Search tickets by ID or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="glass-input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="" style={{ background: '#1e293b' }}>All Statuses</option>
            <option value="Pending" style={{ background: '#1e293b' }}>Pending</option>
            <option value="In Progress" style={{ background: '#1e293b' }}>In Progress</option>
            <option value="Resolved" style={{ background: '#1e293b' }}>Resolved</option>
            <option value="Closed" style={{ background: '#1e293b' }}>Closed</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Fetching ticket records...</div>
      ) : complaints.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <FileText size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No complaints found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            You haven't logged any complaints matching the current criteria.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <PlusCircle size={16} /> Create Your First Ticket
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {complaints.map((c) => (
            <div key={c._id} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                      {c.ticketId}
                    </span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{c.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    <span>📁 Category: <strong>{c.category}</strong></span>
                    <span>👨‍💼 Agent: <strong>{c.agentId ? c.agentId.name : 'Unassigned'}</strong></span>
                    <span>🕒 Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'center' }}>
                  <Link to={`/complaints/${c._id}`} className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
                    View Progress & Chat <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Complaint Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '550px', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              File a New Complaint
            </h2>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Complaint Title
                </label>
                <input
                  type="text"
                  required
                  className="glass-input"
                  placeholder="e.g. Double Charge on Billing / Cannot Access Dashboard"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Category
                  </label>
                  <select
                    className="glass-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Billing & Payment" style={{ background: '#1e293b' }}>Billing & Payment</option>
                    <option value="Technical Issue" style={{ background: '#1e293b' }}>Technical Issue</option>
                    <option value="Account Access" style={{ background: '#1e293b' }}>Account Access</option>
                    <option value="Product / Service Quality" style={{ background: '#1e293b' }}>Product / Service Quality</option>
                    <option value="Security & Fraud" style={{ background: '#1e293b' }}>Security & Fraud</option>
                    <option value="Other" style={{ background: '#1e293b' }}>Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Priority Level
                  </label>
                  <select
                    className="glass-input"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low" style={{ background: '#1e293b' }}>Low</option>
                    <option value="Medium" style={{ background: '#1e293b' }}>Medium</option>
                    <option value="High" style={{ background: '#1e293b' }}>High</option>
                    <option value="Urgent" style={{ background: '#1e293b' }}>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={4}
                  className="glass-input"
                  placeholder="Provide all relevant details, steps to reproduce, or order numbers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
