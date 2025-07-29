import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, PlusIcon, LineChartIcon, BarChart2Icon, RefreshCw, DownloadIcon, SlidersIcon } from "lucide-react";

export function ExperimentDashboard() {
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  
  // Sample experiments data
  const experiments = [
    { 
      id: "exp-001", 
      name: "MNIST_CNN_v1", 
      status: "completed", 
      model: "CNN",
      dataset: "MNIST",
      accuracy: 0.972,
      loss: 0.089,
      createdAt: "2023-07-15 14:32",
      duration: "12m 45s",
      parameters: {
        learningRate: 0.001,
        batchSize: 64,
        epochs: 10,
        optimizer: "Adam"
      },
      metrics: {
        accuracyHistory: [0.34, 0.67, 0.79, 0.85, 0.89, 0.91, 0.93, 0.94, 0.95, 0.972],
        lossHistory: [2.3, 1.4, 0.9, 0.6, 0.45, 0.32, 0.23, 0.14, 0.11, 0.089],
      }
    },
    { 
      id: "exp-002", 
      name: "CIFAR10_ResNet", 
      status: "completed", 
      model: "ResNet",
      dataset: "CIFAR-10",
      accuracy: 0.885,
      loss: 0.34,
      createdAt: "2023-07-14 09:15",
      duration: "45m 12s",
      parameters: {
        learningRate: 0.0005,
        batchSize: 32,
        epochs: 20,
        optimizer: "SGD"
      },
      metrics: {
        accuracyHistory: [0.22, 0.45, 0.56, 0.64, 0.71, 0.75, 0.79, 0.82, 0.84, 0.85, 0.86, 0.865, 0.87, 0.872, 0.875, 0.88, 0.882, 0.883, 0.884, 0.885],
        lossHistory: [2.8, 1.9, 1.4, 1.1, 0.9, 0.8, 0.7, 0.62, 0.55, 0.5, 0.47, 0.44, 0.42, 0.39, 0.38, 0.36, 0.35, 0.345, 0.342, 0.34],
      }
    },
    { 
      id: "exp-003", 
      name: "Sentiment_BERT", 
      status: "running", 
      model: "BERT",
      dataset: "IMDB Reviews",
      accuracy: 0.78,
      loss: 0.62,
      createdAt: "2023-07-18 11:05",
      duration: "1h 12m (running)",
      parameters: {
        learningRate: 0.00002,
        batchSize: 16,
        epochs: 5,
        optimizer: "AdamW"
      },
      metrics: {
        accuracyHistory: [0.51, 0.64, 0.72, 0.75, 0.78],
        lossHistory: [1.4, 0.95, 0.78, 0.68, 0.62],
      }
    },
    { 
      id: "exp-004", 
      name: "Customer_XGBoost", 
      status: "failed", 
      model: "XGBoost",
      dataset: "Customer Data",
      accuracy: 0.0,
      loss: 0.0,
      createdAt: "2023-07-17 15:45",
      duration: "0m 32s (failed)",
      parameters: {
        learningRate: 0.1,
        maxDepth: 6,
        nEstimators: 100,
      },
      error: "Memory error: Out of memory"
    },
  ];
  
  const filteredExperiments = searchQuery 
    ? experiments.filter(exp => 
        exp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        exp.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.dataset.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : experiments;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "green";
      case "running": return "blue";
      case "failed": return "red";
      default: return "gray";
    }
  };
  
  const getSelectedExperiment = () => {
    return experiments.find(exp => exp.id === selectedExperiment);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search experiments..."
              className="pl-9 h-9 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button size="sm" variant="outline">
            <RefreshIcon className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-1" /> New Experiment
          </Button>
          
          <Button size="sm" variant="outline">
            <SlidersIcon className="h-4 w-4 mr-1" /> Compare
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList>
            <TabsTrigger value="list">Experiments</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="list" className="h-full m-0 p-0">
            {/* Two-column layout for experiment list and details */}
            <div className="flex h-full">
              {/* Experiment list */}
              <div className="w-2/3 border-r">
                <ScrollArea className="h-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Dataset</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExperiments.map((experiment) => (
                        <TableRow 
                          key={experiment.id}
                          className={`cursor-pointer ${selectedExperiment === experiment.id ? 'bg-muted/50' : ''}`}
                          onClick={() => setSelectedExperiment(experiment.id)}
                        >
                          <TableCell>{experiment.name}</TableCell>
                          <TableCell>{experiment.model}</TableCell>
                          <TableCell>{experiment.dataset}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`bg-${getStatusColor(experiment.status)}-100 text-${getStatusColor(experiment.status)}-800 border-${getStatusColor(experiment.status)}-200`}
                            >
                              {experiment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {experiment.status === "completed" || experiment.status === "running"
                              ? `${(experiment.accuracy * 100).toFixed(1)}%`
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              
              {/* Experiment details */}
              <div className="w-1/3 p-4">
                {selectedExperiment ? (
                  <ExperimentDetail experiment={getSelectedExperiment()} />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <LineChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Select an experiment to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="h-full m-0 p-4">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Experiment Comparison</h2>
                <Button size="sm" variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-1" /> Export Results
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Accuracy comparison chart */}
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-[calc(100%-52px)]">
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground border rounded">
                      <div className="text-center">
                        <LineChartIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Accuracy comparison chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Loss comparison chart */}
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Loss Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-[calc(100%-52px)]">
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground border rounded">
                      <div className="text-center">
                        <LineChartIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Loss comparison chart</p>
                      </div>
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

interface Experiment {
  id: string;
  name: string;
  status: string;
  model: string;
  dataset: string;
  accuracy: number;
  loss: number;
  createdAt: string;
  duration: string;
  parameters?: Record<string, unknown>;
  metrics?: {
    accuracyHistory: number[];
    lossHistory: number[];
  };
  error?: string;
}

interface ExperimentDetailProps {
  experiment?: Experiment;
}

function ExperimentDetail({ experiment }: ExperimentDetailProps) {
  if (!experiment) return null;
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{experiment.name}</h2>
        <div className="text-sm text-muted-foreground">Created: {experiment.createdAt}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {experiment.status === "completed" || experiment.status === "running"
                ? `${(experiment.accuracy * 100).toFixed(1)}%`
                : '-'
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {experiment.status === "completed" || experiment.status === "running"
                ? experiment.loss.toFixed(3)
                : '-'
              }
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Training chart placeholder */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-[150px] flex items-center justify-center">
          <div className="h-full w-full text-center text-muted-foreground flex flex-col items-center justify-center">
            <LineChartIcon className="h-8 w-8 mb-2" />
            <div className="text-sm">Training metrics chart</div>
          </div>
        </CardContent>
      </Card>
      
      {/* Parameters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {experiment.parameters && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(experiment.parameters).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="font-medium">{key}:</div>
                  <div>{String(value)}</div>
                </React.Fragment>
              ))}
            </div>
          )}
          {experiment.error && (
            <div className="text-red-500 mt-2">Error: {experiment.error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}