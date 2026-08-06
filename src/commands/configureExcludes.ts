import * as vscode from 'vscode';
import { ConfigurationService } from '../services/configurationService';

export function registerConfigureExcludes(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.configureExcludes', () => {
            ConfigurationService.openSettings();
        })
    );
}