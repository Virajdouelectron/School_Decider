<script>
  import { fileTree, openTabs, activeTab } from '../stores.js';
  import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-svelte';

  let tree = $state([]);
  fileTree.subscribe(value => tree = value);

  function toggleFolder(folder) {
    folder.expanded = !folder.expanded;
    fileTree.set(tree);
  }

  function openFile(file) {
    const fileName = file.name;
    
    openTabs.update(tabs => {
      if (!tabs.find(tab => tab.id === fileName)) {
        return [...tabs, {
          id: fileName,
          name: fileName,
          type: file.language || 'text',
          content: getFileContent(fileName)
        }];
      }
      return tabs;
    });
    
    activeTab.set(fileName);
  }

  function getFileContent(fileName) {
    const contents = {
      'main.py': '# Welcome to Open Minds IDE\n# Your AI-native development environment\n\nimport pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# Load your dataset\ndf = pd.read_csv("data/dataset.csv")\nprint(f"Dataset shape: {df.shape}")\n\n# Start building your ML model here\nX = df.drop("target", axis=1)\ny = df["target"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nprint("Ready to train your model!")',
      'utils.py': 'import pandas as pd\nimport numpy as np\nfrom typing import Tuple, List\n\ndef load_data(file_path: str) -> pd.DataFrame:\n    """Load dataset from file"""\n    return pd.read_csv(file_path)\n\ndef preprocess_data(df: pd.DataFrame) -> pd.DataFrame:\n    """Preprocess the dataset"""\n    # Handle missing values\n    df = df.fillna(df.mean())\n    return df\n\ndef split_features_target(df: pd.DataFrame, target_col: str) -> Tuple[pd.DataFrame, pd.Series]:\n    """Split features and target"""\n    X = df.drop(target_col, axis=1)\n    y = df[target_col]\n    return X, y',
      'model.py': 'from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.metrics import accuracy_score, classification_report\nimport joblib\n\nclass MLModel:\n    def __init__(self, model_type="random_forest"):\n        if model_type == "random_forest":\n            self.model = RandomForestClassifier(n_estimators=100, random_state=42)\n        \n    def train(self, X_train, y_train):\n        """Train the model"""\n        self.model.fit(X_train, y_train)\n        \n    def predict(self, X_test):\n        """Make predictions"""\n        return self.model.predict(X_test)\n        \n    def evaluate(self, X_test, y_test):\n        """Evaluate model performance"""\n        predictions = self.predict(X_test)\n        accuracy = accuracy_score(y_test, predictions)\n        report = classification_report(y_test, predictions)\n        return accuracy, report\n        \n    def save_model(self, filepath):\n        """Save trained model"""\n        joblib.dump(self.model, filepath)',
      'dataset.csv': 'feature1,feature2,feature3,target\n1.2,3.4,5.6,0\n2.1,4.3,6.5,1\n3.2,5.4,7.6,0\n...',
      'config.yaml': 'model:\n  type: "random_forest"\n  parameters:\n    n_estimators: 100\n    max_depth: 10\n    random_state: 42\n\ndata:\n  train_path: "data/train.csv"\n  test_path: "data/test.csv"\n  target_column: "target"\n\ntraining:\n  validation_split: 0.2\n  cross_validation: 5'
    };
    
    return contents[fileName] || `# ${fileName}\n# File content goes here...`;
  }

  function renderTree(items, depth = 0) {
    return items;
  }
</script>

<div class="p-2">
  {#each tree as item}
    <div class="select-none">
      {#if item.type === 'folder'}
        <button 
          class="flex items-center py-1 px-2 hover:bg-gray-700 rounded cursor-pointer"
          onclick={() => toggleFolder(item)}
          onkeydown={(e) => e.key === 'Enter' && toggleFolder(item)}
          aria-expanded={item.expanded}
          aria-label={`Toggle folder ${item.name}`}
        >
          <div class="w-4 h-4 flex items-center justify-center mr-1">
            {#if item.expanded}
              <ChevronDown size={12} />
            {:else}
              <ChevronRight size={12} />
            {/if}
          </div>
          <div class="w-4 h-4 mr-2 flex items-center justify-center">
            {#if item.expanded}
              <FolderOpen size={14} class="text-blue-400" />
            {:else}
              <Folder size={14} class="text-blue-400" />
            {/if}
          </div>
          <span class="text-sm">{item.name}</span>
        </button>
        
        {#if item.expanded && item.children}
          <div class="ml-4">
            {#each item.children as child}
              <button 
                class="flex items-center py-1 px-2 hover:bg-gray-700 rounded cursor-pointer"
                onclick={() => openFile(child)}
                onkeydown={(e) => e.key === 'Enter' && openFile(child)}
                aria-label={`Open file ${child.name}`}
              >
                <div class="w-4 h-4 mr-2 flex items-center justify-center">
                  <File size={14} class="text-gray-400" />
                </div>
                <span class="text-sm">{child.name}</span>
              </button>
            {/each}
          </div>
        {/if}
      {:else}
        <button 
          class="flex items-center py-1 px-2 hover:bg-gray-700 rounded cursor-pointer"
          onclick={() => openFile(item)}
          onkeydown={(e) => e.key === 'Enter' && openFile(item)}
          aria-label={`Open file ${item.name}`}
        >
          <div class="w-4 h-4 mr-2 flex items-center justify-center">
            <File size={14} class="text-gray-400" />
          </div>
          <span class="text-sm">{item.name}</span>
        </button>
      {/if}
    </div>
  {/each}
</div>
