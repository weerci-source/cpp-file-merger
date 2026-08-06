import * as vscode from 'vscode';
import * as path from 'path';
import { FileListProvider } from '../providers/fileListProvider';
import { MergeService } from '../services/mergeService';

export function registerMergeAndCopy(
    context: vscode.ExtensionContext,
    provider: FileListProvider,
    mergeService: MergeService
) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.mergeAndCopy', async () => {
            const files = provider.getActiveFiles();
            if (files.length === 0) {
                vscode.window.showWarningMessage('List is empty or all files excluded. Add files first.');
                return;
            }

            const { existing, missing } = await mergeService.filterExistingFiles(files);
            if (missing.length > 0) {
                const msg = `Some files no longer exist: ${missing.join(', ')}. Continue with remaining?`;
                const choice = await vscode.window.showWarningMessage(msg, { modal: true }, 'Continue');
                if (!choice) { return; }
            }
            if (existing.length === 0) {
                vscode.window.showErrorMessage('No existing files to merge.');
                return;
            }

            const saveUri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(path.join(
                    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
                    'merge.txt'
                )),
                filters: { 'Text Files': ['txt'] }
            });
            if (!saveUri) { return; }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Merging files...',
                cancellable: false
            }, async (progress) => {
                await mergeService.mergeAndSave(existing, saveUri, progress);
                vscode.window.showInformationMessage(
                    `Merged ${existing.length} file(s) → ${path.basename(saveUri.fsPath)}. Also copied to clipboard.`
                );
            });
        })
    );
}