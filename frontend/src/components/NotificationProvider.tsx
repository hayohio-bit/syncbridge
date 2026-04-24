import React, { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { useUIStore } from '../store/uiStore';
import { Bell, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuthStore();
  const { notifications, addNotification, removeNotification } = useNotificationStore();
  const triggerTaskUpdate = useUIStore((s) => s.triggerTaskUpdate);
  const stompClient = useRef<Client | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      if (stompClient.current) {
        stompClient.current.deactivate();
        stompClient.current = null;
      }
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);

      // 1. 사용자 전용 알림 채널 구독
      client.subscribe('/user/queue/notifications', (message) => {
        try {
          const body = JSON.parse(message.body);
          addNotification(body);
        } catch (err) {
          console.error('Failed to parse notification message', err);
        }
      });

      // 2. 업무 변경 브로드캐스트 채널 구독
      client.subscribe('/topic/tasks', (message) => {
        console.log('Task update received:', message.body);
        triggerTaskUpdate();
      });
    };

    client.onStompError = (frame) => {
      console.error('WebSocket STOMP Error:', frame.headers['message']);
    };

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [user, token, addNotification, triggerTaskUpdate]);

  const handleNotificationClick = (taskId: number, id: string) => {
    navigate(`/tasks/${taskId}`);
    removeNotification(id);
  };

  return (
    <>
      {children}
      
      {/* Real-time Toast Overlay */}
      <div className="notification-overlay">
        {notifications.filter(n => !n.read).map((n) => (
          <div key={n.id} className="notification-toast">
            <div className="notification-toast-icon">
              <Bell size={20} />
            </div>
            <div className="notification-toast-content">
              <div className="notification-toast-header">
                <span className="notification-toast-title">{n.title}</span>
                <span className="notification-toast-time">방금 전</span>
              </div>
              <p className="notification-toast-message">{n.message}</p>
              <div className="notification-toast-actions">
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => handleNotificationClick(n.taskId, n.id)}
                >
                  <ExternalLink size={14} /> 보기
                </button>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => removeNotification(n.id)}
                >
                  <X size={14} /> 닫기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
