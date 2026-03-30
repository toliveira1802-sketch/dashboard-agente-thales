import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import AgentStatusBadge from '../components/AgentStatusBadge';
import { getSystemStatus, getConversationStats, listConversations } from '../services/api';
import { useWS } from '../contexts/WebSocketContext';
import { Box, Activity, Cpu, MessageCircle } from 'lucide-react';

const AGENT_ICONS = { sophia: Cpu, pitoco_loco: Activity, dash_controle: Box };
const AGENT_LABELS = { sophia: 'Sophia', pitoco_loco: 'Pitoco Loco', dash_controle: 'Dash Controle' };

export default function Home() {
  const [status, setStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentConvs, setRecentConvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lastEvent } = useWS();

  async function load() {
    try {
      const [sysStatus, convStats, recent] = await Promise.all([
        getSystemStatus(),
        getConversationStats(),
        listConversations({ limit: 5 }),
      ]);
      setStatus(sysStatus);
      setStats(convStats);
      setRecentConvs(recent.conversations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Auto-refresh quando chegar evento de nova mensagem
  useEffect(() => {
    if (lastEvent?.event === 'new_message') {
      load();
    }
  }, [lastEvent]);

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p style={{ color: 'var(--status-offline)' }}>Erro: {error}</p>;

  const agents = status?.agents || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1>Visão Geral do Sistema</h1>
        <p>Acompanhe o status dos agentes e integrações em tempo real.</p>
      </header>

      {/* Cards dos agentes */}
      <section style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {agents.map(agent => {
          const Icon = AGENT_ICONS[agent.name] || Box;
          const label = AGENT_LABELS[agent.name] || agent.name;
          const agentStats = stats?.by_agent?.[agent.name] || {};

          return (
            <GlassCard key={agent.name} title={`Agente: ${label}`} icon={Icon} className="agent-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <AgentStatusBadge status="online" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Conversas</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{agentStats.conversations ?? 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mensagens</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{agentStats.messages ?? 0}</span>
              </div>
            </GlassCard>
          );
        })}
      </section>

      {/* Atividade recente + Integrações */}
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
        <GlassCard title="Conversas Recentes" icon={MessageCircle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentConvs.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '1rem 0' }}>Nenhuma conversa ainda.</p>
            ) : (
              recentConvs.map(conv => (
                <div key={conv.id} style={{
                  display: 'flex', flexDirection: 'column',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 12,
                  border: '1px solid var(--border-glass)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {AGENT_LABELS[conv.agent_name] || conv.agent_name}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {new Date(conv.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>
                    {conv.contact_name || conv.phone_number || 'Dashboard'}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {conv.source} &middot; {conv.message_count} mensagens
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <GlassCard title="Integrações">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>WhatsApp Cloud API</span>
                <span style={{ color: status?.whatsapp !== false ? 'var(--status-online)' : 'var(--status-offline)', fontSize: '0.875rem' }}>
                  {status?.whatsapp !== false ? 'Configurado' : 'Não configurado'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Obsidian Vault</span>
                <span style={{ color: 'var(--status-online)', fontSize: '0.875rem' }}>
                  {status?.rag?.vault_path || '...'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>ChromaDB (Vetores)</span>
                <span style={{ fontSize: '0.875rem' }}>
                  {status?.rag?.indexed_docs ?? 0} docs indexados
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Banco de Dados">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Conversas</span>
                <span style={{ fontWeight: 700 }}>{stats?.total_conversations ?? 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mensagens</span>
                <span style={{ fontWeight: 700 }}>{stats?.total_messages ?? 0}</span>
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
