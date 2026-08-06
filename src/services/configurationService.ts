import * as vscode from 'vscode';

export class ConfigurationService {
    /**
     * Получает массив шаблонов исключений из настроек.
     */
    public static getExcludePatterns(): string[] {
        const config = vscode.workspace.getConfiguration('cppFileMerger');
        return config.get<string[]>('excludePatterns', ['**/node_modules/**']);
    }

    /**
     * Открывает настройки в VS Code с фокусом на параметр excludePatterns.
     */
    public static openSettings(): void {
        vscode.commands.executeCommand('workbench.action.openSettings', 'cppFileMerger.excludePatterns');
    }
}