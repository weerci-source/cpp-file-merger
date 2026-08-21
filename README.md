# File Merger for VS Code

Easily combine the contents of multiple files into a single document, with each original file path shown as a comment.  
Perfect for sharing code context, preparing documentation, or merging source files.

The result is copied to your clipboard and saved to a file in one click.

## Features

- **Add files and folders in one go** – select any mix of files and folders in the Explorer and add them all at once.
- **Recursive folder scanning** – all files inside folders are added, respecting configurable exclusion patterns.
- **Add open editors** – quickly add all files currently open in the editor.
- **Tree view** – see your files in a collapsible folder hierarchy, sorted alphabetically.
- **Smart exclude/include** – exclude a folder to hide all its contents, then include specific subfolders or files inside it – the parent folder’s state updates automatically.
- **Remove items** – delete single files/folders or multiple selected items at once.
- **Clear the list** – remove everything in one click.
- **Persistent state** – the merge list survives editor restarts.
- **Merge, copy & save** – combine all active (non‑excluded) files, copy the merged text to the clipboard, and save it as a text file.
- **Workspace‑local configuration** – exclude patterns are stored in your project’s `.vscode/settings.json`, so they can be shared with your team.
  Add a condition to settings.json, for example:
```json
"cppFileMerger.excludePatterns": [
    "**/node_modules/**",
    "**/.git/**",
    "**/build/**",
    "**/*.test",
]
```  
Explanation:  
** – means that the folder will be hidden at any nesting depth relative to the current directory.  
\* – any sequence of characters, but only within the same directory level.  
The combination **/*.test – will hide all files with the .test extension, at any depth. 

## Installation

1. Open VS Code and go to the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for `File Merger`.
3. Click **Install**.

Or install from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=weerci-code.cpp-file-merger)

## Getting Started

1. Open your project in VS Code.
2. In the Explorer, **select any files and/or folders** (you can mix them), right‑click, and choose **Add to Merge List**.
   - Files are added directly.
   - Folders are scanned recursively, respecting the exclude patterns (see Configuration below).
3. Alternatively, use the title bar button **Add all Open Editors** to quickly add everything you're working on.
4. Open the **Merge List** panel from the activity bar (the icon with overlapping windows).

## Managing the List

The Merge List panel shows your files in a tree:

- **Expand folders** to see individual files.
- **Click any file** to open it in the editor.
- **Inline actions** appear when you hover over a file or folder:
  - **Exclude / Include** – toggle whether this item is merged.
    - If you exclude a folder, all its files become excluded.
    - You can then include a subfolder or a specific file inside it – that item will be included, and the parent folder will automatically change its state to included (as long as at least one file inside it is not excluded).
  - **Remove** – delete the item from the list.
- Use the title bar buttons:
  - **Merge, Copy and Save** – starts the merge process.
  - **Add all Open Editors** – import open files.
  - **Remove Selected** – deletes currently selected items (select multiple with `Ctrl`/`Cmd`).
  - **Clear List** – empties the entire list.
  - **Configure Excluded Patterns** – opens the local `.vscode/settings.json` file for your workspace (creating it if necessary) so you can edit the exclude patterns.

## Merging

1. Make sure your list contains the files you want to combine. **Excluded files will be ignored**.
2. Click the **Merge, Copy and Save** button (combine icon) in the panel title.
3. The extension checks that all files still exist. If some are missing, you'll be asked whether to continue with the remaining ones.
4. A save dialog appears – choose a location and filename (default: `merge.txt` in your workspace root).
5. The merged content is:
   - **Written** to the chosen file.
   - **Copied** to your clipboard.

Each file's content is prefixed with a comment line showing its relative path (or full path if outside the workspace):

```cpp
// src/utils/helpers.cpp
... file content ...