import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { getSystemStatus, reindexVault } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, Database, RefreshCw, LogOut } from 'lucide-react';

export default function Settings() {
  const [status, setStatus] = useState(null);
  const [reindexing, setReindexing] = useState(false);
  const [reindexResult, setReindexResult] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    getSystemStatus()
      .then(setStatus)
      .catch(err => console.error('Erro ao carregar status:', err));
  }, []);

  async function handleReindex() {
    setReindexing(true);
    setReindexResult(null);
    try {
      const result = await reindexVault();
      setReindexResult(result);
      // Recarrega status
      const s = await getSystemStatus();
      setStatus(s);
    } catch (err) {
      setReindexResult({ error: err.message });
    } finally {
      setReindexing(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1>Configurações</h1>
        <p>Configurações do sistema e ações administrativas.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Info do Sistema */}
        <GlassCard title="Sistema" icon={SettingsIcon}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>LLM Padrão</span>
              <span style={{ fontWeight: 600 }}>{status?.llm_default || '...'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Agentes Ativos</span>
              <span style={{ fontWeight: 600 }}>{status?.agents?.length || '...'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Conversas no Banco</span>
              <span style={{ fontWeight: 600 }}>{status?.database?.total_conversations ?? '...'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mensagens no Banco</span>
              <span style={{ fontWeight: 600 }}>{status?.database?.total_messages ?? '...'}</span>
            </div>
          </div>
        </GlassCard>

        {/* RAG / Obsidian */}
        <GlassCard title="Base de Conhecimento (RAG)" icon={Database}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vault Path</span>
              <span style={{ fontSize: '0.875rem' }}>{status?.rag?.vault_path || '...'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Docs Indexados</span>
              <span style={{ fontWeight: 600 }}>{status?.rag?.indexed_docs ?? '...'}</span>
            </div>

            <button
              onClick={handleReindex}
              disabled={reindexing}
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 12,
                color: 'var(--accent-primary)',
                cursor: reindexing ? 'wait' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: reindexing ? 0.7 : 1,
              }}
            >
              <RefreshCw size={16} className={reindexing ? 'spinning' : ''} />
              {reindexing ? 'Re-indexando...' : 'Re-indexar Vault'}
            </button>

            {reindexResult && (
              <div style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 8,
                fontSize: '0.875rem',
                background: reindexResult.error ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                color: reindexResult.error ? 'var(--status-offline)' : 'var(--status-online)',
              }}>
                {reindexResult.error || reindexResult.message}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Sessão */}
        <GlassCard title="Sessão">
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            Encerre sua sessão no dashboard.
          </p>
          <button
            onClick={logout}
            style={{
              padding: '0.75rem',
              width: '100%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 12,
              color: 'var(--status-offline)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
