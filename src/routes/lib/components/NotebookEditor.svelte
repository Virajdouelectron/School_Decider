<script>
  import { stopPropagation } from 'svelte/legacy';

  import { onMount } from 'svelte';
  import { Play, Plus, Trash2, ArrowUp, ArrowDown, Save } from 'lucide-svelte';

  let cells = $state([
    {
      id: 1,
      type: 'markdown',
      content: '# Machine Learning Notebook\n\nThis notebook demonstrates data analysis and model training workflows.',
      output: null
    },
    {
      id: 2,
      type: 'code',
      content: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\nprint("Libraries imported successfully!")',
      output: 'Libraries imported successfully!'
    },
    {
      id: 3,
      type: 'code',
      content: '# Load the dataset\ndf = pd.read_csv("data/dataset.csv")\nprint(f"Dataset shape: {df.shape}")\ndf.head()',
      output: 'Dataset shape: (10000, 15)\n   feature1  feature2  feature3  ...  target\n0      1.2       3.4       5.6  ...       0\n1      2.1       4.3       6.5  ...       1\n2      3.2       5.4       7.6  ...       0\n3      4.3       6.5       8.7  ...       1\n4      5.4       7.6       9.8  ...       0'
    }
  ]);

  let selectedCell = $state(null);

  function addCell(type = 'code', index = null) {
    const newCell = {
      id: Date.now(),
      type,
      content: type === 'markdown' ? '# New Markdown Cell' : '# New code cell',
      output: null
    };

    if (index !== null) {
      cells.splice(index + 1, 0, newCell);
    } else {
      cells.push(newCell);
    }
    cells = cells;
  }

  function deleteCell(cellId) {
    cells = cells.filter(cell => cell.id !== cellId);
  }

  function moveCell(cellId, direction) {
    const index = cells.findIndex(cell => cell.id === cellId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cells.length) return;

    [cells[index], cells[newIndex]] = [cells[newIndex], cells[index]];
    cells = cells;
  }

  function runCell(cellId) {
    const cell = cells.find(c => c.id === cellId);
    if (!cell || cell.type !== 'code') return;

    // Simulate code execution
    console.log('Running cell:', cell.content);
    
    // Mock output based on content
    if (cell.content.includes('import')) {
      cell.output = 'Libraries imported successfully!';
    } else if (cell.content.includes('df.shape')) {
      cell.output = 'Dataset shape: (10000, 15)';
    } else if (cell.content.includes('head()')) {
      cell.output = '   feature1  feature2  feature3  ...  target\n0      1.2       3.4       5.6  ...       0\n1      2.1       4.3       6.5  ...       1\n2      3.2       5.4       7.6  ...       0';
    } else {
      cell.output = 'Code executed successfully!';
    }
    
    cells = cells;
  }

  function runAllCells() {
    cells.forEach(cell => {
      if (cell.type === 'code') {
        runCell(cell.id);
      }
    });
  }

  function saveNotebook() {
    console.log('Saving notebook...');
    // Here you would save to backend
  }

  function selectCell(cellId) {
    selectedCell = cellId;
  }
</script>

<div class="flex flex-col h-full">
  <!-- Toolbar -->
  <div class="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
    <h2 class="font-semibold mr-4">Notebook</h2>
    
    <button 
      class="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
      onclick={runAllCells}
    >
      <Play size={14} />
      Run All
    </button>
    
    <button 
      class="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
      onclick={() => addCell('code')}
    >
      <Plus size={14} />
      Code
    </button>
    
    <button 
      class="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
      onclick={() => addCell('markdown')}
    >
      <Plus size={14} />
      Markdown
    </button>
    
    <div class="flex-1"></div>
    
    <button 
      class="flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
      onclick={saveNotebook}
    >
      <Save size={14} />
      Save
    </button>
  </div>

  <!-- Notebook Content -->
  <div class="flex-1 overflow-auto p-4">
    <div class="max-w-4xl mx-auto space-y-4">
      {#each cells as cell, index}
        <div 
          class="border border-gray-700 rounded-lg overflow-hidden {selectedCell === cell.id ? 'ring-2 ring-blue-500' : ''}"
          role="button"
          tabindex="0"
          onclick={() => selectCell(cell.id)}
          onkeydown={(e) => {
            if (e.key === 'Enter') {
              selectCell(cell.id);
            }
          }}
        >
          <!-- Cell Header -->
          <div class="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-gray-400">
                [{index + 1}] {cell.type.toUpperCase()}
              </span>
            </div>
            <div class="flex items-center gap-1">
              {#if cell.type === 'code'}
                <button 
                  class="p-1 hover:bg-gray-700 rounded"
                  onclick={stopPropagation(() => runCell(cell.id))}
                  title="Run Cell"
                >
                  <Play size={14} />
                </button>
              {/if}
              <button 
                class="p-1 hover:bg-gray-700 rounded"
                onclick={stopPropagation(() => moveCell(cell.id, 'up'))}
                title="Move Up"
              >
                <ArrowUp size={14} />
              </button>
              <button 
                class="p-1 hover:bg-gray-700 rounded"
                onclick={stopPropagation(() => moveCell(cell.id, 'down'))}
                title="Move Down"
              >
                <ArrowDown size={14} />
              </button>
              <button 
                class="p-1 hover:bg-gray-700 rounded text-red-400"
                onclick={stopPropagation(() => deleteCell(cell.id))}
                title="Delete Cell"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <!-- Cell Content -->
          <div class="bg-gray-900">
            {#if cell.type === 'markdown'}
              <div class="p-4">
                <textarea 
                  class="w-full bg-transparent border-none resize-none text-sm font-mono"
                  rows="4"
                  bind:value={cell.content}
                  placeholder="Enter markdown content..."
                ></textarea>
              </div>
              <!-- Rendered Markdown Preview -->
              <div class="px-4 pb-4 prose prose-invert max-w-none">
                {#if cell.content.startsWith('#')}
                  <h1 class="text-xl font-bold">{cell.content.replace(/^#\s*/, '')}</h1>
                {:else}
                  <p>{cell.content}</p>
                {/if}
              </div>
            {:else}
              <div class="p-4">
                <textarea 
                  class="w-full bg-transparent border-none resize-none text-sm font-mono text-green-400"
                  rows="6"
                  bind:value={cell.content}
                  placeholder="Enter Python code..."
                ></textarea>
              </div>
            {/if}
          </div>

          <!-- Cell Output -->
          {#if cell.type === 'code' && cell.output}
            <div class="bg-gray-850 border-t border-gray-700 p-4">
              <div class="text-xs text-gray-400 mb-2">OUTPUT:</div>
              <pre class="text-sm font-mono text-gray-300 whitespace-pre-wrap">{cell.output}</pre>
            </div>
          {/if}
        </div>
      {/each}

      <!-- Add Cell Button -->
      <div class="flex justify-center py-4">
        <button 
          class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
          onclick={() => addCell('code')}
        >
          <Plus size={16} />
          Add Cell
        </button>
      </div>
    </div>
  </div>
</div>
