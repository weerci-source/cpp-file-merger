import * as path from 'path';
import * as vscode from 'vscode';
import { NodeItem } from '../models/nodeItem';

/**
 * Строит дерево из списка абсолютных путей.
 * @param paths - массив абсолютных путей файлов
 * @param basePath - корневая папка (относительно которой строятся пути)
 * @param isExcludedFn - функция проверки, исключён ли файл или папка
 * @returns корневые элементы дерева (массив NodeItem)
 */
export function buildTree(
    paths: string[],
    basePath: string,
    isExcludedFn: (fsPath: string) => boolean
): NodeItem[] {
    if (paths.length === 0) {
        return [];
    }

    const root = new NodeItem('', vscode.TreeItemCollapsibleState.None);
    root.children = [];

    for (const fullPath of paths) {
        let relative = path.relative(basePath, fullPath);
        if (relative === '' || relative.startsWith('..')) {
            // файл вне базовой папки – корневой элемент с полным путём
            const excluded = isExcludedFn(fullPath);
            const node = new NodeItem(
                fullPath,
                vscode.TreeItemCollapsibleState.None,
                vscode.Uri.file(fullPath),
                undefined,
                undefined,
                excluded
            );
            root.children!.push(node);
            continue;
        }

        const segments = relative.split(path.sep);
        let current = root;
        let currentPath = basePath;
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            const isLast = (i === segments.length - 1);
            const childPath = path.join(currentPath, seg);

            let child = current.children?.find(c => c.getLabelString() === seg);
            if (!child) {
                const collapsible = isLast
                    ? vscode.TreeItemCollapsibleState.None
                    : vscode.TreeItemCollapsibleState.Collapsed;
                const uri = isLast ? vscode.Uri.file(fullPath) : undefined;
                const folderPath = isLast ? undefined : childPath;
                let excluded = false;
                if (isLast) {
                    excluded = isExcludedFn(fullPath);
                } else {
                    excluded = isExcludedFn(childPath);
                }
                child = new NodeItem(
                    seg,
                    collapsible,
                    uri,
                    undefined,
                    folderPath,
                    excluded
                );
                if (!current.children) current.children = [];
                current.children.push(child);
            }
            current = child;
            currentPath = childPath;
        }
    }

    const rootItems = root.children || [];
    sortNodes(rootItems);
    return rootItems;
}

/**
 * Сортирует узлы: папки перед файлами, затем по алфавиту.
 */
export function sortNodes(nodes: NodeItem[]): void {
    nodes.sort((a, b) => {
        const aIsFolder = a.children && a.children.length > 0;
        const bIsFolder = b.children && b.children.length > 0;
        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;
        return a.getLabelString().localeCompare(b.getLabelString());
    });
    for (const node of nodes) {
        if (node.children) {
            sortNodes(node.children);
        }
    }
}

/**
 * Определяет общий префикс для всех путей (для выбора базовой папки).
 */
export function getCommonBasePath(paths: string[]): string {
    if (paths.length === 0) return '';
    const sorted = paths.slice().sort();
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    let i = 0;
    while (i < first.length && i < last.length && first[i] === last[i]) i++;
    const common = first.substring(0, i);
    const lastSep = common.lastIndexOf(path.sep);
    return lastSep >= 0 ? common.substring(0, lastSep) : path.dirname(first);
}