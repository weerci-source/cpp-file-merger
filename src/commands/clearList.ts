import * as vscode from 'vscode';
import { FileListProvider } from '../providers/fileListProvider';

export function registerClearList(context: vscode.ExtensionContext, provider: FileListProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.clearList', () => {
            provider.clear();
            vscode.window.showInformationMessage('List cleared.');
        })
    );
}