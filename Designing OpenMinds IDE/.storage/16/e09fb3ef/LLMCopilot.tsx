import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SendIcon, Code2Icon, PlusIcon, RefreshIcon, SaveIcon, TrashIcon, UserIcon, BrainCircuitIcon } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export function LLMCopilot() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [activeConversation, setActiveConversation] = useState("conversation-1");
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conversation-1",
      title: "Model Training Help",
      messages: [
        {
          id: "msg-1",
          role: "user",
          content: "How can I improve my model's accuracy for image classification?",
          timestamp: "10:23 AM"
        },
        {
          id: "msg-2",
          role: "assistant",
          content: "There are several approaches you can try:\n\n1. **Data augmentation**: Add rotated, flipped, or slightly distorted versions of your images to increase your training set size and variety.\n\n2. **Transfer learning**: Start with a pre-trained model like ResNet or EfficientNet and fine-tune it for your specific task.\n\n3. **Hyperparameter tuning**: Experiment with learning rates, batch sizes, and optimizer settings.\n\n4. **Architecture changes**: Add or remove layers, adjust layer sizes, or try different activation functions.\n\nWould you like me to help with implementing any of these approaches?",
          timestamp: "10:24 AM"
        }
      ],
      createdAt: "Today, 10:23 AM"
    },
    {
      id: "conversation-2",
      title: "LSTM Implementation",
      messages: [
        {
          id: "msg-3",
          role: "user",
          content: "Can you show me how to implement an LSTM network for time series prediction?",
          timestamp: "Yesterday, 2:45 PM"
        },
        {
          id: "msg-4",
          role: "assistant",
          content: "Here's a simple LSTM implementation for time series prediction using TensorFlow/Keras:\n\n```python\nimport numpy as np\nimport tensorflow as tf\nfrom tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import LSTM, Dense\n\n# Prepare your data\ndef create_dataset(data, time_steps=1):\n    X, y = [], []\n    for i in range(len(data) - time_steps):\n        X.append(data[i:(i + time_steps), :])\n        y.append(data[i + time_steps, 0])\n    return np.array(X), np.array(y)\n\n# Build the LSTM model\ndef build_lstm_model(input_shape):\n    model = Sequential()\n    model.add(LSTM(50, return_sequences=True, input_shape=input_shape))\n    model.add(LSTM(50))\n    model.add(Dense(1))\n    model.compile(optimizer='adam', loss='mse')\n    return model\n\n# Example usage\ntime_steps = 10\nfeatures = 1\nmodel = build_lstm_model((time_steps, features))\n\n# Train the model\n# model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.1)\n```\n\nYou'll need to adjust the hyperparameters based on your specific dataset and requirements. Would you like me to explain any part of this implementation in more detail?",
          timestamp: "Yesterday, 2:47 PM"
        }
      ],
      createdAt: "Yesterday, 2:45 PM"
    }
  ]);
  
  const [prompts, setPrompts] = useState([
    { id: "prompt-1", title: "Data Analysis", content: "Analyze the dataset and provide key insights on..." },
    { id: "prompt-2", title: "Model Evaluation", content: "Evaluate the model performance and suggest improvements for..." },
    { id: "prompt-3", title: "Code Review", content: "Review this code and suggest optimizations for..." }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConversation = conversations.find(conv => conv.id === activeConversation) || conversations[0];
  
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Update conversation with user message
    setConversations(conversations.map(conv => 
      conv.id === activeConversation 
        ? { ...conv, messages: [...conv.messages, userMessage] } 
        : conv
    ));
    
    setInput("");
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: "This is a simulated response. In a real application, this would be a response from an LLM API like OpenAI's GPT or similar.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversations(conversations.map(conv => 
        conv.id === activeConversation 
          ? { ...conv, messages: [...conv.messages, userMessage, assistantMessage] } 
          : conv
      ));
    }, 1000);
  };
  
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: `conversation-${Date.now()}`,
      title: "New Conversation",
      messages: [],
      createdAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    
    setConversations([...conversations, newConversation]);
    setActiveConversation(newConversation.id);
  };
  
  return (
    <div className="flex flex-col h-full border-t">
      {/* Copilot toolbar */}
      <div className="flex items-center justify-between border-b p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="prompts">Saved Prompts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Copilot content */}
      <div className="flex-1 overflow-hidden">
        <TabsContent value="chat" className="h-full m-0 flex">
          {/* Conversation list sidebar */}
          <div className="w-[200px] border-r h-full flex flex-col">
            <div className="p-2 border-b flex justify-between items-center">
              <h3 className="text-sm font-medium">Conversations</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={createNewConversation}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {conversations.map(conversation => (
                  <Button
                    key={conversation.id}
                    variant={activeConversation === conversation.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto py-2 text-left"
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="truncate">
                      <div className="font-medium text-sm truncate">{conversation.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {conversation.messages.length > 0 
                          ? conversation.messages[conversation.messages.length - 1].content.substring(0, 20) + "..."
                          : "No messages"
                        }
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 flex flex-col h-full">
            {/* Chat messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentConversation.messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BrainCircuitIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Start a new conversation</p>
                      <p className="text-xs">Ask questions about your code, data, or models</p>
                    </div>
                  </div>
                ) : (
                  currentConversation.messages.map(message => (
                    <div key={message.id} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] ${message.role === "assistant" ? "bg-muted" : "bg-primary/10"} rounded-lg p-3`}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${message.role === "assistant" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                            {message.role === "assistant" ? (
                              <BrainCircuitIcon className="h-4 w-4" />
                            ) : (
                              <UserIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="text-xs font-medium">
                            {message.role === "assistant" ? "Copilot" : "You"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </div>
                        </div>
                        
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Chat input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask something..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!input.trim()}
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="prompts" className="h-full m-0 p-4 overflow-auto">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">Saved Prompts</h3>
            <Button size="sm" variant="outline">
              <PlusIcon className="h-4 w-4 mr-1" /> Create New
            </Button>
          </div>
          
          <div className="space-y-3">
            {prompts.map(prompt => (
              <Card key={prompt.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-sm font-medium">{prompt.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Code2Icon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {prompt.content}
                  </p>
                  <div className="mt-2">
                    <Button size="sm" variant="secondary">
                      <SendIcon className="h-3 w-3 mr-1" /> Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </div>
    </div>
  );
}