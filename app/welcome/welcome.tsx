import { useState } from "react";
import { Logo } from "../components/logo";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Activity, Camera, MapPin, AlertTriangle, Eye, Settings, Zap, LogOut, Menu, Clock, X } from "lucide-react";
import { Header } from "../components/header";
import { VideoFeed } from "../components/VideoFeed";
import { apiUploadFile, runInference } from "../lib/client";

export function Welcome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [videoUrl, setVideoUrl] = useState("")
  const [streamKey, setStreamKey] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  async function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const response = await apiUploadFile("/api/video/upload", selectedFile, "file");
      console.log("Uploaded video_id:", response.video_id);
      if (response.error) {
        setUploadError(response.error);
      } else {
        const inferenceResponse = await runInference();
        if (inferenceResponse.error) {
          setUploadError(inferenceResponse.error);
        } else {
          console.log("Inference response:", inferenceResponse);
          // setVideoUrl(inferenceResponse.output_path);
          // setStreamKey(inferenceResponse.video_id);
        }
      }
    } catch (error) {
      setUploadError("Failed to upload video. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-76 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Header />
            {/* Hamburger/collapse button for sidebar (shows on all sizes except fully collapsed on desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="block lg:hidden ml-8"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { icon: Activity, label: "Dashboard", active: true },
              { icon: Camera, label: "Live Feed" },
            ].map((item) => (
              <button
                key={item.label}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${item.active 
                    ? "shadow-lg"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
                style={
                  item.active
                    ? {
                        background: "var(--rf-purple)",
                        color: "var(--primary-foreground, #fff)",
                        boxShadow: "0 2px 20px 0 rgba(102, 16, 242, 0.0)"
                      }
                    : undefined
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Basic Plan</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Up to 2 cameras • 6 zones
                <br />
                <br />
                <span className="text-xs text-muted-foreground font-bold">
                  Upgrade to Pro for more cameras and zones!
                </span>
              </p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-76 w-full min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time zone monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span>System Online</span>
              </div>
              <UserButton />
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="p-6 space-y-6">
          {/* Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          </div>
          
          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Video feed - takes 2 columns */}
            <div className="xl:col-span-2">
              {/* <VideoFeed zones={mockZones} isLive={true} /> */}
            </div>
            
            {/* Zone status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Zone Status
              </h3>
              <div className="space-y-3">
              </div>
            </div>
          </div>
          
          {/* Alerts section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">            
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                Workflow Input
              </h3>
              <form
                className="space-y-4"
                onSubmit={handleFileUpload}
                encType="multipart/form-data"
              >
                <Input
                  type="file"
                  accept="video/*"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                />
                <Button style={{ backgroundColor: "var(--rf-purple)" }} type="submit" disabled={!selectedFile || isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
                {uploadError && (
                  <p className="text-sm text-destructive">{uploadError}</p>
                )}
              </form>
            </div>
            {videoUrl && (
              <VideoFeed
                videoUrl={videoUrl}
                streamKey={streamKey}
              />
            )}
            {/* Quick stats */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Session Statistics
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Total Detections", value: "1,234", change: "+12%" },
                  { label: "Avg Response Time", value: "42ms", change: "-8%" },
                  { label: "False Positive Rate", value: "0.8%", change: "-15%" },
                  { label: "Uptime", value: "99.9%", change: "+0.1%" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-foreground">{stat.value}</span>
                      <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 