import { NodeItem } from '../models/nodeItem';
import * as vscode from 'vscode';
import { registerAddFiles } from './addFiles';
import { registerAddFolder } from './addFolder';
import { registerAddOpenEditors } from './addOpenEditors';
import { registerRemoveFile } from './removeFile';
import { registerRemoveSelected } from './removeSelected';
import { registerExclude } from './exclude';          // новый
import { registerInclude } from './include';          // новый
import { registerMergeAndCopy } from './mergeAndCopy';
import { registerClearList } from './clearList';
import { registerConfigureExcludes } from './configureExcludes';
import { FileListProvider } from '../providers/fileListProvider';
import { MergeService } from '../services/mergeService';

export function registerAllCommands(
    context: vscode.ExtensionContext,
    provider: FileListProvider,
    treeView: vscode.TreeView<NodeItem>,
    mergeService: MergeService
): void {
    registerAddFiles(context, provider);
    registerAddFolder(context, provider);
    registerAddOpenEditors(context, provider);
    registerRemoveFile(context, provider);
    registerRemoveSelected(context, treeView, provider);
    registerExclude(context, provider);       // добавлено
    registerInclude(context, provider);       // добавлено
    registerMergeAndCopy(context, provider, mergeService);
    registerClearList(context, provider);
    registerConfigureExcludes(context);
}