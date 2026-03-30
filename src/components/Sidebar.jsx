import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Settings, Bell } from 'lucide-react';
import { useWS } from '../contexts/WebSocketContext';
import './Sidebar.css';

const menuItems = [
  { path: '/', name: 'Visão Geral', icon: LayoutDashboard },
  { path: '/agentes', name: 'Agentes', icon: Users },
  { path: '/conversas', name: 'Conversas', icon: MessageSquare },
  { path: '/configuracoes', name: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  const { connected, unreadCount } = useWS();

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h2>Agente Thales</h2>
        </div>
        <p className="subtitle">Painel de Controle</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
            {item.path === '/conversas' && unreadCount > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: 'var(--accent-primary)',
                color: '#fff',
                borderRadius: 20,
                padding: '2px 8px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}>
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className={`status-indicator ${connected ? 'status-online' : 'status-offline'}`}></span>
          <span>{connected ? 'Tempo real ativo' : 'Reconectando...'}</span>
        </div>
      </div>
    </aside>
  );
}
