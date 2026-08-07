import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Star, Send, ThumbsUp, CheckCircle2 } from 'lucide-react';

export const FeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [resolutionSatisfaction, setResolutionSatisfaction] = useState('Completely Satisfied');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/feedback', {
        complaintId: id,
        rating,
        comment,
        resolutionSatisfaction,
      });
      showToast('Thank you! Feedback submitted successfully.', 'success');
      navigate(`/complaints/${id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Feedback submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '540px', marginTop: '2rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <CheckCircle2 size={32} color="#10b981" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Complaint Resolution Feedback
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Help us improve by rating your resolution experience
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Star Selector */}
          <div style={{ textAlign: 'center' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>
              Overall Satisfaction Rating
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transform: rating >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Star
                    size={32}
                    color={rating >= star ? '#fbbf24' : '#64748b'}
                    fill={rating >= star ? '#fbbf24' : 'none'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '0.5rem', fontWeight: 700 }}>
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional' : rating === 4 ? '⭐⭐⭐⭐ Good' : rating === 3 ? '⭐⭐⭐ Satisfactory' : 'Needs Improvement'}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              Resolution Satisfaction Assessment
            </label>
            <select
              className="glass-input"
              value={resolutionSatisfaction}
              onChange={(e) => setResolutionSatisfaction(e.target.value)}
            >
              <option value="Completely Satisfied" style={{ background: '#1e293b' }}>Completely Satisfied</option>
              <option value="Somewhat Satisfied" style={{ background: '#1e293b' }}>Somewhat Satisfied</option>
              <option value="Neutral" style={{ background: '#1e293b' }}>Neutral</option>
              <option value="Dissatisfied" style={{ background: '#1e293b' }}>Dissatisfied</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              Comments & Agent Review
            </label>
            <textarea
              rows={4}
              className="glass-input"
              placeholder="Tell us what went well or how we can improve our resolution speed..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            <Send size={18} /> {loading ? 'Submitting...' : 'Submit Resolution Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
