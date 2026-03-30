import React from 'react';
import GlassCard from '../components/GlassCard';
import AgentStatusBadge from '../components/AgentStatusBadge';
import { Box, Activity, Cpu, MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1>Visão Geral do Sistema</h1>
        <p>Acompanhe o status dos agentes e integrações em tempo real.</p>
      </header>
      
      <section style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Card Sophia */}
        <GlassCard title="Agente: Sophia" icon={Cpu} className="agent-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status</span>
            <AgentStatusBadge status="online" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Interações Hoje</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>142</span>
          </div>
        </GlassCard>

        {/* Card Pitoco Loco */}
        <GlassCard title="Agente: Pitoco Loco" icon={Activity} className="agent-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status</span>
            <AgentStatusBadge status="busy" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Interações Hoje</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>58</span>
          </div>
        </GlassCard>
        
        {/* Card Dash Controle */}
        <GlassCard title="Dash Controle" icon={Box} className="agent-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Orquestrador</span>
            <AgentStatusBadge status="online" label="Estável" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Latência</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--status-online)' }}>24ms</span>
          </div>
        </GlassCard>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
        <GlassCard title="Atividade Recente (WhatsApp)" icon={MessageCircle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[
               {id: 1, agent: 'Sophia', user: '+55 11 9999-9999', time: 'Há 2 min', msg: 'Preciso de um resumo do projeto X.'},
               {id: 2, agent: 'Pitoco Loco', user: '+55 21 8888-8888', time: 'Há 15 min', msg: 'Quais são as regras de negócio?'},
               {id: 3, agent: 'Sophia', user: '+55 31 7777-7777', time: 'Há 45 min', msg: 'Agende uma reunião para amanhã.'}
             ].map((log) => (
                <div key={log.id} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '12px',
                  border: '1px solid var(--border-glass)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{log.agent}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{log.time}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{log.user}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>"{log.msg}"</div>
                </div>
             ))}
          </div>
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <GlassCard title="Integrações">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>WhatsApp Cloud API</span>
                <span style={{ color: 'var(--status-online)', fontSize: '0.875rem' }}>Conectado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Obsidian Vault Loader</span>
                <span style={{ color: 'var(--status-online)', fontSize: '0.875rem' }}>Sincronizado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>ChromaDB (Vetores)</span>
                <span style={{ color: 'var(--status-online)', fontSize: '0.875rem' }}>Indexado</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <style>{`
        .agent-card {
           flex: 1;
           min-width: 250px;
        }
      `}</style>
    </div>
  );
}
