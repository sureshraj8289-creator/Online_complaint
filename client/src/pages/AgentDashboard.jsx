import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ComplaintContext } from '../context/ComplaintContext';
import { AuthContext } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Headset, CheckCircle2, Clock, RefreshCw, MessageSquare, ArrowUpRight, CheckSquare, XOctagon } from 'lucide-react';

export const AgentDashboard = () => {
  const { complaints, fetchComplaints, updateStatus, loading } = useContext(ComplaintContext);
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'pending'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const assignedComplaints = complaints.filter(
    (c) => c.agentId && c.agentId._id === user?._id
  );
  const unassignedPending = complaints.filter(
    (c) => c.status === 'Pending' && !c.agentId
  );

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      await updateStatus(selectedTicket._id, newStatus, resolutionNotes);
      setShowStatusModal(false);
      setSelectedTicket(null);
      setResolutionNotes('');
    } catch (err) {
      // Error toast
    }
  };

  const openStatusModal = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status === 'Pending' ? 'In Progress' : 'Resolved');
    setResolutionNotes(ticket.resolutionNotes || '');
    setShowStatusModal(true);
  };

  const displayedList = activeTab === 'assigned' ? assignedComplaints : unassignedPending;

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Agent Workflow Desk</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage assigned complaint tickets, update resolution progress, and respond to clients
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('assigned')}
            className={activeTab === 'assigned' ? 'btn-primary' : 'btn-secondary'}
          >
            <Headset size={16} /> My Assigned Tickets ({assignedComplaints.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'}
          >
            <Clock size={16} /> Unassigned Queue ({unassignedPending.length})
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading agent queue...
        </div>
      ) : displayedList.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--status-resolved)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            {activeTab === 'assigned' ? 'No active tickets assigned' : 'Unassigned queue is empty'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {activeTab === 'assigned'
              ? 'Check the Unassigned Queue to pick up pending user complaints.'
              : 'All pending complaints have been assigned to support agents.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedList.map((c) => (
            <div key={c._id} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {c.ticketId}
                    </span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{c.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {c.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    <span>👤 Client: <strong>{c.userId?.name} ({c.userId?.email})</strong></span>
                    <span>📁 Category: <strong>{c.category}</strong></span>
                    <span>🕒 Submitted: {new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'center' }}>
                  <button
                    onClick={() => openStatusModal(c)}
                    className="btn-primary"
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                  >
                    <CheckSquare size={15} /> Update Status
                  </button>
                  <Link to={`/complaints/${c._id}`} className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
                    Ticket Chat & Logs <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedTicket && (
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
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Update Ticket [{selectedTicket.ticketId}]
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {selectedTicket.title}
            </p>

            <form onSubmit={handleUpdateStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Target Ticket Status
                </label>
                <select
                  className="glass-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="In Progress" style={{ background: '#1e293b' }}>In Progress</option>
                  <option value="Resolved" style={{ background: '#1e293b' }}>Resolved</option>
                  <option value="Rejected" style={{ background: '#1e293b' }}>Rejected</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Resolution Notes / Agent Comment
                </label>
                <textarea
                  rows={3}
                  className="glass-input"
                  placeholder="Explain the solution applied or reason for status transition..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowStatusModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
