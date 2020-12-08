'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import {getDiagnostics} from './lexer';

export function activate(context: vscode.ExtensionContext) {
	const collection = vscode.languages.createDiagnosticCollection('nyancat');
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDiagnostics(editor.document, collection);
		}
	}));
}

function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
	if (document && path.basename(document.uri.fsPath).endsWith(".nya")) {
		console.log('fgh');
		//collection.set(document.uri, getDiagnostics(document));
	} else {
		collection.clear();
	}
}
