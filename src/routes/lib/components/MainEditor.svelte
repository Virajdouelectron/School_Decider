<script>
  import { preventDefault, stopPropagation } from 'svelte/legacy';

  import { onMount } from 'svelte';
  import { openTabs, activeTab } from '../stores.js';
  import { X, Play, Save, Download } from 'lucide-svelte';

  let editorContainer = $state();
  let monaco;
  let editor;
  let tabs = $state([]);
  let currentTab = $state('');

  openTabs.subscribe(value => tabs = value);
  activeTab.subscribe(value => currentTab = value);

  onMount(async () => {
    // Load Monaco Editor
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/monaco-editor@0.45.0/min/vs/loader.js';
    document.head.appendChild(script);

    script.onload = () => {
      window.require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' } });
      window.require(['vs/editor/editor.main'], () => {
        monaco = window.monaco;
        initializeEditor();
      });
    };
  });

  function initializeEditor() {
    if (!editorContainer || !monaco) return;

    editor = monaco.editor.create(editorContainer, {
      value: getCurrentTabContent(),
      language: getCurrentTabLanguage(),
      theme: 'vs-dark',
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      contextmenu: true,
      mouseWheelZoom: true
    });

    // Update content when tab changes
    activeTab.subscribe(tabId => {
      if (editor && tabId) {
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
          editor.setValue(tab.content);
          monaco.editor.setModelLanguage(editor.getModel(), getLanguageFromType(tab.type));
        }
      }
    });
  }

  function getCurrentTabContent() {
    const tab = tabs.find(t => t.id === currentTab);
    return tab ? tab.content : '';
  }

  function getCurrentTabLanguage() {
    const tab = tabs.find(t => t.id === currentTab);
    return tab ? getLanguageFromType(tab.type) : 'python';
  }

  function getLanguageFromType(type) {
    const languageMap = {
      'python': 'python',
      'javascript': 'javascript',
      'typescript': 'typescript',
      'json': 'json',
      'yaml': 'yaml',
      'csv': 'plaintext',
      'text': 'plaintext'
    };
    return languageMap[type] || 'python';
  }

  function closeTab(tabId) {
    openTabs.update(tabs => tabs.filter(tab => tab.id !== tabId));
    
    if (currentTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        activeTab.set(remainingTabs[0].id);
      } else {
        activeTab.set('');
      }
    }
  }

  function switchTab(tabId) {
    activeTab.set(tabId);
  }

  function runCode() {
    const currentContent = editor ? editor.getValue() : '';
    console.log('Running code:', currentContent);
    // Here you would integrate with your backend API to execute the code
  }

  function saveFile() {
    if (editor && currentTab) {
      const content = editor.getValue();
      openTabs.update(tabs => 
        tabs.map(tab => 
          tab.id === currentTab ? { ...tab, content } : tab
        )
      );
      console.log('File saved:', currentTab);
    }
  }
</script>

<div class="flex flex-col h-full">
  <!-- Tab Bar -->
  {#if tabs.length > 0}
    <div class="h-10 bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
      {#each tabs as tab}
        <div 
          class="flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer min-w-0 {currentTab === tab.id ? 'bg-gray-900' : 'hover:bg-gray-700'}"
          role="tab"
          tabindex="0"
          onclick={() => switchTab(tab.id)}
          onkeydown={preventDefault((e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              switchTab(tab.id);
            }
          })}
        >
          <span class="text-sm truncate mr-2">{tab.name}</span>
          <button 
            class="hover:bg-gray-600 rounded p-1"
            onclick={stopPropagation(() => closeTab(tab.id))}
          >
            <X size={12} />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Toolbar -->
  <div class="h-10 bg-gray-850 border-b border-gray-700 flex items-center px-4 gap-2">
    <button 
      class="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
      onclick={runCode}
    >
      <Play size={14} />
      Run
    </button>
    <button 
      class="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
      onclick={saveFile}
    >
      <Save size={14} />
      Save
    </button>
    <button class="flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm">
      <Download size={14} />
      Export
    </button>
    
    <div class="flex-1"></div>
    
    <div class="text-xs text-gray-400">
      {#if currentTab}
        {getCurrentTabLanguage().toUpperCase()} • Line 1, Column 1
      {/if}
    </div>
  </div>

  <!-- Editor -->
  <div class="flex-1 relative">
    {#if tabs.length > 0}
      <div bind:this={editorContainer} class="w-full h-full"></div>
    {:else}
      <div class="flex items-center justify-center h-full text-gray-400">
        <div class="text-center">
          <div class="text-6xl mb-4">🚀</div>
          <h2 class="text-xl font-semibold mb-2">Welcome to Open Minds IDE</h2>
          <p class="text-sm">Open a file from the sidebar to start coding</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Output Panel -->
  <div class="h-32 bg-gray-900 border-t border-gray-700 p-4 overflow-auto">
    <div class="text-xs text-gray-400 mb-2">OUTPUT</div>
    <div class="text-sm font-mono">
      <div class="text-green-400">Ready to execute code...</div>
      <div class="text-gray-300">Use the Run button to execute your Python scripts</div>
    </div>
  </div>
</div>
