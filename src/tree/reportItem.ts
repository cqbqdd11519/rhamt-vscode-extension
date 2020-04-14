/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { TreeItem, Uri, TreeItemCollapsibleState, Command } from 'vscode';
import * as path from 'path';
import { ReportHolder, RhamtConfiguration } from '../model/model';

export class ReportItem extends TreeItem implements ReportHolder {

    static LABEL = 'Report';
    private config: RhamtConfiguration;
    collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None;


    constructor(config: RhamtConfiguration) {
        super(ReportItem.LABEL);
        this.config = config;
    }

    delete(): void {
    }

    public get iconPath(): string | Uri | { light: string | Uri; dark: string | Uri } | undefined {
        const base = [__dirname, '..', '..', '..', 'resources'];
        return process.env.CHE_WORKSPACE_NAMESPACE ? 'fa fa-line-chart medium-blue' : {
            light: path.join(...base, 'light', 'file_type_log.svg'),
            dark: path.join(...base, 'dark', 'file_type_log.svg')
        };
    }

    public get tooltip(): string {
        return '';
    }

    public get commandId(): string {
        return 'rhamt.openReport';
    }

    getReport(): string {
        return this.config.getReport();
    }

    public get command(): Command {
        return process.env.CHE_WORKSPACE_NAMESPACE ? undefined : {
            command: 'rhamt.openReport',
            title: '',
            arguments: [this]
        };
    }

    public get contextValue(): string {
        return 'report';
    }
}