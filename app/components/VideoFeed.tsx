import { Camera, Maximize2, Settings2, Wifi } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";


interface VideoFeedProps {
  isLive?: boolean;
  resolution?: string;
  model?: string;
  latency?: string;
}

export function VideoFeed({ isLive = true, resolution = "1920x1080", model = "yolov8n", latency = "42ms" }: VideoFeedProps) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-border/90">
        <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Live Feed</span>
                {isLive && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    LIVE
                </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
      
        <div className="relative aspect-video bg-background/50 bg-grid">
            {/* Simulated video feed with zone overlays */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <Wifi className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">Connecting to camera feed...</p>
                </div>
            </div>
            <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{resolution} @ 30fps</span>
                <span className="font-mono">Latency: {latency}</span>
                <span className="font-mono">Model: {model}</span>
            </div>
        </div>
    </div>
  );
}
