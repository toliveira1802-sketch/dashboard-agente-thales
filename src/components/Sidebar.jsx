import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Database, Settings } from 'lucide-react';
import './Sidebar.css';

const menuItems = [
  { path: '/', name: 'Visão Geral', icon: LayoutDashboard },
  { path: '/agentes', name: 'Agentes', icon: Users },
  { path: '/conversas', name: 'Conversas', icon: MessageSquare },
  { path: '/conhecimento', name: 'Base (Obsidian)', icon: Database },
  { path: '/configuracoes', name: 'Configurações', icon: Settings },
];

export default function Sidebar() {
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
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-indicator status-online"></span>
          <span>Sistema Operacional</span>
        </div>
      </div>
    </aside>
  );
}
