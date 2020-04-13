/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EventEmitter, TreeItemCollapsibleState } from 'vscode';
import { AbstractNode, ITreeNode } from './abstractNode';
import { DataProvider } from './dataProvider';
import { RhamtConfiguration, IQuickFix } from '../model/model';
import { ModelService } from '../model/modelService';
import * as path from 'path';
import { ConfigurationNode } from './configurationNode';
import { HintsItem } from './hintsItem';
import { HintNode } from './hintNode';

export class HintsNode extends AbstractNode<HintsItem> {

    private loading: boolean = false;
    private children = [];

    file: string;
    quickfixes: IQuickFix[];
    
    constructor(
        config: RhamtConfiguration,
        file: string,
        modelService: ModelService,
        onNodeCreateEmitter: EventEmitter<ITreeNode>,
        dataProvider: DataProvider,
        root: ConfigurationNode) {
        super(config, modelService, onNodeCreateEmitter, dataProvider);
        this.file = file;
        this.root = root;
        this.quickfixes = this.config.getQuickfixesForResource(this.file);
        this.treeItem = this.createItem();
        this.listen();
    }

    createItem(): HintsItem {
        return new HintsItem(this.file, this.quickfixes.length > 0);
    }

    delete(): Promise<void> {
        return Promise.resolve();
    }

    public getChildren(): Promise<ITreeNode[]> {
        if (this.loading) {
            return Promise.resolve([]);
        }
        return Promise.resolve(this.children);
    }

    public hasMoreChildren(): boolean {
        return this.children.length > 0;
    }

    private listen(): void {
        this.loading = true;
        const base = [__dirname, '..', '..', '..', 'resources'];
        this.treeItem.iconPath = {
            light: path.join(...base, 'light', 'Loading.svg'),
            dark: path.join(...base, 'dark', 'Loading.svg')
        };
        this.treeItem.collapsibleState = TreeItemCollapsibleState.None;
        setTimeout(() => {
            this.treeItem.iconPath = undefined;
            this.loading = false;
            this.refresh(this);
        }, 1000);
    }

    protected refresh(node?: ITreeNode): void {
        const unsorted = this.root.getChildNodes(this);
        this.children = unsorted.sort(HintsNode.compareHint);
        this.children.forEach(child => child.parentNode = this);
        this.treeItem.refresh(this.children.length);
        super.refresh(node);
    }

    static compareHint(node1: ITreeNode, node2: ITreeNode): number {
        const one = (node1 as HintNode).hint.lineNumber;
        const other = (node2 as HintNode).hint.lineNumber;
        const a = one || 0;
        const b = other || 0;
        if (a !== b) {
            return a < b ? -1 : 1;
        }
        return 0;
    }
}
