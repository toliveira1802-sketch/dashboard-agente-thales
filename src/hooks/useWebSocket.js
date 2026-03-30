import { useEffect, useRef, useState, useCallback } from 'react';
import { getToken } from '../services/api';

const WS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000')
  .replace('http://', 'ws://')
  .replace('https://', 'wss://');

export default function useWebSocket(onEvent) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const onEventRef = useRef(onEvent);
  const reconnectTimer = useRef(null);

  // Manter ref atualizada sem reconectar
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const connect = useCallback(() => {
    const token = getToken();
    if (!token) return;

    // Limpa conexão anterior
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${WS_BASE}/ws?token=${token}`);

    ws.onopen = () => {
      setConnected(true);
      // Ping a cada 30s para manter vivo
      wsRef.current._pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'pong') return;
        if (onEventRef.current) {
          onEventRef.current(msg.event, msg.data);
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      clearInterval(wsRef.current?._pingInterval);
      // Reconectar após 3s
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      clearInterval(wsRef.current?._pingInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { connected };
}
