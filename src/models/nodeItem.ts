import * as vscode from 'vscode';

export class NodeItem extends vscode.TreeItem {
    public children?: NodeItem[];
    public uri?: vscode.Uri;
    public folderPath?: string;
    public excluded: boolean;

    constructor(
        label: string,
        collapsibleState: vscode.TreeItemCollapsibleState,
        uri?: vscode.Uri,
        children?: NodeItem[],
        folderPath?: string,
        excluded: boolean = false
    ) {
        super(label, collapsibleState);
        this.uri = uri;
        this.children = children;
        this.folderPath = folderPath;
        this.excluded = excluded;

        if (uri) {
            this.contextValue = excluded ? 'fileItem.excluded' : 'fileItem';
        } else {
            this.contextValue = excluded ? 'folderItem.excluded' : 'folderItem';
        }

        if (uri) {
            this.resourceUri = uri;
            this.tooltip = uri.fsPath;
            this.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [uri]
            };
            this.iconPath = excluded
                ? new vscode.ThemeIcon('circle-slash')
                : vscode.ThemeIcon.File;
        } else {
            this.iconPath = excluded
                ? new vscode.ThemeIcon('folder-opened')
                : new vscode.ThemeIcon('folder');
        }

        if (excluded) {
            this.description = '[excluded]';
        }
    }

    public getLabelString(): string {
        return typeof this.label === 'string' ? this.label : this.label?.label || '';
    }
}