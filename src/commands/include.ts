import * as vscode from 'vscode';
import { FileListProvider } from '../providers/fileListProvider';
import { NodeItem } from '../models/nodeItem';

export function registerInclude(context: vscode.ExtensionContext, provider: FileListProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.include', (item: NodeItem) => {
            if (!item) {
                vscode.window.showErrorMessage('No item provided.');
                return;
            }
            const uri = item.uri || vscode.Uri.file(item.folderPath || '');
            if (!provider.isExcluded(uri)) {
                vscode.window.showInformationMessage(`${item.getLabelString()} is already included.`);
                return;
            }
            provider.toggleExcludeItem(item); // переключает состояние (снимает исключение)
            vscode.window.showInformationMessage(`${item.getLabelString()} included.`);
        })
    );
}