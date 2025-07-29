import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlayIcon, PlusIcon, PauseIcon, SaveIcon, TrashIcon, CodeIcon, TextIcon } from "lucide-react";

export function NotebookPanel() {
  const [cells, setCells] = useState<NotebookCell[]>([
    { id: "cell-1", type: "markdown", content: "# Welcome to OpenMinds Notebook\n\nThis is a markdown cell where you can write documentation.", isExecuting: false, output: null },
    { id: "cell-2", type: "code", content: "import numpy as np\nimport pandas as pd\n\n# Create a sample dataframe\ndf = pd.DataFrame({\n    'A': np.random.rand(5),\n    'B': np.random.rand(5),\n    'C': np.random.rand(5)\n})\n\ndf", isExecuting: false, output: "DataFrame output would appear here" },
    { id: "cell-3", type: "code", content: "# Plot the data\nimport matplotlib.pyplot as plt\n\nplt.figure(figsize=(8, 4))\nplt.plot(df['A'], label='A')\nplt.plot(df['B'], label='B')\nplt.plot(df['C'], label='C')\nplt.legend()\nplt.title('Sample Data Plot')\nplt.show()", isExecuting: false, output: "[Plot visualization would appear here]" },
  ]);
  
  const [activeCell, setActiveCell] = useState<string>("cell-1");
  const [executionStatus, setExecutionStatus] = useState<"idle" | "running">("idle");
  
  const handleAddCell = (type: "code" | "markdown") => {
    const newCell: NotebookCell = {
      id: `cell-${Date.now()}`,
      type,
      content: type === "code" ? "# Enter your code here" : "## New markdown cell",
      isExecuting: false,
      output: null
    };
    
    setCells([...cells, newCell]);
    setActiveCell(newCell.id);
  };
  
  const handleDeleteCell = (id: string) => {
    if (cells.length > 1) {
      const newCells = cells.filter(cell => cell.id !== id);
      setCells(newCells);
      
      // Set active cell to the one above or the first if deleted cell was the first
      const index = cells.findIndex(cell => cell.id === id);
      const newActiveIndex = Math.max(0, index - 1);
      setActiveCell(newCells[newActiveIndex].id);
    }
  };
  
  const handleCellContentChange = (id: string, content: string) => {
    setCells(cells.map(cell => 
      cell.id === id ? { ...cell, content } : cell
    ));
  };
  
  const handleCellTypeChange = (id: string, type: "code" | "markdown") => {
    setCells(cells.map(cell =>
      cell.id === id ? { ...cell, type } : cell
    ));
  };
  
  const handleExecuteCell = (id: string) => {
    // Set cell as executing
    setCells(cells.map(cell =>
      cell.id === id ? { ...cell, isExecuting: true } : cell
    ));
    
    // Simulate execution (in a real app, this would send the code to a backend)
    setTimeout(() => {
      setCells(cells.map(cell =>
        cell.id === id ? {
          ...cell,
          isExecuting: false,
          output: "Execution result would appear here.\nIn a real application, this would be the output from the server."
        } : cell
      ));
    }, 1000);
  };
  
  const handleRunAllCells = () => {
    setExecutionStatus("running");
    
    // Mark all cells as executing
    setCells(cells.map(cell => ({ ...cell, isExecuting: true })));
    
    // Simulate execution for all cells sequentially
    let delay = 0;
    cells.forEach(cell => {
      if (cell.type === "code") {
        delay += 1000;
        setTimeout(() => {
          setCells(prevCells => prevCells.map(c =>
            c.id === cell.id ? {
              ...c,
              isExecuting: false,
              output: `Execution result for ${cell.id} would appear here.`
            } : c
          ));
          
          // Check if all cells are finished
          if (cell.id === cells[cells.length - 1].id) {
            setExecutionStatus("idle");
          }
        }, delay);
      } else {
        // For markdown cells, just mark as not executing
        setTimeout(() => {
          setCells(prevCells => prevCells.map(c =>
            c.id === cell.id ? { ...c, isExecuting: false } : c
          ));
        }, delay);
      }
    });
  };
  
  return (
    <div className="flex flex-col h-full border-r">
      {/* Notebook toolbar */}
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant={executionStatus === "idle" ? "default" : "destructive"}
            onClick={executionStatus === "idle" ? handleRunAllCells : () => setExecutionStatus("idle")}
          >
            {executionStatus === "idle" ? (
              <>
                <PlayIcon className="h-4 w-4 mr-1" /> Run All
              </>
            ) : (
              <>
                <PauseIcon className="h-4 w-4 mr-1" /> Stop
              </>
            )}
          </Button>
          
          <Button size="sm" variant="outline">
            <SaveIcon className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleAddCell("markdown")}
          >
            <TextIcon className="h-4 w-4 mr-1" /> Add Text
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleAddCell("code")}
          >
            <CodeIcon className="h-4 w-4 mr-1" /> Add Code
          </Button>
        </div>
      </div>
      
      {/* Notebook content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {cells.map((cell) => (
            <NotebookCell
              key={cell.id}
              cell={cell}
              isActive={activeCell === cell.id}
              onActivate={() => setActiveCell(cell.id)}
              onContentChange={(content) => handleCellContentChange(cell.id, content)}
              onTypeChange={(type) => handleCellTypeChange(cell.id, type)}
              onExecute={() => handleExecuteCell(cell.id)}
              onDelete={() => handleDeleteCell(cell.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface NotebookCell {
  id: string;
  type: "code" | "markdown";
  content: string;
  isExecuting: boolean;
  output: string | null;
}

interface NotebookCellProps {
  cell: NotebookCell;
  isActive: boolean;
  onActivate: () => void;
  onContentChange: (content: string) => void;
  onTypeChange: (type: "code" | "markdown") => void;
  onExecute: () => void;
  onDelete: () => void;
}

function NotebookCell({ 
  cell, 
  isActive, 
  onActivate,
  onContentChange,
  onTypeChange,
  onExecute,
  onDelete
}: NotebookCellProps) {
  return (
    <Card 
      className={`border ${isActive ? "ring-2 ring-primary/50" : ""}`}
      onClick={onActivate}
    >
      <div className="p-2">
        {/* Cell toolbar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1">
            <Tabs 
              value={cell.type} 
              onValueChange={(value) => onTypeChange(value as "code" | "markdown")}
              className="h-7"
            >
              <TabsList className="h-7">
                <TabsTrigger value="code" className="h-6 px-2 py-0">Code</TabsTrigger>
                <TabsTrigger value="markdown" className="h-6 px-2 py-0">Markdown</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex gap-1">
            {cell.type === "code" && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2"
                onClick={(e) => { 
                  e.stopPropagation();
                  onExecute();
                }}
                disabled={cell.isExecuting}
              >
                <PlayIcon className="h-4 w-4" />
              </Button>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 px-2"
              onClick={(e) => { 
                e.stopPropagation();
                onDelete();
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Cell input */}
        <div className="min-h-[100px] bg-muted/40 rounded-md p-2 font-mono text-sm">
          <textarea
            className="w-full min-h-[100px] bg-transparent outline-none resize-none"
            value={cell.content}
            onChange={(e) => onContentChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder={cell.type === "code" ? "Enter your code..." : "Enter markdown..."}
          />
        </div>
        
        {/* Cell output (only for code cells) */}
        {cell.type === "code" && cell.output && (
          <>
            <Separator className="my-2" />
            <div className="bg-muted/20 rounded-md p-2 text-sm">
              <pre className="whitespace-pre-wrap">{cell.output}</pre>
            </div>
          </>
        )}
        
        {/* Executing indicator */}
        {cell.isExecuting && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <div className="animate-pulse h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
            Executing...
          </div>
        )}
      </div>
    </Card>
  );
}