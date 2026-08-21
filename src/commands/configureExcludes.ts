import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function registerConfigureExcludes(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cppFileMerger.configureExcludes', async () => {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder is open. Please open a project first.');
                return;
            }

            const vscodeDir = path.join(workspaceFolder.uri.fsPath, '.vscode');
            const settingsPath = path.join(vscodeDir, 'settings.json');

            // Создаём папку .vscode, если её нет
            if (!fs.existsSync(vscodeDir)) {
                fs.mkdirSync(vscodeDir, { recursive: true });
            }

            // Создаём settings.json, если его нет, с базовой конфигурацией
            if (!fs.existsSync(settingsPath)) {
                const defaultSettings = {
                    "cppFileMerger.excludePatterns": [
                        "**/node_modules/**",
                        "**/.git/**",
                        "**/build/**",
                        "**/test/**"
                    ]
                };
                fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 4), 'utf-8');
            }

            // Открываем файл в редакторе
            const document = await vscode.workspace.openTextDocument(settingsPath);
            await vscode.window.showTextDocument(document);
        })
    );
}