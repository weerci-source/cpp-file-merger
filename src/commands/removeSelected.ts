import * as vscode from 'vscode';
import { FileListProvider } from '../providers/fileListProvider';
import { NodeItem } from '../models/nodeItem';

export function registerRemoveSelected(
    context: vscode.ExtensionContext,
    treeView: vscode.TreeView<NodeItem>,
    provider: FileListProvider
) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.removeSelected', () => {
            const selectedItems = treeView.selection;
            if (selectedItems.length === 0) {
                vscode.window.showWarningMessage('No items selected.');
                return;
            }
            const count = provider.removeItems(selectedItems);
            vscode.window.showInformationMessage(`Removed ${count} item(s).`);
        })
    );
}