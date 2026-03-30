import React from 'react';

export default function GlassCard({ children, title, icon: Icon, className = '' }) {
  return (
    <div className={`glass glass-card ${className}`}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
          {Icon && <Icon size={20} color="var(--accent-primary)" />}
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
