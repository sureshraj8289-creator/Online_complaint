import React from 'react';
import { Clock, RefreshCw, CheckCircle2, XCircle, Archive } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="badge badge-pending">
          <Clock size={13} /> Pending
        </span>
      );
    case 'In Progress':
      return (
        <span className="badge badge-progress">
          <RefreshCw size={13} className="spin-icon" /> In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="badge badge-resolved">
          <CheckCircle2 size={13} /> Resolved
        </span>
      );
    case 'Closed':
      return (
        <span className="badge badge-closed">
          <Archive size={13} /> Closed
        </span>
      );
    case 'Rejected':
      return (
        <span className="badge badge-rejected">
          <XCircle size={13} /> Rejected
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
