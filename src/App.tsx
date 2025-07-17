
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { PresenterInterface } from "./components/PresenterInterface";
import { AudienceInterface } from "./components/AudienceInterface";
import { TabletInterface } from "./components/TabletInterface";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";

const queryClient = new QueryClient();

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-4xl w-full p-8 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Presentation Control System</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive web prototype for Electron-based presentation control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/presenter" className="block">
            <Button className="w-full h-32 flex flex-col items-center justify-center space-y-2 text-base">
              <span className="font-semibold">Presenter Interface</span>
              <span className="text-sm font-normal opacity-90">
                Video processing & Zoom
              </span>
            </Button>
          </Link>

          <Link to="/audience" className="block">
            <Button className="w-full h-32 flex flex-col items-center justify-center space-y-2 text-base" variant="secondary">
              <span className="font-semibold">Audience Interface</span>
              <span className="text-sm font-normal opacity-90">
                Dual display simulation
              </span>
            </Button>
          </Link>

          <Link to="/tablet" className="block">
            <Button className="w-full h-32 flex flex-col items-center justify-center space-y-2 text-base" variant="outline">
              <span className="font-semibold">Tablet Interface</span>
              <span className="text-sm font-normal opacity-90">
                Remote control & monitoring
              </span>
            </Button>
          </Link>
        </div>

        <div className="text-left space-y-6 mt-12">
          <h2 className="text-2xl font-semibold text-foreground">Features Demonstrated:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-muted-foreground">React component architecture for Electron renderer</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-muted-foreground">Zoom Video SDK integration patterns</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-muted-foreground">Canvas-based video processing (BodyPix simulation)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-muted-foreground">WebSocket communication for device control</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-muted-foreground">Media player with remote control capabilities</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-muted-foreground">Real-time thumbnail generation and updates</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-muted-foreground">Modular, reusable component structure</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/presenter" element={<PresenterInterface />} />
          <Route path="/audience" element={<AudienceInterface />} />
          <Route path="/tablet" element={<TabletInterface />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
