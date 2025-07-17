
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VideoProcessorProps {
  sourceStream: MediaStream | null;
  onProcessedStream?: (stream: MediaStream) => void;
  enableBackgroundRemoval?: boolean;
}

export const VideoProcessor: React.FC<VideoProcessorProps> = ({
  sourceStream,
  onProcessedStream,
  enableBackgroundRemoval = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bodyPixModel, setBodyPixModel] = useState<any>(null);

  useEffect(() => {
    if (enableBackgroundRemoval) {
      loadBodyPix();
    }
  }, [enableBackgroundRemoval]);

  useEffect(() => {
    if (sourceStream && videoRef.current) {
      videoRef.current.srcObject = sourceStream;
    }
  }, [sourceStream]);

  const loadBodyPix = async () => {
    try {
      // Simulating BodyPix loading - in real app would be:
      // const bodyPix = await tf.loadLayersModel('/path/to/bodypix');
      console.log('Loading BodyPix model...');
      
      // Simulate model loading delay
      setTimeout(() => {
        setBodyPixModel({ loaded: true });
        console.log('BodyPix model loaded');
      }, 2000);
    } catch (error) {
      console.error('Failed to load BodyPix model:', error);
    }
  };

  const startProcessing = async () => {
    if (!videoRef.current || !canvasRef.current || !sourceStream) return;
    
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const processFrame = () => {
      if (!ctx || !video || !isProcessing) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (enableBackgroundRemoval && bodyPixModel) {
        // Simulate background removal
        ctx.fillStyle = '#000000'; // Black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // In real implementation, this would use BodyPix segmentation
        // For demo, we'll just draw the video with a simulated mask
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simulate person segmentation outline
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          canvas.width * 0.2, 
          canvas.height * 0.1, 
          canvas.width * 0.6, 
          canvas.height * 0.8
        );
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(processFrame);
    };

    processFrame();

    // Create processed stream from canvas
    const processedStream = canvas.captureStream(30);
    onProcessedStream?.(processedStream);
  };

  const stopProcessing = () => {
    setIsProcessing(false);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Video Processor</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Source Video</h4>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full rounded border"
              style={{ maxHeight: '200px' }}
            />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Processed Output</h4>
            <canvas
              ref={canvasRef}
              className="w-full rounded border bg-black"
              style={{ maxHeight: '200px' }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={startProcessing} 
            disabled={!sourceStream || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Start Processing'}
          </Button>
          
          <Button 
            onClick={stopProcessing} 
            disabled={!isProcessing}
            variant="secondary"
          >
            Stop
          </Button>
        </div>

        {enableBackgroundRemoval && (
          <div className="text-sm">
            <p>Background Removal: {bodyPixModel ? '✓ Ready' : '⏳ Loading...'}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
