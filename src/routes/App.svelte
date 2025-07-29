<script>
  import { onMount } from 'svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import MainEditor from './lib/components/MainEditor.svelte';
  import DatasetViewer from './lib/components/DatasetViewer.svelte';
  import NotebookEditor from './lib/components/NotebookEditor.svelte';
  import ModelBuilder from './lib/components/ModelBuilder.svelte';
  import AutoMLDashboard from './lib/components/AutoMLDashboard.svelte';
  import { activeTab, openTabs, sidebarCollapsed } from './lib/stores.js';

  let currentView = $state('editor');
  let activeTabValue = '';
  let openTabsValue = [];
  let sidebarCollapsedValue = false;

  // Subscribe to stores
  activeTab.subscribe(value => activeTabValue = value);
  openTabs.subscribe(value => openTabsValue = value);
  sidebarCollapsed.subscribe(value => sidebarCollapsedValue = value);

  function handleViewChange(view) {
    currentView = view;
  }

  onMount(() => {
    // Initialize with a default Python file
    openTabs.update(tabs => [...tabs, {
      id: 'main.py',
      name: 'main.py',
      type: 'python',
      content: '# Welcome to Open Minds IDE\n# Your AI-native development environment\n\nimport pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# Load your dataset\ndf = pd.read_csv("data/dataset.csv")\nprint(f"Dataset shape: {df.shape}")\n\n# Start building your ML model here\nX = df.drop("target", axis=1)\ny = df["target"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nprint("Ready to train your model!")'
    }]);
    activeTab.set('main.py');
  });
</script>

<div class="h-screen bg-gray-900 text-white flex overflow-hidden">
  <!-- Sidebar -->
  <Sidebar {currentView} onviewChange={(e) => handleViewChange(e.detail)} />
  
  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Top Navigation Bar -->
    <div class="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
        <span class="font-bold text-lg">Open Minds</span>
        <span class="text-xs bg-blue-600 px-2 py-1 rounded">AI-Native IDE</span>
      </div>
      
      <div class="flex-1"></div>
      
      <!-- View Switcher -->
      <div class="flex bg-gray-700 rounded-lg p-1">
        <button 
          class="px-3 py-1 text-xs rounded {currentView === 'editor' ? 'bg-blue-600' : 'hover:bg-gray-600'}"
          onclick={() => handleViewChange('editor')}
        >
          Editor
        </button>
        <button 
          class="px-3 py-1 text-xs rounded {currentView === 'dataset' ? 'bg-blue-600' : 'hover:bg-gray-600'}"
          onclick={() => handleViewChange('dataset')}
        >
          Dataset
        </button>
        <button 
          class="px-3 py-1 text-xs rounded {currentView === 'notebook' ? 'bg-blue-600' : 'hover:bg-gray-600'}"
          onclick={() => handleViewChange('notebook')}
        >
          Notebook
        </button>
        <button 
          class="px-3 py-1 text-xs rounded {currentView === 'model' ? 'bg-blue-600' : 'hover:bg-gray-600'}"
          onclick={() => handleViewChange('model')}
        >
          Model Builder
        </button>
        <button 
          class="px-3 py-1 text-xs rounded {currentView === 'automl' ? 'bg-blue-600' : 'hover:bg-gray-600'}"
          onclick={() => handleViewChange('automl')}
        >
          AutoML
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      {#if currentView === 'editor'}
        <MainEditor />
      {:else if currentView === 'dataset'}
        <DatasetViewer />
      {:else if currentView === 'notebook'}
        <NotebookEditor />
      {:else if currentView === 'model'}
        <ModelBuilder />
      {:else if currentView === 'automl'}
        <AutoMLDashboard />
      {/if}
    </div>
  </div>
</div>
