import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, FolderIcon, BrainCircuitIcon, DatabaseIcon, LineChartIcon, StarIcon, SettingsIcon } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("files");

  return (
    <div className={cn(
      "h-full flex flex-col border-r bg-muted/40",
      collapsed ? "items-center py-2" : "p-2"
    )}>
      {/* Top Icons */}
      <div className={cn(
        "flex", 
        collapsed ? "flex-col gap-3 items-center" : "flex-wrap gap-1 mb-4"
      )}>
        <SidebarButton
          icon={<FileIcon size={18} />}
          label="Files"
          active={activeSection === "files"}
          onClick={() => setActiveSection("files")}
          collapsed={collapsed}
        />
        <SidebarButton
          icon={<DatabaseIcon size={18} />}
          label="Datasets"
          active={activeSection === "datasets"}
          onClick={() => setActiveSection("datasets")}
          collapsed={collapsed}
        />
        <SidebarButton
          icon={<BrainCircuitIcon size={18} />}
          label="Models"
          active={activeSection === "models"}
          onClick={() => setActiveSection("models")}
          collapsed={collapsed}
        />
        <SidebarButton
          icon={<LineChartIcon size={18} />}
          label="Experiments"
          active={activeSection === "experiments"}
          onClick={() => setActiveSection("experiments")}
          collapsed={collapsed}
        />
        <SidebarButton
          icon={<StarIcon size={18} />}
          label="Favorites"
          active={activeSection === "favorites"}
          onClick={() => setActiveSection("favorites")}
          collapsed={collapsed}
        />
      </div>
      
      {/* Content Area */}
      <ScrollArea className="flex-1 w-full">
        {activeSection === "files" && (
          <FileExplorer collapsed={collapsed} />
        )}
        {activeSection === "datasets" && (
          <DatasetExplorer collapsed={collapsed} />
        )}
        {activeSection === "models" && (
          <ModelExplorer collapsed={collapsed} />
        )}
        {activeSection === "experiments" && (
          <ExperimentList collapsed={collapsed} />
        )}
        {activeSection === "favorites" && (
          <FavoritesList collapsed={collapsed} />
        )}
      </ScrollArea>
      
      {/* Settings at bottom */}
      <div className="mt-auto pt-2">
        <SidebarButton
          icon={<SettingsIcon size={18} />}
          label="Settings"
          active={activeSection === "settings"}
          onClick={() => setActiveSection("settings")}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
}

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

function SidebarButton({ icon, label, active, onClick, collapsed }: SidebarButtonProps) {
  return collapsed ? (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        {label}
      </TooltipContent>
    </Tooltip>
  ) : (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="justify-start w-full"
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  );
}

// File Explorer Component
function FileExplorer({ collapsed }: { collapsed: boolean }) {
  const files = [
    { type: "folder", name: "src", children: [
      { type: "file", name: "main.py" },
      { type: "file", name: "utils.py" },
    ]},
    { type: "folder", name: "notebooks", children: [
      { type: "file", name: "exploration.ipynb" },
      { type: "file", name: "model_training.ipynb" },
    ]},
    { type: "file", name: "README.md" },
    { type: "file", name: "requirements.txt" },
  ];

  if (collapsed) return null;
  
  return (
    <div className="pl-1 pr-2 py-1">
      <h3 className="text-sm font-medium mb-2">Project Files</h3>
      <FileTree files={files} level={0} />
    </div>
  );
}

