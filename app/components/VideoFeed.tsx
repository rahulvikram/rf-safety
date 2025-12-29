import { Camera, Maximize2, Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";


interface VideoFeedProps {
  videoUrl?: string;
  streamKey?: string;
}

export function VideoFeed({ videoUrl = "", streamKey = "" }: VideoFeedProps) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-border/90">
        <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Video Feed</span>
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
                    {/* video feed */}
                    <img 
                        key={streamKey}
                        src={videoUrl} 
                        alt="Video stream" 
                        className="w-full h-full object-cover" 
                    />
                </div>
            </div>
            <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">Video Feed</span>
            </div>
        </div>
    </div>
  );
}
