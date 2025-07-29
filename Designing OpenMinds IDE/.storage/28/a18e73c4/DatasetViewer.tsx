import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon, DownloadIcon, RefreshCw, BarChart2Icon, TableIcon, FilterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DatasetViewer() {
  const [activeTab, setActiveTab] = useState("table");
  const [activeDataset, setActiveDataset] = useState("mnist");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  
  // Sample dataset options
  const datasets = [
    { id: "mnist", name: "MNIST", rows: 70000, columns: 785, type: "Image Classification" },
    { id: "cifar10", name: "CIFAR-10", rows: 60000, columns: 3073, type: "Image Classification" },
    { id: "customer_data", name: "Customer Data", rows: 10000, columns: 15, type: "Tabular" },
    { id: "sentiment", name: "Sentiment Analysis", rows: 25000, columns: 3, type: "Text" },
  ];
  
  // Sample dataset data (for MNIST)
  const sampleData = {
    columns: ["id", "pixel1", "pixel2", "pixel3", "pixel4", "pixel5", "pixel6", "label"],
    rows: [
      [1, 0, 0, 0, 10, 12, 5, 5],
      [2, 0, 0, 8, 16, 9, 0, 0],
      [3, 0, 0, 0, 0, 5, 14, 1],
      [4, 0, 3, 10, 9, 5, 0, 9],
      [5, 0, 0, 0, 5, 12, 8, 3],
      [6, 0, 0, 0, 0, 0, 0, 6],
      [7, 0, 0, 7, 15, 13, 1, 8],
      [8, 0, 0, 0, 8, 13, 11, 2],
      [9, 0, 0, 0, 0, 10, 14, 7],
      [10, 0, 5, 12, 9, 2, 0, 4],
    ]
  };
  
  // Sample dataset statistics
  const datasetStats = {
    mnist: [
      { stat: "Mean", value: "0.1307" },
      { stat: "Std Dev", value: "0.3081" },
      { stat: "Min", value: "0" },
      { stat: "Max", value: "255" },
      { stat: "Missing Values", value: "0" },
      { stat: "Label Distribution", value: "Balanced" },
    ],
    cifar10: [
      { stat: "Mean", value: "0.4734" },
      { stat: "Std Dev", value: "0.2516" },
      { stat: "Min", value: "0" },
      { stat: "Max", value: "255" },
      { stat: "Missing Values", value: "0" },
      { stat: "Label Distribution", value: "Balanced" },
    ],
    customer_data: [
      { stat: "Mean Age", value: "34.6" },
      { stat: "Income Range", value: "$24k - $105k" },
      { stat: "Missing Values", value: "156" },
      { stat: "Categorical Features", value: "5" },
      { stat: "Numerical Features", value: "10" },
      { stat: "Target Distribution", value: "Imbalanced" },
    ],
    sentiment: [
      { stat: "Avg. Word Count", value: "87.3" },
      { stat: "Vocabulary Size", value: "24,987" },
      { stat: "Missing Values", value: "0" },
      { stat: "Sentiment Distribution", value: "Balanced" },
      { stat: "Languages", value: "English" },
      { stat: "Data Source", value: "IMDB Reviews" },
    ],
  };
  
  const currentDataset = datasets.find(d => d.id === activeDataset) || datasets[0];
  const currentStats = datasetStats[activeDataset as keyof typeof datasetStats] || [];
  
  return (
    <div className="flex flex-col h-full">
      {/* Dataset toolbar */}
      <div className="border-b p-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select value={activeDataset} onValueChange={setActiveDataset}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasets.map((dataset) => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-sm font-medium">
            {currentDataset.rows.toLocaleString()} rows × {currentDataset.columns} columns
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              className="pl-9 h-9 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button size="sm" variant="outline">
            <FilterIcon className="h-4 w-4 mr-1" /> Filter
          </Button>
          
          <Button size="sm" variant="outline">
            <DownloadIcon className="h-4 w-4 mr-1" /> Export
          </Button>
          
          <Button size="sm" variant="ghost">
            <RefreshIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Dataset view tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList>
            <TabsTrigger value="table">
              <TableIcon className="h-4 w-4 mr-1" /> Table View
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart2Icon className="h-4 w-4 mr-1" /> Statistics
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Dataset views */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="table" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {sampleData.columns.map((col, i) => (
                        <TableHead key={i} className={i === 0 ? "w-[80px]" : ""}>
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleData.rows.map((row, i) => (
                      <TableRow key={i}>
                        {row.map((cell, j) => (
                          <TableCell key={j}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing 1-10 of {currentDataset.rows.toLocaleString()} entries
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="stats" className="h-full m-0 overflow-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">{currentDataset.name} Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Dataset summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Dataset Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Dataset:</div>
                        <div>{currentDataset.name}</div>
                        
                        <div className="font-medium">Type:</div>
                        <div>{currentDataset.type}</div>
                        
                        <div className="font-medium">Size:</div>
                        <div>{currentDataset.rows.toLocaleString()} rows</div>
                        
                        <div className="font-medium">Features:</div>
                        <div>{currentDataset.columns - 1}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Statistics */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Statistical Measures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="grid grid-cols-2 gap-1">
                        {currentStats.slice(0, 6).map((stat, i) => (
                          <React.Fragment key={i}>
                            <div className="font-medium">{stat.stat}:</div>
                            <div>{stat.value}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Distribution Chart Placeholder */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Label Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="h-[150px] w-full text-center text-muted-foreground flex flex-col items-center justify-center border rounded">
                      <BarChart2Icon className="h-8 w-8 mb-2" />
                      <div className="text-sm">Chart visualization would appear here</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}