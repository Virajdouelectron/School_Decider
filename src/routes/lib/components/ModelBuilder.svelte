<script>
  import { onMount } from 'svelte';
  import { Play, Save, Download, Settings, BarChart3, Brain } from 'lucide-svelte';

  let selectedAlgorithm = $state('random_forest');
  let trainingStatus = $state('idle'); // idle, training, completed, error
  let modelMetrics = {
    accuracy: 0.942,
    precision: 0.938,
    recall: 0.945,
    f1Score: 0.941
  };

  let hyperparameters = $state({
    random_forest: {
      n_estimators: 100,
      max_depth: 10,
      min_samples_split: 2,
      min_samples_leaf: 1
    },
    xgboost: {
      n_estimators: 100,
      learning_rate: 0.1,
      max_depth: 6,
      subsample: 0.8
    },
    neural_network: {
      hidden_layers: [128, 64, 32],
      activation: 'relu',
      learning_rate: 0.001,
      epochs: 100
    },
    svm: {
      C: 1.0,
      kernel: 'linear'
    },
    logistic_regression: {
      C: 1.0,
      solver: 'lbfgs'
    }
  });

  let trainingProgress = $state(0);
  let trainingLogs = $state([
    'Initializing model training...',
    'Loading dataset: 10,000 samples',
    'Preprocessing features...',
    'Splitting data: 80% train, 20% test'
  ]);

  function startTraining() {
    trainingStatus = 'training';
    trainingProgress = 0;
    trainingLogs = ['Starting training with ' + selectedAlgorithm + '...'];

    // Simulate training progress
    const interval = setInterval(() => {
      trainingProgress += Math.random() * 10;
      
      if (trainingProgress >= 100) {
        trainingProgress = 100;
        trainingStatus = 'completed';
        trainingLogs.push('Training completed successfully!');
        trainingLogs.push(`Final accuracy: ${modelMetrics.accuracy.toFixed(3)}`);
        clearInterval(interval);
      } else {
        const epoch = Math.floor(trainingProgress / 10) + 1;
        trainingLogs.push(`Epoch ${epoch}: Loss = ${(1 - trainingProgress/100).toFixed(4)}`);
      }
      
      trainingLogs = trainingLogs;
    }, 500);
  }

  function saveModel() {
    console.log('Saving model...');
  }

  function deployModel() {
    console.log('Deploying model...');
  }

  function exportModel() {
    console.log('Exporting model...');
  }
</script>

