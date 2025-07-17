
import React, { useState, useEffect } from 'react';
import { ZoomIntegration } from './ZoomIntegration';
import { MediaPlayer } from './MediaPlayer';
import { WebSocketManager } from './WebSocketManager';
import { Card } from '@/components/ui/card';
import { ZoomConfig, MediaItem, ControlCommand, WebSocketMessage } from '@/types';

export const AudienceInterface: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [mediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'Welcome Video',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: '2',
      name: 'Product Demo',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: '3',
      name: 'Company Logo',
      type: 'image',
      url: 'https://via.placeholder.com/800x600/4f46e5/ffffff?text=Company+Logo'
    }
  ]);

  const zoomConfig: ZoomConfig = {
    sdkKey: 'demo-sdk-key',
    sdkSecret: 'demo-sdk-secret',
    topic: 'Presentation Room',
    userName: 'Audience',
    userEmail: 'audience@demo.com',
    passWord: 'demo123'
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      setLocalStream(stream);
    } catch (error) {
      console.error('Failed to initialize camera:', error);
    }
  };

  const handleMediaCommand = (command: ControlCommand) => {
    console.log('Media command executed:', command);
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log('Received WebSocket message:', message);
  };

  useEffect(() => {
    initializeCamera();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Audience Display</h1>
          <p className="text-muted-foreground">
            This interface simulates the audience device with dual displays
          </p>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Display 1 - Media Content</h3>
            <MediaPlayer
              mediaItems={mediaItems}
              onCommand={handleMediaCommand}
              remoteControlled={true}
            />
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Display 2 - Zoom Feed</h3>
            <ZoomIntegration
              config={zoomConfig}
              inputStream={localStream}
            />
          </Card>
        </div>

        <WebSocketManager
          clientType="audience"
          onMessage={handleWebSocketMessage}
        />
      </div>
    </div>
  );
};
