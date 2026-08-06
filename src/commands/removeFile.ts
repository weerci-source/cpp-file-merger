import * as vscode from 'vscode';
import { FileListProvider } from '../providers/fileListProvider';
import { NodeItem } from '../models/nodeItem';

export function registerRemoveFile(context: vscode.ExtensionContext, provider: FileListProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.removeFile', (item: NodeItem) => {
            if (!item) {
                vscode.window.showErrorMessage('No item provided.');
                return;
            }
            const count = provider.removeItem(item);
            if (count > 0) {
                vscode.window.showInformationMessage(`Removed ${count} item(s).`);
            } else {
                vscode.window.showInformationMessage('Nothing removed.');
            }
        })
    );
}