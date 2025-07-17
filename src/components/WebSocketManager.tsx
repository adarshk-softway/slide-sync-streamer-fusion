
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebSocketMessage } from '@/types';

interface WebSocketManagerProps {
  url?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnectionChange?: (connected: boolean) => void;
  clientType: 'presenter' | 'audience' | 'tablet';
}

export const WebSocketManager: React.FC<WebSocketManagerProps> = ({
  url = 'ws://localhost:8080',
  onMessage,
  onConnectionChange,
  clientType
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connect = () => {
    try {
      // For demo, we'll simulate WebSocket connection
      console.log(`Connecting to ${url} as ${clientType}`);
      
      // Simulate connection success
      setTimeout(() => {
        setIsConnected(true);
        onConnectionChange?.(true);
        
        // Simulate receiving messages
        const demoMessage: WebSocketMessage = {
          type: 'system',
          data: { message: `${clientType} connected successfully` },
          sender: 'presenter',
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, demoMessage]);
        onMessage?.(demoMessage);
      }, 1000);

    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    onConnectionChange?.(false);
  };

  const sendMessage = (type: string, data: any) => {
    const message: WebSocketMessage = {
      type,
      data,
      sender: clientType,
      timestamp: Date.now()
    };

    if (isConnected) {
      // In real implementation: wsRef.current?.send(JSON.stringify(message));
      console.log('Sending message:', message);
      
      // Simulate message echo for demo
      setMessages(prev => [...prev, message]);
      onMessage?.(message);
    }
  };

  const sendTextMessage = () => {
    if (messageText.trim()) {
      sendMessage('text', { message: messageText });
      setMessageText('');
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">WebSocket Connection</h3>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="WebSocket URL"
            value={url}
            className="flex-1"
            disabled
          />
          <Button onClick={connect} disabled={isConnected}>
            Connect
          </Button>
          <Button onClick={disconnect} disabled={!isConnected} variant="secondary">
            Disconnect
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Messages</h4>
          <div className="h-32 overflow-y-auto border rounded p-2 bg-muted/20">
            {messages.map((msg, index) => (
              <div key={index} className="text-xs mb-1">
                <span className="font-medium">[{msg.sender}]</span>{' '}
                <span className="text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>{' '}
                {JSON.stringify(msg.data)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Send message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
            disabled={!isConnected}
          />
          <Button onClick={sendTextMessage} disabled={!isConnected}>
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};
