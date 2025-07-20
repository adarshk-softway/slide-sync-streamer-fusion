
// Environment-based configuration for Zoom SDK
// In Electron app, these would come from environment variables or secure storage

export interface ZoomSDKConfig {
  sdkKey: string;
  sdkSecret: string;
  webEndpoint?: string;
  enforceGalleryView?: boolean;
  disableCORP?: boolean;
  audioPanelAlwaysOpen?: boolean;
  videoPanelAlwaysOpen?: boolean;
  shareOnDrawableCanvas?: boolean;
}

// For Electron app, replace with:
// const { ipcRenderer } = require('electron');
// const config = await ipcRenderer.invoke('get-zoom-config');

export const getZoomConfig = (): ZoomSDKConfig => {
  return {
    sdkKey: import.meta.env.VITE_ZOOM_SDK_KEY || 'your-sdk-key-here',
    sdkSecret: import.meta.env.VITE_ZOOM_SDK_SECRET || 'your-sdk-secret-here',
    webEndpoint: import.meta.env.VITE_ZOOM_WEB_ENDPOINT || 'zoom.us',
    enforceGalleryView: import.meta.env.VITE_ZOOM_ENFORCE_GALLERY_VIEW === 'true',
    disableCORP: import.meta.env.VITE_ZOOM_DISABLE_CORP === 'true',
    audioPanelAlwaysOpen: false,
    videoPanelAlwaysOpen: false,
    shareOnDrawableCanvas: false
  };
};

// Electron main process configuration (for reference)
export const electronZoomConfig = `
// In Electron main.js
const { app, ipcMain, safeStorage } = require('electron');

// Secure storage for production
ipcMain.handle('get-zoom-config', async () => {
  const encryptedKey = safeStorage.encryptString(process.env.ZOOM_SDK_KEY);
  const encryptedSecret = safeStorage.encryptString(process.env.ZOOM_SDK_SECRET);
  
  return {
    sdkKey: safeStorage.decryptString(encryptedKey),
    sdkSecret: safeStorage.decryptString(encryptedSecret),
    webEndpoint: 'zoom.us'
  };
});
`;
