import * as vscode from 'vscode';
import * as path from 'path';
import { FileListProvider } from '../providers/fileListProvider';
import { ConfigurationService } from '../services/configurationService';

export function registerAddSelected(context: vscode.ExtensionContext, provider: FileListProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.addSelected', async (contextSelection: vscode.Uri, allSelections: vscode.Uri[]) => {
            let uris: vscode.Uri[] = [];
            if (allSelections && Array.isArray(allSelections) && allSelections.length > 0) {
                uris = allSelections;
            } else if (Array.isArray(contextSelection)) {
                uris = contextSelection;
            } else if (contextSelection) {
                uris = [contextSelection];
            } else {
                vscode.window.showErrorMessage('No items selected.');
                return;
            }

            const filesToAdd: vscode.Uri[] = [];
            const foldersToScan: vscode.Uri[] = [];

            for (const uri of uris) {
                try {
                    const stat = await vscode.workspace.fs.stat(uri);
                    if (stat.type === vscode.FileType.File) {
                        filesToAdd.push(uri);
                    } else if (stat.type === vscode.FileType.Directory) {
                        foldersToScan.push(uri);
                    }
                } catch {
                    // ignore inaccessible items
                }
            }

            let addedCount = 0;

            // Добавляем файлы напрямую
            if (filesToAdd.length > 0) {
                addedCount += await provider.addFiles(filesToAdd);
            }

            // Обрабатываем папки рекурсивно
            if (foldersToScan.length > 0) {
                const excludePatterns = ConfigurationService.getExcludePatterns();
                const allFolderFiles: vscode.Uri[] = [];

                for (const folder of foldersToScan) {
                    const wsFolder = vscode.workspace.getWorkspaceFolder(folder);
                    if (!wsFolder) {
                        vscode.window.showWarningMessage(`Folder "${path.basename(folder.fsPath)}" is not in workspace, skipping.`);
                        continue;
                    }
                    const pattern = new vscode.RelativePattern(folder, '**/*');
                    const files = await vscode.workspace.findFiles(pattern, `{${excludePatterns.join(',')}}`);
                    allFolderFiles.push(...files);
                }

                if (allFolderFiles.length > 0) {
                    const folderAdded = await provider.addFiles(allFolderFiles);
                    addedCount += folderAdded;
                }
            }

            if (addedCount > 0) {
                vscode.window.showInformationMessage(`Added ${addedCount} file(s).`);
            } else {
                vscode.window.showInformationMessage('No new files added (already in list or no valid files).');
            }
        })
    );
}