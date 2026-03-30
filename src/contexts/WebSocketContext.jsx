import React, { createContext, useContext, useState, useCallback } from 'react';
import useWebSocket from '../hooks/useWebSocket';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [lastEvent, setLastEvent] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleEvent = useCallback((event, data) => {
    setLastEvent({ event, data, timestamp: Date.now() });

    // Adiciona notificação para eventos importantes
    if (event === 'new_message' || event === 'skill_executed') {
      const notification = {
        id: Date.now(),
        event,
        data,
        read: false,
      };
      setNotifications(prev => [notification, ...prev].slice(0, 50));
    }
  }, []);

  const { connected } = useWebSocket(handleEvent);

  function clearNotifications() {
    setNotifications([]);
  }

  function markAsRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <WebSocketContext.Provider value={{
      connected,
      lastEvent,
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
      clearNotifications,
      markAsRead,
    }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWS() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWS deve ser usado dentro de WebSocketProvider');
  return ctx;
}
