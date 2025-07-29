import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaveIcon, PlayIcon, FolderIcon, SettingsIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EditorPanel() {
  const [activeTab, setActiveTab] = useState("main.py");
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  
  const files = [
    { name: "main.py", language: "python", content: "import numpy as np\nimport pandas as pd\n\ndef process_data(data):\n    \"\"\"\n    Process the input data\n    \"\"\"\n    # Normalize the data\n    normalized = (data - data.mean()) / data.std()\n    \n    # Remove outliers\n    q1 = normalized.quantile(0.25)\n    q3 = normalized.quantile(0.75)\n    iqr = q3 - q1\n    cleaned = normalized[~((normalized < (q1 - 1.5 * iqr)) | (normalized > (q3 + 1.5 * iqr))).any(axis=1)]\n    \n    return cleaned\n\n# Example usage\nif __name__ == \"__main__\":\n    # Load sample data\n    df = pd.DataFrame({\n        'A': np.random.rand(100),\n        'B': np.random.rand(100),\n        'C': np.random.rand(100)\n    })\n    \n    processed = process_data(df)\n    print(f\"Original shape: {df.shape}, Processed shape: {processed.shape}\")" },
    { name: "utils.py", language: "python", content: "def load_dataset(path):\n    \"\"\"\n    Load a dataset from the given path\n    \"\"\"\n    # Implementation would go here\n    pass\n\ndef save_results(results, path):\n    \"\"\"\n    Save results to the given path\n    \"\"\"\n    # Implementation would go here\n    pass\n\ndef calculate_metrics(true_values, predictions):\n    \"\"\"\n    Calculate evaluation metrics\n    \"\"\"\n    # Implementation would go here\n    pass" },
    { name: "config.json", language: "json", content: "{\n    \"model\": {\n        \"name\": \"custom_model\",\n        \"layers\": [\n            {\"type\": \"dense\", \"units\": 128, \"activation\": \"relu\"},\n            {\"type\": \"dropout\", \"rate\": 0.2},\n            {\"type\": \"dense\", \"units\": 64, \"activation\": \"relu\"},\n            {\"type\": \"dropout\", \"rate\": 0.2},\n            {\"type\": \"dense\", \"units\": 10, \"activation\": \"softmax\"}\n        ]\n    },\n    \"training\": {\n        \"epochs\": 20,\n        \"batch_size\": 64,\n        \"learning_rate\": 0.001,\n        \"optimizer\": \"adam\",\n        \"loss\": \"categorical_crossentropy\"\n    },\n    \"data\": {\n        \"train_path\": \"data/train.csv\",\n        \"test_path\": \"data/test.csv\",\n        \"validation_split\": 0.1\n    }\n}" },
  ];
  
  const getFileByName = (name: string) => {
    return files.find(file => file.name === name) || files[0];
  };
  
  const currentFile = getFileByName(activeTab);
  
  const handleSave = () => {
    // In a real app, this would save the file to the server
    console.log("Saving file:", activeTab);
  };
  
  const handleRun = () => {
    // In a real app, this would execute the file on the server
    console.log("Running file:", activeTab);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleSave}>
            <SaveIcon className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleRun}>
            <PlayIcon className="h-4 w-4 mr-1" /> Run
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[110px] h-8">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vs-dark">Dark</SelectItem>
              <SelectItem value="vs-light">Light</SelectItem>
              <SelectItem value="monokai">Monokai</SelectItem>
            </SelectContent>
          </Select>
          
          <Button size="icon" variant="ghost">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Tab bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <div className="flex items-center">
            <TabsList className="bg-background h-9">
              {files.map((file) => (
                <TabsTrigger key={file.name} value={file.name} className="px-4 py-1.5 h-9">
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button size="icon" variant="ghost" className="h-9 w-9 ml-2">
              <FolderIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Editor content */}
        <div className="flex-1 overflow-hidden">
          {files.map((file) => (
            <TabsContent key={file.name} value={file.name} className="h-full m-0">
              <EditorPane
                content={file.content}
                language={file.language}
                theme={theme}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

interface EditorPaneProps {
  content: string;
  language: string;
  theme: string;
}

function EditorPane({ content, language, theme }: EditorPaneProps) {
  // In a real app, this would use a code editor like Monaco Editor
  return (
    <ScrollArea className="h-full">
      <pre className="p-4 font-mono text-sm whitespace-pre-wrap bg-muted/30">
        {content}
      </pre>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        {language}
      </div>
    </ScrollArea>
  );
}