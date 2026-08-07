import * as vscode from 'vscode';
import * as path from 'path';
import { FileListProvider } from '../providers/fileListProvider';
import { ConfigurationService } from '../services/configurationService';

export function registerAddFolder(context: vscode.ExtensionContext, provider: FileListProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.addFolder', async (contextSelection: vscode.Uri, allSelections: vscode.Uri[]) => {
            // Приводим к массиву
            let uris: vscode.Uri[] = [];
            if (allSelections && Array.isArray(allSelections) && allSelections.length > 0) {
                uris = allSelections;
            } else if (Array.isArray(contextSelection)) {
                uris = contextSelection;
            } else if (contextSelection) {
                uris = [contextSelection];
            } else {
                vscode.window.showErrorMessage('No file(s) selected.');
                return;
            }

            // Оставляем только папки (на случай, если выбраны файлы)
            const folders: vscode.Uri[] = [];
            for (const uri of uris) {
                try {
                    const stat = await vscode.workspace.fs.stat(uri);
                    if (stat.type === vscode.FileType.Directory) {
                        folders.push(uri);
                    }
                } catch {
                    // игнорируем ошибки доступа
                }
            }

            if (folders.length === 0) {
                vscode.window.showErrorMessage('No valid folders selected.');
                return;
            }

            const excludePatterns = ConfigurationService.getExcludePatterns();
            const allFiles: vscode.Uri[] = [];

            for (const folder of folders) {
                // Проверяем, что папка находится в workspace (необязательно, но безопасно)
                const wsFolder = vscode.workspace.getWorkspaceFolder(folder);
                if (!wsFolder) {
                    vscode.window.showWarningMessage(`Folder "${path.basename(folder.fsPath)}" is not in workspace, skipping.`);
                    continue;
                }

                const pattern = new vscode.RelativePattern(folder, '**/*');
                const files = await vscode.workspace.findFiles(pattern, `{${excludePatterns.join(',')}}`);
                allFiles.push(...files);
            }

            if (allFiles.length === 0) {
                vscode.window.showInformationMessage('No files found in selected folders.');
                return;
            }

            const added = await provider.addFiles(allFiles);
            vscode.window.showInformationMessage(`Added ${added} file(s) from ${folders.length} folder(s).`);
        })
    );
}