
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { MediaItem, ControlCommand } from '@/types';

interface MediaPlayerProps {
  mediaItems: MediaItem[];
  onCommand?: (command: ControlCommand) => void;
  remoteControlled?: boolean;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  mediaItems,
  onCommand,
  remoteControlled = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentItem, setCurrentItem] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (mediaItems.length > 0) {
      setCurrentItem(mediaItems[0]);
    }
  }, [mediaItems]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [currentItem]);

  const executeCommand = (command: ControlCommand) => {
    const video = videoRef.current;
    if (!video) return;

    switch (command.type) {
      case 'play':
        video.play();
        setIsPlaying(true);
        break;
      case 'pause':
        video.pause();
        setIsPlaying(false);
        break;
      case 'seek':
        video.currentTime = command.payload;
        break;
      case 'mute':
        video.muted = true;
        setIsMuted(true);
        break;
      case 'unmute':
        video.muted = false;
        setIsMuted(false);
        break;
      case 'next':
        if (currentIndex < mediaItems.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setCurrentItem(mediaItems[nextIndex]);
        }
        break;
      case 'previous':
        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          setCurrentIndex(prevIndex);
          setCurrentItem(mediaItems[prevIndex]);
        }
        break;
      case 'load':
        const item = mediaItems.find(m => m.id === command.payload);
        if (item) {
          setCurrentItem(item);
          setCurrentIndex(mediaItems.indexOf(item));
        }
        break;
    }

    if (onCommand) {
      onCommand(command);
    }
  };

  const handleControl = (type: ControlCommand['type'], payload?: any) => {
    executeCommand({
      type,
      payload,
      timestamp: Date.now()
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Media Player {remoteControlled && '(Remote Controlled)'}
        </h3>

        {currentItem && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-medium">{currentItem.name}</h4>
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} of {mediaItems.length}
              </p>
            </div>

            {currentItem.type === 'video' ? (
              <video
                ref={videoRef}
                src={currentItem.url}
                className="w-full rounded"
                style={{ maxHeight: '300px' }}
              />
            ) : (
              <img
                src={currentItem.url}
                alt={currentItem.name}
                className="w-full rounded"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            )}

            {currentItem.type === 'video' && (
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={([value]) => handleControl('seek', value)}
                  className="w-full"
                />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                  <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-2">
              <Button
                size="icon"
                onClick={() => handleControl('previous')}
                disabled={currentIndex === 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              {currentItem.type === 'video' && (
                <Button
                  size="icon"
                  onClick={() => handleControl(isPlaying ? 'pause' : 'play')}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              )}

              <Button
                size="icon"
                onClick={() => handleControl('next')}
                disabled={currentIndex === mediaItems.length - 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              {currentItem.type === 'video' && (
                <Button
                  size="icon"
                  onClick={() => handleControl(isMuted ? 'unmute' : 'mute')}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Media Library</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-2 rounded text-sm cursor-pointer ${
                  currentItem?.id === item.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => handleControl('load', item.id)}
              >
                {item.name} ({item.type})
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
