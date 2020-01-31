/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { TreeItem, Uri, TreeItemCollapsibleState, Command } from 'vscode';
import { ModelService } from '../model/modelService';
import { IHint, IIssue, IssueContainer } from '../model/model';
import * as path from 'path';

export class HintItem extends TreeItem implements IssueContainer {

    private _id: string = ModelService.generateUniqueId();
    collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None;

    private hint: IHint;

    constructor(hint: IHint) {
        super(hint.title);
        this.hint = hint;
        this.refresh();
    }

    delete(): void {
    }

    private getIconPath(): string | Uri | { light: string | Uri; dark: string | Uri } | undefined {
        const base = [__dirname, '..', '..', '..', 'resources'];
        if (this.hint.complete) {
            return process.env.CHE_WORKSPACE_NAMESPACE ? 'fa medium-green fa-check' :  {
                light: path.join(...base, 'light', 'complete.svg'),
                dark: path.join(...base, 'dark', 'complete.svg')
            };
        }
        else if (!this.hint.category || this.hint.category.includes('error') || this.hint.category.includes('mandatory')) {
            return process.env.CHE_WORKSPACE_NAMESPACE ? 'fa medium-red fa-times-circle' : {
                light: path.join(...base, 'light', 'status-error.svg'),
                dark: path.join(...base, 'dark', 'status-error-inverse.svg')
            };
        }
        else if (this.hint.category.includes('potential')) {
            return process.env.CHE_WORKSPACE_NAMESPACE ? 'fa fa-exclamation-triangle medium-yellow' : {
                light: path.join(...base, 'light', 'status-warning.svg'),
                dark: path.join(...base, 'dark', 'status-warning-inverse.svg')
            };
        }
        return process.env.CHE_WORKSPACE_NAMESPACE ? 'fa fa-question-circle-o medium-blue' : {
            light: path.join(...base, 'light', 'status-info.svg'),
            dark: path.join(...base, 'dark', 'status-info-inverse.svg')
        };
    }

    public get id(): string {
        return this._id;
    }

    public get tooltip(): string {
        return this.hint.hint;
    }

    public get commandId(): string {
        return 'rhamt.openDoc';
    }

    public getIssue(): IIssue {
        return this.hint;
    }

    public setComplete(): void {
    }

    public getUri(): string {
        return this.hint.file;
    }

    public getLineNumber(): number {
        return this.hint.lineNumber - 1;
    }

    public getColumn(): number {
        return this.hint.column;
    }

    public getLength(): number {
        return this.hint.length + this.hint.column;
    }

    public get command(): Command {
        return process.env.CHE_WORKSPACE_NAMESPACE ? undefined : {
            command: 'rhamt.openDoc',
            title: '',
            arguments: [this]
        };
    }

    public get contextValue(): string {
        return 'issue';
    }

    public refresh(): void {
        this.iconPath = this.getIconPath();
        this.label = `${this.hint.title} [rule-id: ${this.hint.ruleId}]`;
        this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    }
}