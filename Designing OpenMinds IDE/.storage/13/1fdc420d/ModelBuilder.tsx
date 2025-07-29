import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaveIcon, PlayIcon, PlusIcon, XIcon, MoveIcon, EyeIcon, CodeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LayerConfig {
  [key: string]: any;
}

interface ModelLayer {
  id: string;
  type: string;
  name: string;
  config: LayerConfig;
}

export function ModelBuilder() {
  const [activeTab, setActiveTab] = useState("visual");
  const [modelName, setModelName] = useState("My Custom Model");
  const [layers, setLayers] = useState<ModelLayer[]>([
    { id: "layer-1", type: "input", name: "Input", config: { shape: [28, 28, 1] } },
    { id: "layer-2", type: "conv2d", name: "Conv2D", config: { filters: 32, kernelSize: 3, activation: "relu" } },
    { id: "layer-3", type: "maxpooling2d", name: "MaxPooling2D", config: { poolSize: 2 } },
    { id: "layer-4", type: "conv2d", name: "Conv2D", config: { filters: 64, kernelSize: 3, activation: "relu" } },
    { id: "layer-5", type: "maxpooling2d", name: "MaxPooling2D", config: { poolSize: 2 } },
    { id: "layer-6", type: "flatten", name: "Flatten", config: {} },
    { id: "layer-7", type: "dense", name: "Dense", config: { units: 128, activation: "relu" } },
    { id: "layer-8", type: "dropout", name: "Dropout", config: { rate: 0.5 } },
    { id: "layer-9", type: "dense", name: "Dense", config: { units: 10, activation: "softmax" } },
  ]);
  
  const [draggingLayer, setDraggingLayer] = useState<ModelLayer | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  
  const layerTypes = [
    { type: "input", name: "Input", category: "Core" },
    { type: "dense", name: "Dense", category: "Core" },
    { type: "dropout", name: "Dropout", category: "Core" },
    { type: "flatten", name: "Flatten", category: "Core" },
    { type: "conv2d", name: "Conv2D", category: "Convolutional" },
    { type: "maxpooling2d", name: "MaxPooling2D", category: "Convolutional" },
    { type: "lstm", name: "LSTM", category: "Recurrent" },
    { type: "gru", name: "GRU", category: "Recurrent" },
    { type: "batchnormalization", name: "BatchNormalization", category: "Normalization" },
  ];
  
  const getDefaultConfigForLayerType = (type: string): LayerConfig => {
    switch (type) {
      case "input":
        return { shape: [28, 28, 1] };
      case "dense":
        return { units: 64, activation: "relu" };
      case "dropout":
        return { rate: 0.2 };
      case "flatten":
        return {};
      case "conv2d":
        return { filters: 32, kernelSize: 3, activation: "relu" };
      case "maxpooling2d":
        return { poolSize: 2 };
      case "lstm":
        return { units: 64, returnSequences: true };
      case "gru":
        return { units: 64, returnSequences: true };
      case "batchnormalization":
        return {};
      default:
        return {};
    }
  };
  
  const getLayerDescription = (layer: ModelLayer): string => {
    switch (layer.type) {
      case "input":
        return `Shape: [${layer.config.shape.join(", ")}]`;
      case "dense":
        return `Units: ${layer.config.units}, Activation: ${layer.config.activation}`;
      case "dropout":
        return `Rate: ${layer.config.rate}`;
      case "flatten":
        return `Flatten input`;
      case "conv2d":
        return `Filters: ${layer.config.filters}, Kernel: ${layer.config.kernelSize}×${layer.config.kernelSize}`;
      case "maxpooling2d":
        return `Pool size: ${layer.config.poolSize}×${layer.config.poolSize}`;
      case "lstm":
        return `Units: ${layer.config.units}`;
      case "gru":
        return `Units: ${layer.config.units}`;
      case "batchnormalization":
        return `Batch normalization`;
      default:
        return "";
    }
  };
  
  const addLayer = (type: string) => {
    const layerInfo = layerTypes.find(l => l.type === type) || layerTypes[0];
    const newLayer: ModelLayer = {
      id: `layer-${Date.now()}`,
      type,
      name: layerInfo.name,
      config: getDefaultConfigForLayerType(type),
    };
    setLayers([...layers, newLayer]);
  };
  
  const removeLayer = (id: string) => {
    setLayers(layers.filter(layer => layer.id !== id));
  };
  
  const handleDragStart = (layer: ModelLayer) => {
    setDraggingLayer(layer);
  };
  
  const handleDragOver = (index: number) => {
    setDropTarget(index);
  };
  
  const handleDrop = (targetIndex: number) => {
    if (!draggingLayer) return;
    
    const currentIndex = layers.findIndex(layer => layer.id === draggingLayer.id);
    if (currentIndex === -1) return;
    
    // Create new array with layer moved to the target position
    const newLayers = [...layers];
    const [removed] = newLayers.splice(currentIndex, 1);
    newLayers.splice(targetIndex, 0, removed);
    
    setLayers(newLayers);
    setDraggingLayer(null);
    setDropTarget(null);
  };
  
  const generateModelCode = () => {
    // Generate Python code for the model
    return `import tensorflow as tf
from tensorflow.keras import layers, models

def create_model():
    model = models.Sequential()
    ${layers.map(layer => {
      switch (layer.type) {
        case 'input':
          return `    model.add(layers.Input(shape=(${layer.config.shape.join(', ')})))`;
        case 'dense':
          return `    model.add(layers.Dense(${layer.config.units}, activation='${layer.config.activation}'))`;
        case 'dropout':
          return `    model.add(layers.Dropout(${layer.config.rate}))`;
        case 'flatten':
          return `    model.add(layers.Flatten())`;
        case 'conv2d':
          return `    model.add(layers.Conv2D(${layer.config.filters}, (${layer.config.kernelSize}, ${layer.config.kernelSize}), activation='${layer.config.activation}'))`;
        case 'maxpooling2d':
          return `    model.add(layers.MaxPooling2D((${layer.config.poolSize}, ${layer.config.poolSize})))`;
        default:
          return `    # Layer: ${layer.name}`;
      }
    }).join('\n')}
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

