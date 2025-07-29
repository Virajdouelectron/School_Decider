<script>
  import { onMount } from 'svelte';
  import { datasets } from '../stores.js';
  import { Search, Filter, Download, BarChart3, Table, Database } from 'lucide-svelte';

  let selectedDataset = $state(null);
  let viewMode = $state('table');
  let searchTerm = $state('');
  let currentPage = $state(1);
  let itemsPerPage = 50;
  
  // Mock data for demonstration
  let sampleData = [
    { id: 1, feature1: 1.2, feature2: 3.4, feature3: 5.6, feature4: 7.8, target: 0 },
    { id: 2, feature1: 2.1, feature2: 4.3, feature3: 6.5, feature4: 8.7, target: 1 },
    { id: 3, feature1: 3.2, feature2: 5.4, feature3: 7.6, feature4: 9.8, target: 0 },
    { id: 4, feature1: 4.3, feature2: 6.5, feature3: 8.7, feature4: 10.9, target: 1 },
    { id: 5, feature1: 5.4, feature2: 7.6, feature3: 9.8, feature4: 12.0, target: 0 }
  ];

  let datasetList = $state([]);
  datasets.subscribe(value => datasetList = value);

  onMount(() => {
    if (datasetList.length > 0) {
      selectedDataset = datasetList[0];
    }
  });

  function selectDataset(dataset) {
    selectedDataset = dataset;
  }

  function toggleViewMode() {
    viewMode = viewMode === 'table' ? 'chart' : 'table';
  }

  function exportData() {
    console.log('Exporting dataset:', selectedDataset?.name);
  }

  let filteredData = $derived(sampleData.filter(row => 
    Object.values(row).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ));

  let paginatedData = $derived(filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ));

  let totalPages = $derived(Math.ceil(filteredData.length / itemsPerPage));
</script>

<div class="flex h-full">
  <!-- Dataset List Sidebar -->
  <div class="w-64 bg-gray-850 border-r border-gray-700 flex flex-col">
    <div class="p-4 border-b border-gray-700">
      <h3 class="font-semibold mb-3">Datasets</h3>
      <div class="space-y-2">
        {#each datasetList as dataset}
          <button 
            type="button"
            class="p-3 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 {selectedDataset?.name === dataset.name ? 'ring-2 ring-blue-500' : ''}"
            onclick={() => selectDataset(dataset)}
            aria-label="Select dataset"
          >
            <div class="font-medium text-sm">{dataset.name}</div>
            <div class="text-xs text-gray-400 mt-1">
              {dataset.rows.toLocaleString()} rows • {dataset.columns} cols
            </div>
            <div class="text-xs text-gray-500">{dataset.size}</div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Dataset Info -->
    {#if selectedDataset}
      <div class="p-4">
        <h4 class="font-medium mb-2">Dataset Info</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Rows:</span>
            <span>{selectedDataset.rows.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Columns:</span>
            <span>{selectedDataset.columns}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Size:</span>
            <span>{selectedDataset.size}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Modified:</span>
            <span>{selectedDataset.lastModified}</span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col">
    {#if selectedDataset}
      <!-- Toolbar -->
      <div class="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4">
        <h2 class="font-semibold">{selectedDataset.name}</h2>
        
        <div class="flex-1"></div>
        
        <!-- Search -->
        <div class="relative">
          <Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search data..."
            class="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-sm w-64"
            bind:value={searchTerm}
          />
        </div>

        <!-- View Toggle -->
        <button 
          type="button"
          class="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          onclick={toggleViewMode}
          aria-label="Toggle view mode"
        >
          {#if viewMode === 'table'}
            <BarChart3 size={16} />
            Chart View
          {:else}
            <Table size={16} />
            Table View
          {/if}
        </button>

        <button 
          type="button"
          class="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          aria-label="Filter data"
        >
          <Filter size={16} />
          Filter
        </button>

        <button 
          type="button"
          class="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
          onclick={exportData}
          aria-label="Export data"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-auto p-4">
        {#if viewMode === 'table'}
          <!-- Table View -->
          <div class="bg-gray-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-700">
                  <tr>
                    {#if paginatedData.length > 0}
                      {#each Object.keys(paginatedData[0]) as column}
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                          {column}
                        </th>
                      {/each}
                    {/if}
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                  {#each paginatedData as row, i}
                    <tr class="hover:bg-gray-750">
                      {#each Object.values(row) as value}
                        <td class="px-4 py-3 text-sm text-gray-300">
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between mt-4">
            <div class="text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div class="flex gap-2">
              <button 
                type="button"
                class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50"
                disabled={currentPage === 1}
                onclick={() => currentPage = Math.max(1, currentPage - 1)}
                aria-label="Previous page"
              >
                Previous
              </button>
              <span class="px-3 py-1 bg-gray-800 rounded text-sm">
                {currentPage} of {totalPages}
              </span>
              <button 
                type="button"
                class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50"
                disabled={currentPage === totalPages}
                onclick={() => currentPage = Math.min(totalPages, currentPage + 1)}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        {:else}
          <!-- Chart View -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-800 p-4 rounded-lg">
              <h3 class="font-medium mb-4">Feature Distribution</h3>
              <div class="h-64 flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <BarChart3 size={48} class="mx-auto mb-2" />
                  <p>Chart visualization would be rendered here</p>
                  <p class="text-sm">Integration with Chart.js or D3.js</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg">
              <h3 class="font-medium mb-4">Target Distribution</h3>
              <div class="h-64 flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <BarChart3 size={48} class="mx-auto mb-2" />
                  <p>Pie chart would be rendered here</p>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center text-gray-400">
          <Database size={64} class="mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2">No Dataset Selected</h3>
          <p>Select a dataset from the sidebar to view its contents</p>
        </div>
      </div>
    {/if}
  </div>
</div>
