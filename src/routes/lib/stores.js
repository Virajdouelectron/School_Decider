import { writable } from "svelte/store"

export const activeTab = writable("")
export const openTabs = writable([])
export const sidebarCollapsed = writable(false)
export const fileTree = writable([
  {
    name: "src",
    type: "folder",
    expanded: true,
    children: [
      { name: "main.py", type: "file", language: "python" },
      { name: "utils.py", type: "file", language: "python" },
      { name: "model.py", type: "file", language: "python" },
    ],
  },
  {
    name: "data",
    type: "folder",
    expanded: true,
    children: [
      { name: "dataset.csv", type: "file", language: "csv" },
      { name: "train.csv", type: "file", language: "csv" },
      { name: "test.csv", type: "file", language: "csv" },
    ],
  },
  {
    name: "notebooks",
    type: "folder",
    expanded: false,
    children: [
      { name: "exploration.ipynb", type: "file", language: "jupyter" },
      { name: "training.ipynb", type: "file", language: "jupyter" },
    ],
  },
  {
    name: "models",
    type: "folder",
    expanded: false,
    children: [
      { name: "classifier.pkl", type: "file", language: "binary" },
      { name: "config.yaml", type: "file", language: "yaml" },
    ],
  },
])

export const datasets = writable([
  {
    name: "dataset.csv",
    rows: 10000,
    columns: 15,
    size: "2.3 MB",
    lastModified: "2024-01-15",
  },
  {
    name: "train.csv",
    rows: 8000,
    columns: 15,
    size: "1.8 MB",
    lastModified: "2024-01-15",
  },
  {
    name: "test.csv",
    rows: 2000,
    columns: 14,
    size: "0.5 MB",
    lastModified: "2024-01-15",
  },
])
