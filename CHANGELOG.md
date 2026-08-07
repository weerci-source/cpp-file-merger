# Changelog

All notable changes to the "cpp-file-merger" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.2] - 2026-08-07

### Added
- **Multiple folder selection**: The "Add Folder Recursively" command now supports selecting multiple folders at once in the Explorer. All files from every selected folder (recursively, respecting exclude patterns) are added to the merge list.
- Changelog file to document project history.

### Fixed
- (No specific fixes in this release)

### Changed
- (No breaking changes)

## [1.0.0] - 2026-08- 01 (initial release)

### Added
- Initial release of the VS Code File Merger extension.
- Add files, folders, or all open editors to a merge list.
- Exclude/include individual files and folders.
- Merge selected files into a single text file with file path comments, copy to clipboard, and save to disk.
- Configurable exclude patterns (glob) for folder recursion.
- Tree view in the activity bar showing the file list with excluded items clearly marked.
- Multiple context menu commands in the Explorer and the view itself.