import React from 'react';

export default function AgentStatusBadge({ status, label }) {
  const getStatusClass = () => {
    switch (status) {
      case 'online': return 'status-online';
      case 'offline': return 'status-offline';
      case 'busy': return 'status-busy';
      default: return 'status-offline';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'Ativo e Operante';
      case 'offline': return 'Desconectado';
      case 'busy': return 'Processando...';
      default: return 'Desconectado';
    }
  };

  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '20px',
      border: '1px solid var(--border-glass)'
    }}>
      <span className={`status-indicator ${getStatusClass()}`} />
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        {label ? label : getStatusText()}
      </span>
    </div>
  );
}
