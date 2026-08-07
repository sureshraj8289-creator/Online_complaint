import React from 'react';

export const PriorityBadge = ({ priority }) => {
  let color = '#94a3b8';
  let bg = 'rgba(148, 163, 184, 0.1)';

  if (priority === 'Urgent') {
    color = '#f43f5e';
    bg = 'rgba(244, 63, 94, 0.15)';
  } else if (priority === 'High') {
    color = '#fb923c';
    bg = 'rgba(251, 146, 60, 0.15)';
  } else if (priority === 'Medium') {
    color = '#38bdf8';
    bg = 'rgba(56, 189, 248, 0.15)';
  }

  return (
    <span
      style={{
        color,
        background: bg,
        padding: '0.2rem 0.6rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 600,
        border: `1px solid ${color}33`,
      }}
    >
      ● {priority}
    </span>
  );
};
