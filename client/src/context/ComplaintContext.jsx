import React, { createContext, useState, useCallback, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const { showToast } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchComplaints = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/complaints?${query}`);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComplaintById = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/complaints/${id}`);
      setActiveComplaint(res.data);
      return res.data;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load complaint ticket', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const createComplaint = async (formData) => {
    setLoading(true);
    try {
      const res = await API.post('/complaints', formData);
      setComplaints((prev) => [res.data, ...prev]);
      showToast(`Complaint ticket #${res.data.ticketId} created!`, 'success');
      return res.data;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit complaint', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, resolutionNotes, note) => {
    try {
      const res = await API.patch(`/complaints/${id}/status`, {
        status,
        resolutionNotes,
        note,
      });
      setComplaints((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      if (activeComplaint && activeComplaint._id === id) {
        setActiveComplaint(res.data);
      }
      showToast(`Ticket status updated to ${status}`, 'success');
      return res.data;
    } catch (err) {
      showToast(err.response?.data?.message || 'Status update failed', 'error');
      throw err;
    }
  };

  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  }, []);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        activeComplaint,
        loading,
        stats,
        fetchComplaints,
        fetchComplaintById,
        createComplaint,
        updateStatus,
        fetchAdminStats,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};
