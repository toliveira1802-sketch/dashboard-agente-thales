import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { listConversations, getConversation, deleteConversation } from '../services/api';
import { useWS } from '../contexts/WebSocketContext';
import { MessageSquare, Trash2, ChevronRight, Phone, Globe } from 'lucide-react';

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ agent: '', source: '' });
  const { lastEvent, markAsRead } = useWS();

  async function load() {
    setLoading(true);
    try {
      const data = await listConversations(filter);
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Erro ao carregar conversas:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter.agent, filter.source]);

  // Auto-refresh quando chegar nova mensagem via WebSocket
  useEffect(() => {
    if (lastEvent?.event === 'new_message') {
      load();
      // Se a conversa selecionada recebeu nova mensagem, recarrega
      if (selected && lastEvent.data?.conversation_id === selected.id) {
        handleSelect(selected.id);
      }
    }
  }, [lastEvent]);

  async function handleSelect(id) {
    try {
      const data = await getConversation(id);
      setSelected(data);
    } catch (err) {
      console.error('Erro ao carregar conversa:', err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deletar esta conversa?')) return;
    try {
      await deleteConversation(id);
      setSelected(null);
      load();
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  }

  const agentLabels = {
    sophia: 'Sophia',
    pitoco_loco: 'Pitoco Loco',
    dash_controle: 'Dash Controle',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1>Conversas</h1>
        <p>Histórico completo de todas as interações com os agentes.</p>
      </header>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <select
          value={filter.agent}
          onChange={e => setFilter(f => ({ ...f, agent: e.target.value }))}
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-glass)',
            borderRadius: 12,
            color: 'var(--text-main)',
            fontSize: '0.875rem',
          }}
        >
          <option value="">Todos os agentes</option>
          <option value="sophia">Sophia</option>
          <option value="pitoco_loco">Pitoco Loco</option>
          <option value="dash_controle">Dash Controle</option>
        </select>

        <select
          value={filter.source}
          onChange={e => setFilter(f => ({ ...f, source: e.target.value }))}
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border-glass)',
            borderRadius: 12,
            color: 'var(--text-main)',
            fontSize: '0.875rem',
          }}
        >
          <option value="">Todas as fontes</option>
          <option value="api">API / Dashboard</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? (
            <p>Carregando...</p>
          ) : conversations.length === 0 ? (
            <GlassCard>
              <p style={{ textAlign: 'center', padding: '2rem 0' }}>Nenhuma conversa encontrada.</p>
            </GlassCard>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => handleSelect(conv.id)}
                className="glass glass-card"
                style={{
                  cursor: 'pointer',
                  border: selected?.id === conv.id ? '1px solid var(--accent-primary)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {conv.source === 'whatsapp' ? <Phone size={16} color="var(--status-online)" /> : <Globe size={16} color="var(--accent-primary)" />}
                    <div>
                      <div style={{ fontWeight: 600 }}>{agentLabels[conv.agent_name] || conv.agent_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {conv.contact_name || conv.phone_number || 'Dashboard'} &middot; {conv.message_count} msgs
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(conv.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detalhe */}
        {selected && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>{agentLabels[selected.agent_name] || selected.agent_name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {selected.source} &middot; {new Date(selected.created_at).toLocaleString('pt-BR')}
                </span>
              </div>
              <button
                onClick={() => handleDelete(selected.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 8,
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: 'var(--status-offline)',
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {(selected.messages || []).map(msg => (
                <div
                  key={msg.id}
                  style={{
                    padding: '0.75rem 1rem',
                    background: msg.role === 'user' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                    borderRadius: 12,
                    border: '1px solid var(--border-glass)',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {msg.role === 'user' ? 'Usuário' : agentLabels[selected.agent_name] || 'Agente'}
                    {msg.context_used && ' (com contexto RAG)'}
                  </div>
                  <div style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
