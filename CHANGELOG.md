# Changelog

All notable changes to the "cpp-file-merger" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-08-21

### Added
- **Unified "Add to Merge List" command** – select any mix of files and folders in the Explorer and add them all at once with a single action (command `cppFileMerger.addSelected`).
- **Smart folder state** – when you exclude a folder, all its contents are excluded. If you then explicitly include a subfolder or a file inside it, that item becomes included, and the parent folder automatically updates its state to "included" (as long as at least one file inside is not excluded). The same happens in reverse: when the last included file inside a folder is excluded, the folder reverts to "excluded".
- **Workspace‑local configuration** – the "Configure Excluded Patterns" button now opens (or creates) the `.vscode/settings.json` file in the current workspace, making the exclude patterns project‑specific and shareable with your team via version control.

### Fixed
- Fixed an activation error (`Cannot read properties of undefined (reading 'filter')`) that occurred when the extension state was missing the new `includedOverrides` field from previous versions.
- Corrected the behavior when toggling exclusion on folders that were implicitly excluded by a parent folder – they now properly include all their files when you choose to include them.

### Changed
- The Explorer context menu now shows a single **"Add to Merge List"** entry instead of separate "Add File(s)" and "Add Folder" entries. The old commands are still available in the Command Palette for backward compatibility.
- The `cppFileMerger.configureExcludes` command now opens the workspace‑local `settings.json` instead of the global user settings, providing a more intuitive and project‑specific configuration experience.

## [1.4.2] - 2026-08-07

### Added
- **Multiple folder selection**: The "Add Folder Recursively" command now supports selecting multiple folders at once in the Explorer. All files from every selected folder (recursively, respecting exclude patterns) are added to the merge list.
- Changelog file to document project history.

### Fixed
- (No specific fixes in this release)

### Changed
- (No breaking changes)

## [1.0.0] - 2026-08-01 (initial release)

### Added
- Initial release of the VS Code File Merger extension.
- Add files, folders, or all open editors to a merge list.
- Exclude/include individual files and folders.
- Merge selected files into a single text file with file path comments, copy to clipboard, and save to disk.
- Configurable exclude patterns (glob) for folder recursion.
- Tree view in the activity bar showing the file list with excluded items clearly marked.
- Multiple context menu commands in the Explorer and the view itself.