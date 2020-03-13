/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ConfigurationEditor } from './configurationEditor';
import { ExtensionContext } from 'vscode';
import { Endpoints, RhamtConfiguration } from '../model/model';
import * as vscode from 'vscode';

export class ConfigurationEditorService {

    private editors: Map<string, ConfigurationEditor> = new Map<string, ConfigurationEditor>();
    private context: ExtensionContext;
    private endpoints: Endpoints;

    constructor(endpoints: Endpoints, context: ExtensionContext) {
        this.endpoints = endpoints;
        this.context = context;
    }

    async openConfiguration(configuration: RhamtConfiguration, view?: vscode.WebviewPanel): Promise<void> {
        let editor = this.editors.get(configuration.id);
        if (!editor) {
            editor = new ConfigurationEditor(configuration, this.endpoints, this.context, view);
            this.editors.set(configuration.id, editor);
        }
        await editor.open();
    }

    closeEditor(configuration: RhamtConfiguration) {
        let editor = this.editors.get(configuration.id);
        if (editor) {
            editor.close();
            this.editors.delete(configuration.id);
        }
    }
}