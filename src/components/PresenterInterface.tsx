
import React, { useState, useEffect } from 'react';
import { VideoProcessor } from './VideoProcessor';
import { ZoomIntegration } from './ZoomIntegration';
import { WebSocketManager } from './WebSocketManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomConfig, VideoFeed, WebSocketMessage } from '@/types';

export const PresenterInterface: React.FC = () => {
  const [sourceStream, setSourceStream] = useState<MediaStream | null>(null);
  const [processedStream, setProcessedStream] = useState<MediaStream | null>(null);
  const [audienceFeed, setAudienceFeed] = useState<VideoFeed | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  const zoomConfig: ZoomConfig = {
    sdkKey: 'demo-sdk-key',
    sdkSecret: 'demo-sdk-secret',
    topic: 'Presentation Room',
    userName: 'Presenter',
    userEmail: 'presenter@demo.com',
    passWord: 'demo123'
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      setSourceStream(stream);
    } catch (error) {
      console.error('Failed to initialize camera:', error);
    }
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log('Received WebSocket message:', message);
    
    if (message.type === 'audience_thumbnail') {
      // Handle audience camera thumbnail update
      console.log('Audience thumbnail updated');
    }
  };

  useEffect(() => {
    initializeCamera();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Presenter Control Panel</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Button onClick={initializeCamera}>Initialize Camera</Button>
            <div className="text-sm text-muted-foreground">
              WebSocket: {isWebSocketConnected ? '✓ Connected' : '❌ Disconnected'}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <VideoProcessor
            sourceStream={sourceStream}
            onProcessedStream={setProcessedStream}
            enableBackgroundRemoval={true}
          />

          <ZoomIntegration
            config={zoomConfig}
            inputStream={processedStream}
            onVideoFeed={setAudienceFeed}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <WebSocketManager
            clientType="presenter"
            onMessage={handleWebSocketMessage}
            onConnectionChange={setIsWebSocketConnected}
          />

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Audience Monitor</h3>
            {audienceFeed?.stream ? (
              <div className="space-y-2">
                <video
                  autoPlay
                  muted
                  className="w-full rounded border"
                  style={{ maxHeight: '200px' }}
                  ref={(video) => {
                    if (video && audienceFeed.stream) {
                      video.srcObject = audienceFeed.stream;
                    }
                  }}
                />
                <p className="text-sm text-center">Live audience feed</p>
              </div>
            ) : (
              <div className="h-32 bg-muted rounded flex items-center justify-center">
                <p className="text-muted-foreground">No audience feed</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
