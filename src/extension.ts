import * as vscode from 'vscode';
import { FileListProvider } from './providers/fileListProvider';
import { MergeService } from './services/mergeService';
import { registerAllCommands } from './commands';

export function activate(context: vscode.ExtensionContext) {
    const provider = new FileListProvider(context);
    const mergeService = new MergeService();

    const treeView = vscode.window.createTreeView('weerci-source.cppFileMerger.fileList', {
        treeDataProvider: provider,
        showCollapseAll: false,
        canSelectMany: true,
    });
    context.subscriptions.push(treeView);

    // Автопоказ контейнера
    vscode.commands.executeCommand('workbench.view.extension.cppFileMergerContainer');

    // Регистрируем все команды
    registerAllCommands(context, provider, treeView, mergeService);
}

export function deactivate() {}