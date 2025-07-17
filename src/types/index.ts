
export interface MediaItem {
  id: string;
  name: string;
  type: 'video' | 'image';
  url: string;
  duration?: number;
  thumbnail?: string;
}

export interface ControlCommand {
  type: 'play' | 'pause' | 'seek' | 'mute' | 'unmute' | 'next' | 'previous' | 'load';
  payload?: any;
  timestamp: number;
}

export interface VideoFeed {
  id: string;
  stream: MediaStream | null;
  isActive: boolean;
  type: 'presenter' | 'audience';
}

export interface ZoomConfig {
  sdkKey: string;
  sdkSecret: string;
  topic: string;
  userName: string;
  userEmail: string;
  passWord: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  sender: 'presenter' | 'audience' | 'tablet';
  timestamp: number;
}
