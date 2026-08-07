import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { ComplaintContext } from '../context/ComplaintContext';
import { AuthContext } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { MessageSquare, Send, CheckCircle2, Clock, Shield, User, ArrowLeft, History, Star, FileText } from 'lucide-react';

export const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const { fetchComplaintById, activeComplaint, updateStatus } = useContext(ComplaintContext);
  const { user, showToast } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const [resolutionNote, setResolutionNote] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    fetchComplaintById(id);
    fetchChatMessages();
    const interval = setInterval(fetchChatMessages, 5000); // Polling chat updates
    return () => clearInterval(interval);
  }, [id, fetchComplaintById]);

  const fetchChatMessages = async () => {
    try {
      const res = await API.get(`/chat/${id}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMsg(true);
    try {
      const res = await API.post(`/chat/${id}`, { message: newMessage });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      showToast('Failed to send message', 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      await updateStatus(id, 'Resolved', resolutionNote);
      setShowResolveModal(false);
    } catch (err) {
      // Toast handles error
    }
  };

  if (!activeComplaint) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '4rem' }}>
        Loading ticket details...
      </div>
    );
  }

  // Stepper calculations
  const statuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
  const currentIdx = statuses.indexOf(activeComplaint.status);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'AGENT' ? '/agent' : '/dashboard'}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Ticket Header Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>
                [{activeComplaint.ticketId}]
              </span>
              <StatusBadge status={activeComplaint.status} />
              <PriorityBadge priority={activeComplaint.priority} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {activeComplaint.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{activeComplaint.description}</p>
          </div>

          {(user?.role === 'AGENT' || user?.role === 'ADMIN') && activeComplaint.status !== 'Resolved' && activeComplaint.status !== 'Closed' && (
            <button onClick={() => setShowResolveModal(true)} className="btn-primary">
              <CheckCircle2 size={18} /> Mark Ticket Resolved
            </button>
          )}

          {activeComplaint.status === 'Resolved' && user?.role === 'USER' && (
            <Link to={`/feedback/${activeComplaint._id}`} className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
              <Star size={18} /> Give Resolution Feedback
            </Link>
          )}
        </div>

        {/* Stepper Progress Bar */}
        <div style={{ marginTop: '2.5rem' }}>
          <div className="stepper-container">
            <div className="stepper-line" />
            <div
              className="stepper-progress"
              style={{
                width: `${currentIdx >= 0 ? (currentIdx / (statuses.length - 1)) * 100 : 0}%`,
              }}
            />
            {statuses.map((st, idx) => {
              const isCompleted = currentIdx > idx || activeComplaint.status === 'Closed';
              const isActive = currentIdx === idx;
              return (
                <div key={st} className={`step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                  <div className="step-circle">
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isActive ? 'var(--text-main)' : 'var(--text-dim)' }}>
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Left Timeline / Right Chat Box */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Timeline & Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--accent-cyan)" /> Ticket Metadata
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Category: </span>
                <strong>{activeComplaint.category}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Ticket Creator: </span>
                <strong>{activeComplaint.userId?.name} ({activeComplaint.userId?.email})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Assigned Agent: </span>
                <strong>{activeComplaint.agentId ? `${activeComplaint.agentId.name} (${activeComplaint.agentId.department})` : 'Awaiting Assignment'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Logged Date: </span>
                <span>{new Date(activeComplaint.createdAt).toLocaleString()}</span>
              </div>
              {activeComplaint.resolutionNotes && (
                <div style={{ marginTop: '0.5rem', padding: '0.85rem', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Resolution Summary:</div>
                  <div style={{ fontSize: '0.88rem' }}>{activeComplaint.resolutionNotes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Audit History Logs */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} color="var(--primary)" /> Resolution Activity History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeComplaint.history?.map((h, i) => (
                <div key={i} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{h.action}</div>
                  {h.note && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{h.note}</div>}
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {new Date(h.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Ticket Chat Interface */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '540px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} color="var(--accent-cyan)" /> Real-Time Ticket Communication
          </h3>

          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                No messages yet. Send a message to start communicating.
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId?._id === user?._id;
                return (
                  <div
                    key={m._id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      background: isMe ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.06)',
                      padding: '0.75rem 1rem',
                      borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: isMe ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>
                      {m.senderId?.name} ({m.senderId?.role})
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#fff' }}>{m.message}</div>
                    <div style={{ fontSize: '0.65rem', color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-dim)', textAlign: 'right', marginTop: '0.2rem' }}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSendMessage} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="glass-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" disabled={sendingMsg} className="btn-primary" style={{ padding: '0.75rem 1rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
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
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1rem' }}>
              Mark Ticket Resolved
            </h2>
            <form onSubmit={handleResolve} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Resolution Details & Notes
                </label>
                <textarea
                  required
                  rows={4}
                  className="glass-input"
                  placeholder="Describe how the complaint was resolved or what hotfix was applied..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowResolveModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
