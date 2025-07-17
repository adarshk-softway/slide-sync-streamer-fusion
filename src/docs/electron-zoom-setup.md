
# Zoom SDK Integration for Electron

This document outlines how to integrate the real Zoom Video SDK in your Electron application.

## Prerequisites

1. Zoom Video SDK credentials (SDK Key and Secret)
2. Electron application setup
3. Node.js environment

## Installation

```bash
npm install @zoomus/videosdk
```

## Main Process Setup (main.js)

```javascript
const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const path = require('path');

// Secure credential storage
ipcMain.handle('get-zoom-config', async () => {
  // In production, use encrypted storage
  return {
    sdkKey: process.env.ZOOM_SDK_KEY,
    sdkSecret: process.env.ZOOM_SDK_SECRET,
    webEndpoint: 'zoom.us'
  };
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('dist/index.html');
}

app.whenReady().then(createWindow);
```

## Preload Script (preload.js)

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getZoomConfig: () => ipcRenderer.invoke('get-zoom-config'),
});
```

## Renderer Process Integration

Update your `zoomService.ts` to use real SDK:

```typescript
// Replace the demo imports with real ones
import ZoomVideo from '@zoomus/videosdk';

export class ZoomService {
  private client: any = null;
  private stream: any = null;

  async initialize(config: ZoomSDKConfig): Promise<boolean> {
    try {
      // Real SDK initialization
      this.client = ZoomVideo.createClient();
      
      await this.client.init({
        dependentAssets: `https://source.zoom.us/videosdk/helper`,
        enforceGalleryView: config.enforceGalleryView
      });

      this.stream = this.client.getMediaStream();
      return true;
    } catch (error) {
      throw new Error(`Zoom SDK initialization failed: ${error}`);
    }
  }

  async joinMeeting(meetingConfig: ZoomMeetingConfig): Promise<void> {
    await this.client.join({
      topic: meetingConfig.topic,
      userName: meetingConfig.userName,
      userEmail: meetingConfig.userEmail,
      passWord: meetingConfig.passWord,
      signature: meetingConfig.signature // Generate server-side
    });
  }
}
```

## Environment Configuration

Create `.env` file:

```env
ZOOM_SDK_KEY=your_actual_sdk_key
ZOOM_SDK_SECRET=your_actual_sdk_secret
```

## Security Best Practices

1. **Never expose SDK Secret in renderer process**
2. **Use Electron's safeStorage for credentials**
3. **Generate JWT signatures server-side**
4. **Validate all meeting parameters**

## Build Configuration

Update your `package.json`:

```json
{
  "main": "dist-electron/main.js",
  "scripts": {
    "electron": "electron .",
    "electron:build": "electron-builder"
  },
  "build": {
    "appId": "com.yourcompany.presentation-control",
    "directories": {
      "output": "dist-electron"
    }
  }
}
```

## Testing

1. Set up development environment variables
2. Run `npm run dev` for web testing
3. Run `npm run electron` for Electron testing
4. Test with real Zoom meetings

## Production Deployment

1. Use proper code signing
2. Implement auto-updater
3. Set up crash reporting
4. Configure proper CSP headers
