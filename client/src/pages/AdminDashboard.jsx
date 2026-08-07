import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { ComplaintContext } from '../context/ComplaintContext';
import { AuthContext } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Shield, Users, BarChart2, Star, UserPlus, CheckCircle2, Clock, RefreshCw, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { stats, fetchAdminStats } = useContext(ComplaintContext);
  const { showToast } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'assign' | 'users'
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [assignModal, setAssignModal] = useState({ show: false, ticket: null, selectedAgentId: '' });

  useEffect(() => {
    fetchAdminStats();
    loadAllData();
  }, [fetchAdminStats]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [compRes, agentRes, userRes] = await Promise.all([
        API.get('/complaints'),
        API.get('/agents'),
        API.get('/admin/users'),
      ]);
      setComplaints(compRes.data);
      setAgents(agentRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignModal.ticket || !assignModal.selectedAgentId) return;

    try {
      await API.patch('/agents/assign', {
        complaintId: assignModal.ticket._id,
        agentId: assignModal.selectedAgentId,
      });
      showToast(`Agent assigned to ticket ${assignModal.ticket.ticketId}`, 'success');
      setAssignModal({ show: false, ticket: null, selectedAgentId: '' });
      loadAllData();
      fetchAdminStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Assignment failed', 'error');
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await API.patch(`/admin/users/${userId}/role`, { role });
      showToast('User role updated successfully', 'success');
      loadAllData();
    } catch (err) {
      showToast('Failed to update role', 'error');
    }
  };

  const pendingComplaints = complaints.filter((c) => c.status === 'Pending' || !c.agentId);

  return (
    <div className="app-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Operations & Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            System-wide complaint statistics, agent workload allocation, and user permissions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}
          >
            <BarChart2 size={16} /> Metrics Overview
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={activeTab === 'assign' ? 'btn-primary' : 'btn-secondary'}
          >
            <Clock size={16} /> Dispatch Queue ({pendingComplaints.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}
          >
            <Users size={16} /> User Management ({users.length})
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Complaints</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats?.totalComplaints || 0}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--status-pending)', marginBottom: '0.25rem' }}>Pending Allocation</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-pending)' }}>{stats?.pendingCount || 0}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--status-progress)', marginBottom: '0.25rem' }}>In Investigation</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-progress)' }}>{stats?.inProgressCount || 0}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--status-resolved)', marginBottom: '0.25rem' }}>Resolved & Closed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-resolved)' }}>
            {(stats?.resolvedCount || 0) + (stats?.closedCount || 0)}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', marginBottom: '0.25rem' }}>Avg Rating Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {stats?.avgRating || '5.0'} <Star size={18} fill="currentColor" color="var(--accent-purple)" />
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Category Distribution */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              Complaints by Category
            </h3>
            {stats?.categoryStats && stats.categoryStats.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {stats.categoryStats.map((item) => {
                  const percentage = Math.round((item.count / (stats.totalComplaints || 1)) * 100);
                  return (
                    <div key={item.category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span>{item.category}</span>
                        <span style={{ fontWeight: 700 }}>{item.count} ({percentage}%)</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>No category data available</div>
            )}
          </div>

          {/* Support Agents Workload */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              Support Agent Workload Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{agent.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{agent.department} • {agent.email}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-progress" style={{ fontSize: '0.75rem' }}>
                      {agent.activeTickets || 0} Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assign' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingComplaints.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <CheckCircle2 size={48} color="var(--status-resolved)" style={{ marginBottom: '1rem' }} />
              <h3>Dispatch queue is clear!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>All submitted complaints have assigned handling agents.</p>
            </div>
          ) : (
            pendingComplaints.map((c) => (
              <div key={c._id} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan)' }}>{c.ticketId}</span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>{c.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Client: <strong>{c.userId?.name}</strong> • Category: <strong>{c.category}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setAssignModal({ show: true, ticket: c, selectedAgentId: agents[0]?._id || '' })}
                    className="btn-primary"
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                  >
                    <UserPlus size={15} /> Assign Agent
                  </button>
                  <Link to={`/complaints/${c._id}`} className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
                    View Ticket <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                <th style={{ padding: '0.75rem 1rem' }}>Current Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{u.department || 'General'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: u.role === 'ADMIN' ? 'rgba(244,63,94,0.15)' : u.role === 'AGENT' ? 'rgba(56,189,248,0.15)' : 'rgba(16,185,129,0.15)',
                        color: u.role === 'ADMIN' ? '#f43f5e' : u.role === 'AGENT' ? '#38bdf8' : '#10b981',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <select
                      className="glass-input"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{ width: '130px', padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      <option value="USER" style={{ background: '#1e293b' }}>USER</option>
                      <option value="AGENT" style={{ background: '#1e293b' }}>AGENT</option>
                      <option value="ADMIN" style={{ background: '#1e293b' }}>ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Agent Modal */}
      {assignModal.show && assignModal.ticket && (
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
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Assign Support Agent
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Select a specialized agent for ticket <strong>[{assignModal.ticket.ticketId}]</strong> ({assignModal.ticket.category})
            </p>

            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Select Agent
                </label>
                <select
                  className="glass-input"
                  value={assignModal.selectedAgentId}
                  onChange={(e) => setAssignModal({ ...assignModal, selectedAgentId: e.target.value })}
                >
                  {agents.map((ag) => (
                    <option key={ag._id} value={ag._id} style={{ background: '#1e293b' }}>
                      {ag.name} ({ag.department}) - {ag.activeTickets || 0} active tickets
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setAssignModal({ show: false, ticket: null, selectedAgentId: '' })}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
