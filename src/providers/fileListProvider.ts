import * as vscode from 'vscode';
import * as path from 'path';
import { existsSync } from 'fs';
import { NodeItem } from '../models/nodeItem';
import { buildTree, getCommonBasePath } from '../utils/treeBuilder';

export class FileListProvider implements vscode.TreeDataProvider<NodeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<NodeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private fileSet: Set<string> = new Set();
    private excludedSet: Set<string> = new Set();
    private excludedFoldersSet: Set<string> = new Set();
    private rootItems: NodeItem[] = [];

    constructor(private context: vscode.ExtensionContext) {
        const saved = context.workspaceState.get<{
            files: string[];
            excluded: string[];
            excludedFolders: string[];
        }>('cppFileMerger.state', { files: [], excluded: [], excludedFolders: [] });

        this.fileSet = new Set(saved.files.filter(fsPath => existsSync(fsPath)));
        this.excludedSet = new Set(saved.excluded.filter(fsPath => existsSync(fsPath)));
        this.excludedFoldersSet = new Set(saved.excludedFolders.filter(fsPath => existsSync(fsPath)));

        if (this.fileSet.size < saved.files.length) {
            this._saveState();
        }
        this._buildTree();
    }

    private _saveState() {
        this.context.workspaceState.update('cppFileMerger.state', {
            files: Array.from(this.fileSet),
            excluded: Array.from(this.excludedSet),
            excludedFolders: Array.from(this.excludedFoldersSet)
        });
    }

    // ---------- Операции над списком ----------

    public async addFiles(uris: vscode.Uri[]): Promise<number> {
        let added = 0;
        for (const uri of uris) {
            try {
                const stat = await vscode.workspace.fs.stat(uri);
                if (stat.type !== vscode.FileType.File) continue;
            } catch {
                continue;
            }
            const key = uri.fsPath;
            if (!this.fileSet.has(key)) {
                this.fileSet.add(key);
                added++;
            }
        }
        if (added > 0) {
            this._saveState();
            this._buildTree();
            this.refresh();
        }
        return added;
    }

    public removeFile(uri: vscode.Uri): boolean {
        const key = uri.fsPath;
        const removed = this.fileSet.delete(key);
        this.excludedSet.delete(key);
        if (removed) {
            this._saveState();
            this._buildTree();
            this.refresh();
        }
        return removed;
    }

    public removeFiles(uris: vscode.Uri[]): number {
        let removed = 0;
        for (const uri of uris) {
            const key = uri.fsPath;
            if (this.fileSet.delete(key)) {
                this.excludedSet.delete(key);
                removed++;
            }
        }
        if (removed > 0) {
            this._saveState();
            this._buildTree();
            this.refresh();
        }
        return removed;
    }

    public clear() {
        this.fileSet.clear();
        this.excludedSet.clear();
        this.excludedFoldersSet.clear();
        this._saveState();
        this._buildTree();
        this.refresh();
    }

    public getFiles(): vscode.Uri[] {
        return Array.from(this.fileSet).map(fsPath => vscode.Uri.file(fsPath));
    }

    public getActiveFiles(): vscode.Uri[] {
        const active: string[] = [];
        for (const fsPath of this.fileSet) {
            if (!this.isPathExcluded(fsPath)) {
                active.push(fsPath);
            }
        }
        return active.map(p => vscode.Uri.file(p));
    }

    public isPathExcluded(fsPath: string): boolean {
        if (this.excludedSet.has(fsPath)) return true;
        for (const folder of this.excludedFoldersSet) {
            if (fsPath === folder || fsPath.startsWith(folder + path.sep)) {
                return true;
            }
        }
        return false;
    }

    public isExcluded(uri: vscode.Uri): boolean {
        return this.isPathExcluded(uri.fsPath);
    }

    public toggleExcludeItem(item: NodeItem): void {
        if (item.uri) {
            // Файл
            const key = item.uri.fsPath;
            if (this.excludedSet.has(key)) {
                this.excludedSet.delete(key);
            } else {
                this.excludedSet.add(key);
            }
        } else if (item.folderPath) {
            // Папка
            const folder = item.folderPath;
            if (this.excludedFoldersSet.has(folder)) {
                this.excludedFoldersSet.delete(folder);
            } else {
                this.excludedFoldersSet.add(folder);
            }
        } else {
            return;
        }
        this._saveState();
        this._buildTree();
        this.refresh();
    }

    public removeItem(item: NodeItem): number {
        if (item.uri) {
            return this.removeFile(item.uri) ? 1 : 0;
        } else if (item.folderPath) {
            const folder = item.folderPath + path.sep;
            const toRemove: string[] = [];
            for (const filePath of this.fileSet) {
                if (filePath === item.folderPath || filePath.startsWith(folder)) {
                    toRemove.push(filePath);
                }
            }
            if (toRemove.length === 0) return 0;
            let removed = 0;
            for (const fp of toRemove) {
                if (this.fileSet.delete(fp)) {
                    this.excludedSet.delete(fp);
                    removed++;
                }
            }
            if (removed > 0) {
                this._saveState();
                this._buildTree();
                this.refresh();
            }
            return removed;
        }
        return 0;
    }

    public removeItems(items: readonly NodeItem[]): number {
        let total = 0;
        for (const item of items) {
            total += this.removeItem(item);
        }
        return total;
    }

    // ---------- Построение дерева ----------

    private _buildTree() {
        const paths = Array.from(this.fileSet);
        if (paths.length === 0) {
            this.rootItems = [];
            return;
        }

        // Выбираем базовую папку: первый workspace или общий префикс
        const wsFolder = vscode.workspace.workspaceFolders?.[0];
        let basePath: string;
        if (wsFolder) {
            basePath = wsFolder.uri.fsPath;
        } else {
            basePath = getCommonBasePath(paths);
        }

        const isExcluded = (fsPath: string) => this.isPathExcluded(fsPath);
        this.rootItems = buildTree(paths, basePath, isExcluded);
    }

    // ---------- TreeDataProvider ----------

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: NodeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: NodeItem): Promise<NodeItem[]> {
        if (!element) return this.rootItems;
        return element.children || [];
    }
}