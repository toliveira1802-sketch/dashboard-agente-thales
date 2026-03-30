import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import AgentStatusBadge from '../components/AgentStatusBadge';
import { getSystemStatus, getConversationStats } from '../services/api';
import { Cpu, Activity, Box } from 'lucide-react';

const AGENT_META = {
  sophia: { label: 'Sophia', icon: Cpu, color: '#10b981', description: 'Assistente pessoal - agenda, saúde, finanças, rotinas' },
  pitoco_loco: { label: 'Pitoco Loco', icon: Activity, color: '#f59e0b', description: 'Agente profissional - Doctor Auto Prime, vendas, consultoria' },
  dash_controle: { label: 'Dash Controle', icon: Box, color: '#3b82f6', description: 'Monitoramento e administração do sistema' },
};

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [status, convStats] = await Promise.all([
          getSystemStatus(),
          getConversationStats(),
        ]);
        setAgents(status.agents || []);
        setStats(convStats);
      } catch (err) {
        console.error('Erro ao carregar agentes:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Carregando agentes...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1>Agentes</h1>
        <p>Detalhes e estatísticas de cada agente do sistema.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {agents.map((agent) => {
          const meta = AGENT_META[agent.name] || {};
          const Icon = meta.icon || Box;
          const agentStats = stats?.by_agent?.[agent.name] || {};

          return (
            <GlassCard key={agent.name}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{
                  width: 48, height: 48,
                  background: `${meta.color || '#3b82f6'}22`,
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={24} color={meta.color || '#3b82f6'} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{meta.label || agent.name}</h3>
                    <AgentStatusBadge status="online" />
                  </div>

                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{meta.description || agent.description}</p>

                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Conversas</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{agentStats.conversations ?? 0}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Mensagens</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{agentStats.messages ?? 0}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Skills</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{agent.skills?.length ?? 0}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Histórico Ativo</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{agent.history_length ?? 0} msgs</span>
                    </div>
                  </div>

                  {agent.skills?.length > 0 && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {agent.skills.map(skill => (
                        <span key={skill} style={{
                          padding: '0.25rem 0.75rem',
                          background: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: 20,
                          fontSize: '0.75rem',
                          color: 'var(--accent-primary)',
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
