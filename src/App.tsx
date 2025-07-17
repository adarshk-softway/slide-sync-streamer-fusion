
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
      <Card className="max-w-2xl w-full p-8 text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Presentation Control System</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive web prototype for Electron-based presentation control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/presenter">
            <Button className="w-full h-24 text-lg">
              Presenter Interface
              <div className="text-sm font-normal mt-1">
                Video processing & Zoom
              </div>
            </Button>
          </Link>

          <Link to="/audience">
            <Button className="w-full h-24 text-lg" variant="secondary">
              Audience Interface
              <div className="text-sm font-normal mt-1">
                Dual display simulation
              </div>
            </Button>
          </Link>

          <Link to="/tablet">
            <Button className="w-full h-24 text-lg" variant="outline">
              Tablet Interface
              <div className="text-sm font-normal mt-1">
                Remote control & monitoring
              </div>
            </Button>
          </Link>
        </div>

        <div className="text-left space-y-4 mt-8">
          <h2 className="text-xl font-semibold">Features Demonstrated:</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✅ React component architecture for Electron renderer</li>
            <li>✅ Zoom Video SDK integration patterns</li>
            <li>✅ Canvas-based video processing (BodyPix simulation)</li>
            <li>✅ WebSocket communication for device control</li>
            <li>✅ Media player with remote control capabilities</li>
            <li>✅ Real-time thumbnail generation and updates</li>
            <li>✅ Modular, reusable component structure</li>
          </ul>
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