// Dataset Explorer Component
function DatasetExplorer({ collapsed }: { collapsed: boolean }) {
  const datasets = [
    { name: "mnist.csv", size: "15.3 MB" },
    { name: "cifar10", size: "170.5 MB" },
    { name: "sentiment_analysis.json", size: "42.1 MB" },
    { name: "customer_data.csv", size: "8.7 MB" },
  ];
  
  if (collapsed) return null;
  
  return (
    <div className="pl-1 pr-2 py-1">
      <h3 className="text-sm font-medium mb-2">Available Datasets</h3>
      <ul className="space-y-1">
        {datasets.map((dataset) => (
          <li key={dataset.name} className="text-sm flex justify-between hover:bg-accent/50 rounded px-2 py-1 cursor-pointer">
            <span className="flex items-center">
              <DatabaseIcon size={14} className="mr-1.5 text-muted-foreground" />
              {dataset.name}
            </span>
            <span className="text-xs text-muted-foreground">{dataset.size}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Model Explorer Component
function ModelExplorer({ collapsed }: { collapsed: boolean }) {
  const models = [
    { name: "ResNet50", type: "CNN" },
    { name: "BERT-base", type: "Transformer" },
    { name: "MyCustomModel", type: "Sequential" },
    { name: "GPT-2", type: "LLM" },
  ];
  
  if (collapsed) return null;
  
  return (
    <div className="pl-1 pr-2 py-1">
      <h3 className="text-sm font-medium mb-2">Available Models</h3>
      <ul className="space-y-1">
        {models.map((model) => (
          <li key={model.name} className="text-sm flex justify-between hover:bg-accent/50 rounded px-2 py-1 cursor-pointer">
            <span className="flex items-center">
              <BrainCircuitIcon size={14} className="mr-1.5 text-muted-foreground" />
              {model.name}
            </span>
            <span className="text-xs text-muted-foreground">{model.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Experiment List Component
function ExperimentList({ collapsed }: { collapsed: boolean }) {
  const experiments = [
    { name: "MNIST_CNN_01", status: "completed", accuracy: "97.2%" },
    { name: "Sentiment_BERT", status: "running", accuracy: "-" },
    { name: "Customer_Analysis", status: "completed", accuracy: "89.5%" },
  ];
  
  if (collapsed) return null;
  
  return (
    <div className="pl-1 pr-2 py-1">
      <h3 className="text-sm font-medium mb-2">Recent Experiments</h3>
      <ul className="space-y-1">
        {experiments.map((exp) => (
          <li key={exp.name} className="text-sm flex justify-between hover:bg-accent/50 rounded px-2 py-1 cursor-pointer">
            <span className="flex items-center">
              <LineChartIcon size={14} className="mr-1.5 text-muted-foreground" />
              {exp.name}
            </span>
            <span className={cn(
              "text-xs",
              exp.status === "running" ? "text-yellow-500" : "text-green-500"
            )}>
              {exp.status === "running" ? "Running" : exp.accuracy}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Favorites List Component
function FavoritesList({ collapsed }: { collapsed: boolean }) {
  const favorites = [
    { name: "model_training.ipynb", type: "notebook" },
    { name: "mnist.csv", type: "dataset" },
    { name: "MyCustomModel", type: "model" },
    { name: "utils.py", type: "file" },
  ];
  
  if (collapsed) return null;
  
  return (
    <div className="pl-1 pr-2 py-1">
      <h3 className="text-sm font-medium mb-2">Favorites</h3>
      <ul className="space-y-1">
        {favorites.map((item) => (
          <li key={item.name} className="text-sm flex justify-between hover:bg-accent/50 rounded px-2 py-1 cursor-pointer">
            <span className="flex items-center">
              <StarIcon size={14} className="mr-1.5 text-yellow-500" />
              {item.name}
            </span>
            <span className="text-xs text-muted-foreground">{item.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// FileTree Component
interface FileItemProps {
  type: "file" | "folder";
  name: string;
  children?: FileItemProps[];
}

function FileTree({ files, level }: { files: FileItemProps[], level: number }) {
  return (
    <ul className={cn("space-y-1", level > 0 ? "ml-3 border-l pl-2" : "")}>
      {files.map((file) => (
        <li key={file.name} className="text-sm">
          <div className="flex items-center hover:bg-accent/50 rounded px-1 py-0.5 cursor-pointer">
            {file.type === "folder" ? (
              <FolderIcon size={14} className="mr-1.5 text-blue-500" />
            ) : (
              <FileIcon size={14} className="mr-1.5 text-muted-foreground" />
            )}
            <span>{file.name}</span>
          </div>
          {file.type === "folder" && file.children && (
            <FileTree files={file.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}