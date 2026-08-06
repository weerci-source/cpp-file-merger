import * as vscode from 'vscode';
import { FileListProvider } from '../providers/fileListProvider';
import { ConfigurationService } from '../services/configurationService';

export function registerAddFolder(context: vscode.ExtensionContext, provider: FileListProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.addFolder', async (folderUri: vscode.Uri) => {
            if (!folderUri) {
                vscode.window.showErrorMessage('No folder selected.');
                return;
            }
            const wsFolder = vscode.workspace.getWorkspaceFolder(folderUri);
            if (!wsFolder) {
                vscode.window.showErrorMessage('Folder must be inside the current workspace.');
                return;
            }
            const excludePatterns = ConfigurationService.getExcludePatterns();
            const pattern = new vscode.RelativePattern(folderUri, '**/*');
            try {
                const files = await vscode.workspace.findFiles(pattern, `{${excludePatterns.join(',')}}`);
                if (files.length === 0) {
                    vscode.window.showInformationMessage('No files found in the folder.');
                    return;
                }
                const added = await provider.addFiles(files);
                vscode.window.showInformationMessage(`Added ${added} file(s) from folder.`);
            } catch (err) {
                vscode.window.showErrorMessage(`Error reading folder: ${err}`);
            }
        })
    );
}