<div class="flex h-full">
  <!-- Configuration Panel -->
  <div class="w-80 bg-gray-850 border-r border-gray-700 flex flex-col">
    <div class="p-4 border-b border-gray-700">
      <h3 class="font-semibold mb-4">Model Configuration</h3>
      
      <!-- Algorithm Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2" for="algorithm-select">Algorithm</label>
        <select 
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
          bind:value={selectedAlgorithm}
          id="algorithm-select"
        >
          <option value="random_forest">Random Forest</option>
          <option value="xgboost">XGBoost</option>
          <option value="neural_network">Neural Network</option>
          <option value="svm">Support Vector Machine</option>
          <option value="logistic_regression">Logistic Regression</option>
        </select>
      </div>

      <!-- Hyperparameters -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2" for="hyperparameters">Hyperparameters</label>
        <div class="space-y-3">
          {#if selectedAlgorithm === 'random_forest'}
            <div>
              <label class="block text-xs text-gray-400 mb-1" for="n_estimators">N Estimators</label>
              <input 
                type="number" 
                class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                bind:value={hyperparameters.random_forest.n_estimators}
                id="n_estimators"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1" for="max_depth">Max Depth</label>
              <input 
                type="number" 
                class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                bind:value={hyperparameters.random_forest.max_depth}
                id="max_depth"
              />
            </div>
          {:else if selectedAlgorithm === 'xgboost'}
            <div>
              <label class="block text-xs text-gray-400 mb-1" for="learning_rate">Learning Rate</label>
              <input 
                type="number" 
                step="0.01"
                class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                bind:value={hyperparameters.xgboost.learning_rate}
                id="learning_rate"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1" for="xgboost_max_depth">Max Depth</label>
              <input 
                type="number" 
                class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                bind:value={hyperparameters.xgboost.max_depth}
                id="xgboost_max_depth"
              />
            </div>
          {:else if selectedAlgorithm === 'svm'}
            <div>
              <label class="block text-xs text-gray-400 mb-1" for="svm_C">C</label>
              <input 
                type="number" 
                class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                bind:value={hyperparameters.svm.C}
                id="svm_C"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1" for="svm_kernel">Kernel</label>
              <input 
                type="text" 
                class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                bind:value={hyperparameters.svm.kernel}
                id="svm_kernel"
              />
            </div>
          {:else if selectedAlgorithm === 'logistic_regression'}
            <div>
              <label class="block text-xs text-gray-400 mb-1" for="logistic_regression_C">C</label>
              <input 
                type="number" 
                class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                bind:value={hyperparameters.logistic_regression.C}
                id="logistic_regression_C"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1" for="logistic_regression_solver">Solver</label>
              <input 
                type="text" 
                class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                bind:value={hyperparameters.logistic_regression.solver}
                id="logistic_regression_solver"
              />
            </div>
          {/if}
        </div>
      </div>

      <!-- Training Controls -->
      <div class="space-y-2">
        <button 
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm disabled:opacity-50"
          disabled={trainingStatus === 'training'}
          onclick={startTraining}
        >
          <Play size={16} />
          {trainingStatus === 'training' ? 'Training...' : 'Start Training'}
        </button>
        
        <button 
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          onclick={saveModel}
        >
          <Save size={16} />
          Save Model
        </button>
        
        <button 
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
          onclick={deployModel}
        >
          <Brain size={16} />
          Deploy Model
        </button>
      </div>
    </div>

    <!-- Model Metrics -->
    <div class="p-4">
      <h4 class="font-medium mb-3">Model Performance</h4>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-sm text-gray-400">Accuracy</span>
          <span class="text-sm font-mono">{(modelMetrics.accuracy * 100).toFixed(1)}%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-400">Precision</span>
          <span class="text-sm font-mono">{(modelMetrics.precision * 100).toFixed(1)}%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-400">Recall</span>
          <span class="text-sm font-mono">{(modelMetrics.recall * 100).toFixed(1)}%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-400">F1-Score</span>
          <span class="text-sm font-mono">{(modelMetrics.f1Score * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <div class="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
      <h2 class="font-semibold">Model Builder</h2>
      <div class="flex-1"></div>
      <button class="flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm" onclick={exportModel}>
        <Download size={14} />
        Export
      </button>
    </div>

    <!-- Content Area -->
    <div class="flex-1 p-4 overflow-auto">
      <div class="grid grid-cols-2 gap-4 h-full">
        <!-- Training Progress -->
        <div class="bg-gray-800 rounded-lg p-4">
          <h3 class="font-medium mb-4 flex items-center gap-2">
            <Brain size={18} />
            Training Progress
          </h3>
          
          {#if trainingStatus === 'training'}
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{trainingProgress.toFixed(0)}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div 
                  class="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style="width: {trainingProgress}%"
                ></div>
              </div>
            </div>
          {/if}

          <div class="bg-gray-900 rounded p-3 h-64 overflow-auto">
            <div class="text-xs font-mono space-y-1">
              {#each trainingLogs as log}
                <div class="text-gray-300">{log}</div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Model Visualization -->
        <div class="bg-gray-800 rounded-lg p-4">
          <h3 class="font-medium mb-4 flex items-center gap-2">
            <BarChart3 size={18} />
            Model Visualization
          </h3>
          
          <div class="h-64 flex items-center justify-center text-gray-400">
            <div class="text-center">
              <BarChart3 size={48} class="mx-auto mb-2" />
              <p>Model architecture visualization</p>
              <p class="text-sm">Feature importance, decision trees, etc.</p>
            </div>
          </div>
        </div>

        <!-- Feature Importance -->
        <div class="bg-gray-800 rounded-lg p-4">
          <h3 class="font-medium mb-4">Feature Importance</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">feature_1</span>
              <div class="flex items-center gap-2 flex-1 ml-4">
                <div class="flex-1 bg-gray-700 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 85%"></div>
                </div>
                <span class="text-xs text-gray-400 w-12">0.85</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">feature_2</span>
              <div class="flex items-center gap-2 flex-1 ml-4">
                <div class="flex-1 bg-gray-700 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 72%"></div>
                </div>
                <span class="text-xs text-gray-400 w-12">0.72</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">feature_3</span>
              <div class="flex items-center gap-2 flex-1 ml-4">
                <div class="flex-1 bg-gray-700 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 68%"></div>
                </div>
                <span class="text-xs text-gray-400 w-12">0.68</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">feature_4</span>
              <div class="flex items-center gap-2 flex-1 ml-4">
                <div class="flex-1 bg-gray-700 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 45%"></div>
                </div>
                <span class="text-xs text-gray-400 w-12">0.45</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Model Comparison -->
        <div class="bg-gray-800 rounded-lg p-4">
          <h3 class="font-medium mb-4">Model Comparison</h3>
          <div class="space-y-3">
            <div class="p-3 bg-gray-700 rounded {selectedAlgorithm === 'random_forest' ? 'ring-2 ring-blue-500' : ''}">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">Random Forest</span>
                <span class="text-sm text-green-400">94.2%</span>
              </div>
              <div class="text-xs text-gray-400">Fast training, good interpretability</div>
            </div>
            <div class="p-3 bg-gray-700 rounded {selectedAlgorithm === 'xgboost' ? 'ring-2 ring-blue-500' : ''}">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">XGBoost</span>
                <span class="text-sm text-green-400">96.1%</span>
              </div>
              <div class="text-xs text-gray-400">High accuracy, gradient boosting</div>
            </div>
            <div class="p-3 bg-gray-700 rounded {selectedAlgorithm === 'neural_network' ? 'ring-2 ring-blue-500' : ''}">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">Neural Network</span>
                <span class="text-sm text-yellow-400">Training...</span>
              </div>
              <div class="text-xs text-gray-400">Deep learning, complex patterns</div>
            </div>
            <div class="p-3 bg-gray-700 rounded {selectedAlgorithm === 'svm' ? 'ring-2 ring-blue-500' : ''}">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">Support Vector Machine</span>
                <span class="text-sm text-green-400">95.0%</span>
              </div>
              <div class="text-xs text-gray-400">Effective in high-dimensional spaces</div>
            </div>
            <div class="p-3 bg-gray-700 rounded {selectedAlgorithm === 'logistic_regression' ? 'ring-2 ring-blue-500' : ''}">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">Logistic Regression</span>
                <span class="text-sm text-green-400">93.5%</span>
              </div>
              <div class="text-xs text-gray-400">Simple, fast predictions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
