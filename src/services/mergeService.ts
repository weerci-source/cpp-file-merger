import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

export class MergeService {
    /**
     * Проверяет существование файлов и возвращает список существующих.
     */
    public async filterExistingFiles(uris: vscode.Uri[]): Promise<{
        existing: vscode.Uri[];
        missing: string[];
    }> {
        const existing: vscode.Uri[] = [];
        const missing: string[] = [];
        for (const uri of uris) {
            try {
                await fs.access(uri.fsPath);
                existing.push(uri);
            } catch {
                missing.push(path.basename(uri.fsPath));
            }
        }
        return { existing, missing };
    }

    /**
     * Выполняет слияние файлов: читает содержимое, добавляет комментарии,
     * записывает в целевой файл и копирует в буфер обмена.
     */
    public async mergeAndSave(
        uris: vscode.Uri[],
        saveUri: vscode.Uri,
        progress: vscode.Progress<{ message?: string; increment?: number }>
    ): Promise<void> {
        let merged = '';
        for (let i = 0; i < uris.length; i++) {
            const uri = uris[i];
            const wsFolder = vscode.workspace.getWorkspaceFolder(uri);
            const displayName = wsFolder
                ? path.relative(wsFolder.uri.fsPath, uri.fsPath)
                : path.basename(uri.fsPath);
            progress.report({
                message: `Processing ${path.basename(uri.fsPath)}`,
                increment: ((i + 1) / uris.length) * 100
            });
            try {
                const content = await fs.readFile(uri.fsPath, 'utf-8');
                merged += `// ${displayName}\n${content}\n\n`;
            } catch (err: any) {
                throw new Error(`Failed to read ${displayName}: ${err.message}`);
            }
        }

        // Копируем в буфер
        await vscode.env.clipboard.writeText(merged);

        // Записываем в файл
        try {
            await fs.writeFile(saveUri.fsPath, merged, 'utf-8');
        } catch (err: any) {
            throw new Error(`Failed to save file: ${err.message}`);
        }
    }
}