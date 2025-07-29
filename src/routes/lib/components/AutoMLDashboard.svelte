<script>
  import { onMount } from 'svelte';
  import { Play, Pause, Square, Settings, Download, RefreshCw, Zap } from 'lucide-svelte';
  import { derived } from 'svelte/store';

  let experiments = [
    {
      id: 1,
      name: 'AutoML Experiment #1',
      status: 'running',
      progress: 65,
      bestModel: 'XGBoost',
      bestScore: 0.961,
      timeElapsed: '12m 34s',
      modelsEvaluated: 15,
      totalModels: 25
    },
    {
      id: 2,
      name: 'AutoML Experiment #2',
      status: 'completed',
      progress: 100,
      bestModel: 'Random Forest',
      bestScore: 0.942,
      timeElapsed: '8m 12s',
      modelsEvaluated: 20,
      totalModels: 20
    },
    {
      id: 3,
      name: 'AutoML Experiment #3',
      status: 'paused',
      progress: 30,
      bestModel: 'Logistic Regression',
      bestScore: 0.887,
      timeElapsed: '4m 56s',
      modelsEvaluated: 8,
      totalModels: 25
    }
  ];

  let selectedExperiment = $state(experiments[0]);
  let autoMLConfig = $state({
    timeLimit: 30,
    modelTypes: ['random_forest', 'xgboost', 'neural_network', 'svm'],
    metric: 'accuracy',
    crossValidation: 5
  });

  const derivedExperiments = derived([experiments], $experiments => $experiments);

  function startNewExperiment() {
    const newExperiment = {
      id: Date.now(),
      name: `AutoML Experiment #${experiments.length + 1}`,
      status: 'running',
      progress: 0,
      bestModel: 'Initializing...',
      bestScore: 0,
      timeElapsed: '0s',
      modelsEvaluated: 0,
      totalModels: 25
    };
    
    experiments = [newExperiment, ...experiments];
    selectedExperiment = newExperiment;
  }

  function pauseExperiment(experimentId) {
    experiments = experiments.map(exp => 
      exp.id === experimentId ? { ...exp, status: 'paused' } : exp
    );
  }

  function resumeExperiment(experimentId) {
    experiments = experiments.map(exp => 
      exp.id === experimentId ? { ...exp, status: 'running' } : exp
    );
  }

  function stopExperiment(experimentId) {
    experiments = experiments.map(exp => 
      exp.id === experimentId ? { ...exp, status: 'stopped' } : exp
    );
  }

  function selectExperiment(experiment) {
    selectedExperiment = experiment;
  }

  function getStatusColor(status) {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'paused': return 'text-yellow-400';
      case 'stopped': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }
</script>

