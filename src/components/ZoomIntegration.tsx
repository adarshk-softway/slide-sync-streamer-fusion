
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { VideoFeed, ZoomConfig } from '@/types';

interface ZoomIntegrationProps {
  config: ZoomConfig;
  onVideoFeed?: (feed: VideoFeed) => void;
  inputStream?: MediaStream;
}

export const ZoomIntegration: React.FC<ZoomIntegrationProps> = ({
  config,
  onVideoFeed,
  inputStream
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate Zoom SDK integration
  const connectToZoom = async () => {
    setIsLoading(true);
    
    try {
      // In real app, this would be:
      // const ZoomVideo = await import('@zoomus/videosdk');
      // await ZoomVideo.init({ ... });
      
      console.log('Connecting to Zoom with config:', config);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setParticipants([
        { id: '1', name: 'Presenter', isVideoOn: true, isAudioOn: true },
        { id: '2', name: 'Audience', isVideoOn: true, isAudioOn: true }
      ]);

      // Simulate receiving video feed
      if (onVideoFeed) {
        onVideoFeed({
          id: 'zoom-feed',
          stream: inputStream || null,
          isActive: true,
          type: 'presenter'
        });
      }

    } catch (error) {
      console.error('Failed to connect to Zoom:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromZoom = () => {
    setIsConnected(false);
    setParticipants([]);
  };

  useEffect(() => {
    if (inputStream && videoRef.current) {
      videoRef.current.srcObject = inputStream;
    }
  }, [inputStream]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Zoom Video SDK</h3>
        
        <div className="space-y-2">
          <Input placeholder="Meeting Topic" defaultValue={config.topic} />
          <Input placeholder="User Name" defaultValue={config.userName} />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={connectToZoom} 
            disabled={isLoading || isConnected}
          >
            {isLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Connect to Zoom'}
          </Button>
          
          {isConnected && (
            <Button onClick={disconnectFromZoom} variant="secondary">
              Disconnect
            </Button>
          )}
        </div>

        {isConnected && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Participants ({participants.length})</h4>
              <div className="space-y-1">
                {participants.map(participant => (
                  <div key={participant.id} className="text-sm p-2 bg-muted rounded">
                    {participant.name} - Video: {participant.isVideoOn ? '📹' : '📹❌'} Audio: {participant.isAudioOn ? '🎤' : '🎤❌'}
                  </div>
                ))}
              </div>
            </div>

            {inputStream && (
              <div>
                <h4 className="text-sm font-medium mb-2">Local Video Feed</h4>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full rounded border"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
