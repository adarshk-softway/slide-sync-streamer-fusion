
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { VideoFeed, ZoomConfig } from '@/types';
import { zoomService, ZoomParticipant } from '@/services/zoomService';
import { getZoomConfig } from '@/config/zoom';

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
  const [participants, setParticipants] = useState<ZoomParticipant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize Zoom SDK and connect to meeting
  const connectToZoom = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get SDK configuration
      const sdkConfig = getZoomConfig();
      
      console.log('Starting Zoom SDK initialization...');
      
      // Initialize SDK
      await zoomService.initialize(sdkConfig);
      
      // Join meeting
      await zoomService.joinMeeting({
        topic: config.topic,
        userName: config.userName,
        userEmail: config.userEmail,
        passWord: config.passWord,
        role: 1 // Host role
      });

      // Set up event listeners
      zoomService.onParticipantJoin((participant) => {
        setParticipants(prev => [...prev, participant]);
      });

      zoomService.onParticipantLeave((userId) => {
        setParticipants(prev => prev.filter(p => p.userId !== userId));
      });

      zoomService.onVideoStateChange((userId, isOn) => {
        setParticipants(prev => 
          prev.map(p => p.userId === userId ? { ...p, isVideoOn: isOn } : p)
        );
      });

      // Update state
      setIsConnected(true);
      setParticipants(zoomService.getParticipants());

      // Simulate receiving video feed for parent component
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
      setError(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromZoom = async () => {
    try {
      await zoomService.leaveMeeting();
      setIsConnected(false);
      setParticipants([]);
      setIsVideoOn(false);
      setIsAudioOn(false);
      setError(null);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const toggleVideo = async () => {
    try {
      if (isVideoOn) {
        await zoomService.stopVideo();
        setIsVideoOn(false);
      } else {
        const stream = await zoomService.startVideo(videoRef.current || undefined);
        setIsVideoOn(true);
        
        // Update video feed for parent
        if (onVideoFeed && stream) {
          onVideoFeed({
            id: 'zoom-video',
            stream,
            isActive: true,
            type: 'presenter'
          });
        }
      }
    } catch (error) {
      console.error('Failed to toggle video:', error);
      setError('Failed to toggle video');
    }
  };

  const toggleAudio = async () => {
    try {
      if (isAudioOn) {
        await zoomService.stopAudio();
        setIsAudioOn(false);
      } else {
        await zoomService.startAudio();
        setIsAudioOn(true);
      }
    } catch (error) {
      console.error('Failed to toggle audio:', error);
      setError('Failed to toggle audio');
    }
  };

  // Handle external input stream
  useEffect(() => {
    if (inputStream && videoRef.current && !isVideoOn) {
      videoRef.current.srcObject = inputStream;
    }
  }, [inputStream, isVideoOn]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Zoom Video SDK Integration</h3>
          <div className="text-sm text-muted-foreground">
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Input placeholder="Meeting Topic" defaultValue={config.topic} />
          <Input placeholder="User Name" defaultValue={config.userName} />
          <Input placeholder="User Email" defaultValue={config.userEmail} />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={connectToZoom} 
            disabled={isLoading || isConnected}
            className="flex-1"
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
            {/* Media Controls */}
            <div className="flex gap-2">
              <Button
                onClick={toggleVideo}
                variant={isVideoOn ? "default" : "secondary"}
                size="sm"
              >
                {isVideoOn ? '📹 Video On' : '📹❌ Video Off'}
              </Button>
              
              <Button
                onClick={toggleAudio}
                variant={isAudioOn ? "default" : "secondary"}
                size="sm"
              >
                {isAudioOn ? '🎤 Audio On' : '🎤❌ Audio Off'}
              </Button>
            </div>

            {/* Participants List */}
            <div>
              <h4 className="text-sm font-medium mb-2">
                Participants ({participants.length})
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {participants.map(participant => (
                  <div key={participant.userId} className="text-sm p-2 bg-muted rounded flex justify-between items-center">
                    <span className="font-medium">
                      {participant.userName} {participant.isHost && '👑'}
                    </span>
                    <div className="flex gap-2">
                      <span>{participant.isVideoOn ? '📹' : '📹❌'}</span>
                      <span>{participant.isAudioOn ? '🎤' : '🎤❌'}</span>
                      {participant.isHandRaised && <span>✋</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Feed */}
            <div>
              <h4 className="text-sm font-medium mb-2">Local Video Feed</h4>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full rounded border bg-muted"
                style={{ maxHeight: '200px' }}
                onLoadedMetadata={() => console.log('Video metadata loaded')}
              />
              {!isVideoOn && !inputStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted rounded">
                  <span className="text-muted-foreground">Camera Off</span>
                </div>
              )}
            </div>

            {/* SDK Status */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div>SDK Status: {zoomService.isConnected() ? 'Active' : 'Inactive'}</div>
              <div>Video: {isVideoOn ? 'Streaming' : 'Stopped'}</div>
              <div>Audio: {isAudioOn ? 'Active' : 'Muted'}</div>
            </div>
          </div>
        )}

        {/* Electron Integration Note */}
        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
          <strong>Electron Integration:</strong> This demo shows real SDK patterns. 
          In Electron, replace the service imports with actual @zoomus/videosdk package.
        </div>
      </div>
    </Card>
  );
};