<div class="flex h-full">
  <!-- Experiments Sidebar -->
  <div class="w-80 bg-gray-850 border-r border-gray-700 flex flex-col">
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold">AutoML Experiments</h3>
        <button 
          class="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          onclick={startNewExperiment}
        >
          <Play size={14} />
          New
        </button>
      </div>

      <!-- Experiment List -->
      <div class="space-y-2">
        {#each derivedExperiments as experiment}
          <div 
            class="p-3 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 {selectedExperiment?.id === experiment.id ? 'ring-2 ring-blue-500' : ''}"
            onclick={() => selectExperiment(experiment)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Enter' && selectExperiment(experiment)}
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-sm">{experiment.name}</span>
              <span class="text-xs {getStatusColor(experiment.status)} capitalize">
                {experiment.status}
              </span>
            </div>
            
            <div class="text-xs text-gray-400 mb-2">
              Best: {experiment.bestModel} ({(experiment.bestScore * 100).toFixed(1)}%)
            </div>
            
            {#if experiment.status === 'running' || experiment.status === 'paused'}
              <div class="mb-2">
                <div class="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{experiment.progress}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    class="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style="width: {experiment.progress}%"
                  ></div>
                </div>
              </div>
            {/if}
            
            <div class="flex justify-between text-xs text-gray-500">
              <span>{experiment.modelsEvaluated}/{experiment.totalModels} models</span>
              <span>{experiment.timeElapsed}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- AutoML Configuration -->
    <div class="p-4">
      <h4 class="font-medium mb-3">Configuration</h4>
      <div class="space-y-3">
        <div>
          <label class="block text-xs text-gray-400 mb-1" for="timeLimit">Time Limit (minutes)</label>
          <input 
            type="number" 
            class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
            bind:value={autoMLConfig.timeLimit}
            id="timeLimit"
          />
        </div>
        
        <div>
          <label class="block text-xs text-gray-400 mb-1" for="metric">Optimization Metric</label>
          <select 
            class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
            bind:value={autoMLConfig.metric}
            id="metric"
          >
            <option value="accuracy">Accuracy</option>
            <option value="f1">F1 Score</option>
            <option value="precision">Precision</option>
            <option value="recall">Recall</option>
          </select>
        </div>
        
        <div>
          <label class="block text-xs text-gray-400 mb-1" for="crossValidation">Cross Validation Folds</label>
          <input 
            type="number" 
            class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
            bind:value={autoMLConfig.crossValidation}
            id="crossValidation"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Main Dashboard -->
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <div class="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
      <h2 class="font-semibold flex items-center gap-2">
        <Zap size={18} />
        AutoML Dashboard
      </h2>
      
      {#if selectedExperiment}
        <div class="flex-1 flex items-center justify-center">
          <span class="text-sm text-gray-400">{selectedExperiment.name}</span>
        </div>
        
        <div class="flex gap-2">
          {#if selectedExperiment.status === 'running'}
            <button 
              class="flex items-center gap-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
              onclick={() => pauseExperiment(selectedExperiment.id)}
            >
              <Pause size={14} />
              Pause
            </button>
          {:else if selectedExperiment.status === 'paused'}
            <button 
              class="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
              onclick={() => resumeExperiment(selectedExperiment.id)}
            >
              <Play size={14} />
              Resume
            </button>
          {/if}
          
          <button 
            class="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
            onclick={() => stopExperiment(selectedExperiment.id)}
          >
            <Square size={14} />
            Stop
          </button>
        </div>
      {/if}
    </div>

    <!-- Dashboard Content -->
    {#if selectedExperiment}
      <div class="flex-1 p-4 overflow-auto">
        <div class="grid grid-cols-3 gap-4 mb-6">
          <!-- Status Cards -->
          <div class="bg-gray-800 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-400">Status</span>
              <div class="w-3 h-3 rounded-full {selectedExperiment.status === 'running' ? 'bg-green-500' : selectedExperiment.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'}"></div>
            </div>
            <div class="text-xl font-semibold capitalize">{selectedExperiment.status}</div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-4">
            <div class="text-sm text-gray-400 mb-2">Best Score</div>
            <div class="text-xl font-semibold">{(selectedExperiment.bestScore * 100).toFixed(1)}%</div>
            <div class="text-xs text-gray-500">{selectedExperiment.bestModel}</div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-4">
            <div class="text-sm text-gray-400 mb-2">Models Evaluated</div>
            <div class="text-xl font-semibold">{selectedExperiment.modelsEvaluated}</div>
            <div class="text-xs text-gray-500">of {selectedExperiment.totalModels}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Progress Chart -->
          <div class="bg-gray-800 rounded-lg p-4">
            <h3 class="font-medium mb-4">Training Progress</h3>
            <div class="h-64 flex items-center justify-center text-gray-400">
              <div class="text-center">
                <RefreshCw size={48} class="mx-auto mb-2 {selectedExperiment.status === 'running' ? 'animate-spin' : ''}" />
                <p>Progress visualization</p>
                <p class="text-sm">Model performance over time</p>
              </div>
            </div>
          </div>

          <!-- Model Leaderboard -->
          <div class="bg-gray-800 rounded-lg p-4">
            <h3 class="font-medium mb-4">Model Leaderboard</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-sm">XGBoost</span>
                <span class="text-sm font-mono text-green-400">96.1%</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-sm">Random Forest</span>
                <span class="text-sm font-mono text-green-400">94.2%</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-sm">Neural Network</span>
                <span class="text-sm font-mono text-yellow-400">Training...</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-sm">SVM</span>
                <span class="text-sm font-mono">91.8%</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span class="text-sm">Logistic Regression</span>
                <span class="text-sm font-mono">88.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center text-gray-400">
          <Zap size={64} class="mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2">No Experiment Selected</h3>
          <p>Select an experiment from the sidebar or create a new one</p>
        </div>
      </div>
    {/if}
  </div>
</div>
