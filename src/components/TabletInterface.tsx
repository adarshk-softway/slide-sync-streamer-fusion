
import React, { useState, useRef, useEffect } from 'react';
import { MediaPlayer } from './MediaPlayer';
import { WebSocketManager } from './WebSocketManager';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MediaItem, ControlCommand, WebSocketMessage } from '@/types';

export const TabletInterface: React.FC = () => {
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

  const [audienceThumbnail, setAudienceThumbnail] = useState<string | null>(null);
  const thumbnailCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleMediaCommand = (command: ControlCommand) => {
    console.log('Sending command to audience device:', command);
    // In real app, this would send via WebSocket to audience device
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    if (message.type === 'audience_thumbnail') {
      setAudienceThumbnail(message.data.thumbnail);
    }
  };

  // Simulate receiving audience thumbnails
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate thumbnail update
      const canvas = thumbnailCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Create a simple colored rectangle as demo thumbnail
          const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#fff';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('LIVE', canvas.width / 2, canvas.height / 2);
          
          const thumbnail = canvas.toDataURL();
          setAudienceThumbnail(thumbnail);
        }
      }
    }, 500); // Update every 0.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Tablet Control Interface</h1>
          <p className="text-muted-foreground">
            Remote control for presentation media and audience monitoring
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Media Control</h3>
              <MediaPlayer
                mediaItems={mediaItems}
                onCommand={handleMediaCommand}
              />
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Audience Camera</h3>
              {audienceThumbnail ? (
                <div className="space-y-2">
                  <img
                    src={audienceThumbnail}
                    alt="Audience thumbnail"
                    className="w-full rounded border"
                    style={{ maxHeight: '120px', objectFit: 'cover' }}
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    Updates every 0.5s
                  </p>
                </div>
              ) : (
                <div className="h-24 bg-muted rounded flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">No feed</p>
                </div>
              )}
            </Card>

            <canvas
              ref={thumbnailCanvasRef}
              width={160}
              height={120}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <WebSocketManager
          clientType="tablet"
          onMessage={handleWebSocketMessage}
        />
      </div>
    </div>
  );
};
