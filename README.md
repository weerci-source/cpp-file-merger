# File Merger for VS Code

Easily combine the contents of multiple files into a single document, with each original file path shown as a comment.  
Perfect for sharing code context, preparing documentation, or merging source files.

The result is copied to your clipboard and saved to a file in one click.

## Features

- **Add files** – select one or more files in the Explorer and add them to the merge list.
- **Add entire folders** – recursively include all files from a folder (with configurable exclusion patterns).
- **Add open editors** – quickly add all files currently open in the editor.
- **Tree view** – see your files in a collapsible folder hierarchy, sorted alphabetically.
- **Exclude files or folders** – temporarily skip specific items from the merge without removing them from the list.
- **Remove items** – delete single files/folders or multiple selected items at once.
- **Clear the list** – remove everything in one click.
- **Persistent state** – the merge list survives editor restarts.
- **Merge, copy & save** – combine all active files, copy the merged text to the clipboard, and save it as a text file.
- **Configurable exclude patterns** – when adding a folder, certain globs (like `**/node_modules/**`) can be ignored.

## Installation

1. Open VS Code and go to the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for `File Merger`.
3. Click **Install**.

Or install from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=weerci-code.cpp-file-merger)

## Getting Started

1. Open your project in VS Code.
2. In the Explorer, right‑click one or more files and choose **Add File(s) to Merge List**.
3. Right‑click a folder and choose **Add Folder Recursively** to include its whole content.
4. In the title bar, you can also click **Add all Open Editors** to quickly add everything you're working on.
5. Open the **Merge List** panel from the activity bar (the icon with overlapping windows).

## Managing the List

The Merge List panel shows your files in a tree:

- **Expand folders** to see individual files.
- **Click any file** to open it in the editor.
- **Inline actions** appear when you hover over a file or folder:
  - **Exclude / Include** – toggle whether this item is merged. Excluded items are shown with a strike‑through icon and a `[excluded]` label.
  - **Remove** – delete the item from the list.
- Use the title bar buttons:
  - **Merge, Copy and Save** – starts the merge process.
  - **Add all Open Editors** – import open files.
  - **Remove Selected** – deletes currently selected items (select multiple with `Ctrl`/`Cmd`).
  - **Clear List** – empties the entire list.
  - **Configure Excluded Patterns** – opens settings where you can change folder‑exclusion globs.

## Merging

1. Make sure your list contains the files you want to combine. Excluded files will be ignored.
2. Click the **Merge, Copy and Save** button (combine icon) in the panel title.
3. The extension checks that all files still exist. If some are missing, you'll be asked whether to continue with the remaining ones.
4. A save dialog appears – choose a location and filename (default: `merge.txt` in your workspace root).
5. The merged content is:
   - **Written** to the chosen file.
   - **Copied** to your clipboard.

Each file's content is prefixed with a comment line showing its relative path (or full path if outside the workspace):

// src/utils/helpers.cpp
... file content ...

## Configuration

The extension provides the following settings (go to `File > Preferences > Settings` and search for `cppFileMerger`):

| Setting | Description | Default |
|---------|-------------|---------|
| `cppFileMerger.excludePatterns` | Glob patterns to ignore when adding a folder recursively | `["**/node_modules/**", "**/.git/**", "**/build/**"]` |

You can change these patterns to suit your project (e.g., add `**/dist/**`).

## Commands

All commands are available via the **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`) as well:

- `cppFileMerger.addFiles` – Add selected file(s)
- `cppFileMerger.addFolder` – Add folder recursively
- `cppFileMerger.addOpenEditors` – Add all open editors
- `cppFileMerger.removeFile` – Remove selected item
- `cppFileMerger.removeSelected` – Remove all selected items
- `cppFileMerger.exclude` – Exclude selected item from merge
- `cppFileMerger.include` – Include a previously excluded item
- `cppFileMerger.mergeAndCopy` – Merge, copy and save
- `cppFileMerger.clearList` – Clear the entire list
- `cppFileMerger.configureExcludes` – Open exclusion pattern settings

## Extension Icon

The activity bar icon is a simple “empty window” SVG – it indicates the merge list container.

## Known Issues

- Files outside the current workspace are shown with their full absolute path in the tree; merging them works correctly, but the relative path comment may be the full path.
- If a folder contains a very large number of files, adding it recursively may take a moment.

## Contributing

Bug reports and feature requests are welcome on the [GitHub repository](https://github.com/weerci-source/cpp-file-meger).

## License

MIT – see the [LICENSE](LICENSE) file for details.