import { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/Sidebar";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { NotebookPanel } from "@/components/notebook/NotebookPanel";
import { DatasetViewer } from "@/components/dataset/DatasetViewer";
import { ModelBuilder } from "@/components/model/ModelBuilder";
import { LLMCopilot } from "@/components/copilot/LLMCopilot";
import { ExperimentDashboard } from "@/components/experiments/ExperimentDashboard";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function OpenMindsIDE() {
  const [activeTab, setActiveTab] = useState("notebook");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  useEffect(() => {
    // Auto-collapse sidebar on mobile
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Main Layout */}
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Sidebar */}
        <ResizablePanel 
          defaultSize={20} 
          minSize={sidebarCollapsed ? 5 : 15} 
          maxSize={30}
          collapsible={true}
          onCollapse={() => setSidebarCollapsed(true)}
          onExpand={() => setSidebarCollapsed(false)}
          className="min-w-[50px]"
        >
          <Sidebar collapsed={sidebarCollapsed} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Main Content Area */}
        <ResizablePanel defaultSize={80}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b px-4">
              <TabsList className="mt-2">
                <TabsTrigger value="notebook">Notebook</TabsTrigger>
                <TabsTrigger value="editor">Code Editor</TabsTrigger>
                <TabsTrigger value="dataset">Dataset Viewer</TabsTrigger>
                <TabsTrigger value="model">Model Builder</TabsTrigger>
                <TabsTrigger value="experiments">Experiments</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="notebook" className="h-full">
                <ResizablePanelGroup direction="vertical" className="h-full">
                  <ResizablePanel defaultSize={70}>
                    <NotebookPanel />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={30}>
                    <LLMCopilot />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </TabsContent>
              
              <TabsContent value="editor" className="h-full">
                <EditorPanel />
              </TabsContent>
              
              <TabsContent value="dataset" className="h-full">
                <DatasetViewer />
              </TabsContent>
              
              <TabsContent value="model" className="h-full">
                <ModelBuilder />
              </TabsContent>
              
              <TabsContent value="experiments" className="h-full">
                <ExperimentDashboard />
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}