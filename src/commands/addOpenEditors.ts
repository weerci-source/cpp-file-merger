import * as vscode from 'vscode';
import { FileListProvider } from '../providers/fileListProvider';

export function registerAddOpenEditors(context: vscode.ExtensionContext, provider: FileListProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.addOpenEditors', async () => {
            const uris = vscode.workspace.textDocuments
                .filter(doc => doc.uri.scheme === 'file')
                .map(doc => doc.uri);
            if (uris.length === 0) {
                vscode.window.showInformationMessage('No open editors.');
                return;
            }
            const added = await provider.addFiles(uris);
            vscode.window.showInformationMessage(`Added ${added} open editor(s).`);
        })
    );
}