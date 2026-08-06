import * as vscode from 'vscode';
import { FileListProvider } from '../providers/fileListProvider';

export function registerAddFiles(context: vscode.ExtensionContext, provider: FileListProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.addFiles', async (contextSelection: vscode.Uri, allSelections: vscode.Uri[]) => {
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

            const added = await provider.addFiles(uris);
            if (added > 0) {
                vscode.window.showInformationMessage(`Added ${added} file(s).`);
            } else {
                vscode.window.showInformationMessage('No valid files added (already in list or not a file).');
            }
        })
    );
}