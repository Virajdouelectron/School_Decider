<script lang="ts">
  import FileTree from './FileTree.svelte';
  import { Folder, Database, BookOpen, Brain, Zap } from 'lucide-svelte';
  import { fileTree, sidebarCollapsed } from '../stores.js';

  let { viewChange } = $props();

  let collapsed = $state(false);
  let activeSection = $state('files');

  sidebarCollapsed.subscribe(value => collapsed = value);

  function toggleSidebar() {
    collapsed = !collapsed;
    sidebarCollapsed.set(collapsed);
  }

  function setActiveSection(section) {
    activeSection = section;
    if (viewChange) {
      viewChange(section);
    }
  }
</script>

<div class="flex h-full">
  <!-- Icon Bar -->
  <div class="w-12 bg-gray-800 border-r border-gray-700 flex flex-col">
    <button 
      class="p-3 hover:bg-gray-700 {activeSection === 'files' ? 'bg-gray-700 border-r-2 border-blue-500' : ''}"
      onclick={() => setActiveSection('files')}
      title="Files"
    >
      <Folder size={18} />
    </button>
    <button 
      class="p-3 hover:bg-gray-700 {activeSection === 'data' ? 'bg-gray-700 border-r-2 border-blue-500' : ''}"
      onclick={() => setActiveSection('data')}
      title="Datasets"
    >
      <Database size={18} />
    </button>
    <button 
      class="p-3 hover:bg-gray-700 {activeSection === 'notebook' ? 'bg-gray-700 border-r-2 border-blue-500' : ''}"
      onclick={() => setActiveSection('notebook')}
      title="Notebooks"
    >
      <BookOpen size={18} />
    </button>
    <button 
      class="p-3 hover:bg-gray-700 {activeSection === 'model' ? 'bg-gray-700 border-r-2 border-blue-500' : ''}"
      onclick={() => setActiveSection('model')}
      title="Model Builder"
    >
      <Brain size={18} />
    </button>
    <button 
      class="p-3 hover:bg-gray-700 {activeSection === 'automl' ? 'bg-gray-700 border-r-2 border-blue-500' : ''}"
      onclick={() => setActiveSection('automl')}
      title="AutoML"
    >
      <Zap size={18} />
    </button>
  </div>

  <!-- Sidebar Content -->
  <div class="w-64 bg-gray-850 border-r border-gray-700 flex flex-col {collapsed ? 'hidden' : ''}">
    <!-- Sidebar Header -->
    <div class="h-8 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-3">
      <span class="text-xs font-medium uppercase tracking-wide text-gray-400">
        {#if activeSection === 'files'}Files
        {:else if activeSection === 'data'}Datasets
        {:else if activeSection === 'notebook'}Notebooks
        {:else if activeSection === 'model'}Models
        {:else if activeSection === 'automl'}AutoML
        {/if}
      </span>
      <button onclick={toggleSidebar} class="hover:bg-gray-700 p-1 rounded">
        <Folder size={14} /> <!-- Placeholder for ChevronLeft -->
      </button>
    </div>

    <!-- Sidebar Content -->
    <div class="flex-1 overflow-auto">
      {#if activeSection === 'files'}
        <FileTree />
      {:else if activeSection === 'data'}
        <div class="p-3">
          <div class="space-y-2">
            <div class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
              <div class="text-sm font-medium">dataset.csv</div>
              <div class="text-xs text-gray-400">10K rows • 2.3 MB</div>
            </div>
            <div class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
              <div class="text-sm font-medium">train.csv</div>
              <div class="text-xs text-gray-400">8K rows • 1.8 MB</div>
            </div>
            <div class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
              <div class="text-sm font-medium">test.csv</div>
              <div class="text-xs text-gray-400">2K rows • 0.5 MB</div>
            </div>
          </div>
        </div>
      {:else if activeSection === 'notebook'}
        <div class="p-3">
          <div class="space-y-2">
            <div class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
              <div class="text-sm font-medium">exploration.ipynb</div>
              <div class="text-xs text-gray-400">Data Analysis</div>
            </div>
            <div class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
              <div class="text-sm font-medium">training.ipynb</div>
              <div class="text-xs text-gray-400">Model Training</div>
            </div>
          </div>
        </div>
      {:else if activeSection === 'model'}
        <div class="p-3">
          <div class="space-y-2">
            <div class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
              <div class="text-sm font-medium">Random Forest</div>
              <div class="text-xs text-gray-400">Accuracy: 94.2%</div>
            </div>
            <div class="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer">
              <div class="text-sm font-medium">XGBoost</div>
              <div class="text-xs text-gray-400">Accuracy: 96.1%</div>
            </div>
          </div>
        </div>
      {:else if activeSection === 'automl'}
        <div class="p-3">
          <div class="space-y-2">
            <div class="p-2 bg-gray-800 rounded">
              <div class="text-sm font-medium text-green-400">Running</div>
              <div class="text-xs text-gray-400">AutoML Experiment #1</div>
            </div>
            <div class="p-2 bg-gray-800 rounded">
              <div class="text-sm font-medium text-blue-400">Completed</div>
              <div class="text-xs text-gray-400">AutoML Experiment #2</div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Collapsed Sidebar Toggle -->
  {#if collapsed}
    <button 
      onclick={toggleSidebar}
      class="absolute left-12 top-2 z-10 bg-gray-800 hover:bg-gray-700 p-1 rounded border border-gray-700"
    >
      <Folder size={14} /> <!-- Placeholder for ChevronRight -->
    </button>
  {/if}
</div>
