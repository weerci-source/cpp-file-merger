import { NodeItem } from '../models/nodeItem';
import * as vscode from 'vscode';
import { registerAddFiles } from './addFiles';
import { registerAddFolder } from './addFolder';
import { registerAddOpenEditors } from './addOpenEditors';
import { registerRemoveFile } from './removeFile';
import { registerRemoveSelected } from './removeSelected';
import { registerExclude } from './exclude';          
import { registerInclude } from './include';          
import { registerMergeAndCopy } from './mergeAndCopy';
import { registerClearList } from './clearList';
import { registerConfigureExcludes } from './configureExcludes';
import { FileListProvider } from '../providers/fileListProvider';
import { MergeService } from '../services/mergeService';
import { registerAddSelected } from './addSelected';

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
    registerExclude(context, provider);      
    registerInclude(context, provider);      
    registerMergeAndCopy(context, provider, mergeService);
    registerClearList(context, provider);
    registerConfigureExcludes(context);
    registerAddSelected(context, provider);
}