model = create_model()
model.summary()`;
  };
  
  return (
    <div className="flex h-full">
      {/* Left sidebar - Layer palette */}
      <div className="w-[220px] border-r p-4 flex flex-col">
        <h3 className="font-medium mb-3">Add Layers</h3>
        
        <div className="space-y-4">
          {["Core", "Convolutional", "Recurrent", "Normalization"].map(category => (
            <div key={category}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                {category}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {layerTypes
                  .filter(layer => layer.category === category)
                  .map(layer => (
                    <Button 
                      key={layer.type} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start h-auto py-1.5 text-xs"
                      onClick={() => addLayer(layer.type)}
                    >
                      <span className="truncate">{layer.name}</span>
                    </Button>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b p-2">
          <div className="flex items-center gap-2">
            <Input 
              value={modelName} 
              onChange={(e) => setModelName(e.target.value)}
              className="w-[250px] h-8"
              placeholder="Model name"
            />
            
            <Button size="sm" variant="outline">
              <SaveIcon className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button size="sm" variant="outline">
              <PlayIcon className="h-4 w-4 mr-1" /> Train
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="visual" className="h-full m-0">
            <div className="flex h-full">
              {/* Model layers list */}
              <div className="flex-1 p-4">
                <h3 className="font-medium mb-3">Model Structure</h3>
                <ScrollArea className="h-[calc(100%-30px)]">
                  <div className="space-y-2">
                    {layers.map((layer, index) => (
                      <div key={layer.id}>
                        {dropTarget === index && (
                          <div className="h-1 bg-primary rounded my-1"></div>
                        )}
                        <Card 
                          className={`border ${draggingLayer?.id === layer.id ? 'opacity-50' : ''}`}
                          draggable
                          onDragStart={() => handleDragStart(layer)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            handleDragOver(index);
                          }}
                          onDrop={() => handleDrop(index)}
                        >
                          <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="cursor-move text-muted-foreground">
                                <MoveIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{layer.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {getLayerDescription(layer)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => {}} // This would open the layer config panel
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => removeLayer(layer.id)}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                        {index === layers.length - 1 && dropTarget === layers.length && (
                          <div className="h-1 bg-primary rounded my-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Right panel - Layer properties */}
              <div className="w-[300px] border-l p-4 flex flex-col">
                <h3 className="font-medium mb-3">Layer Properties</h3>
                <div className="text-sm text-muted-foreground">
                  Select a layer to edit its properties.
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="h-full m-0">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Generated Model Code</h3>
                <Button size="sm" variant="outline">
                  <CodeIcon className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>
              <Card className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <pre className="p-4 font-mono text-sm whitespace-pre">
                    {generateModelCode()}
                  </pre>
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>
        </div>
      </div>
    </div>
  );
}