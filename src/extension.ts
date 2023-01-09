import * as vscode from 'vscode'
import { completionProvider } from './completions'
import { onDidChangeActiveTextEditor, onDidChangeTextDocument } from './decorations'

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(completionProvider)
  vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor, null, context.subscriptions)
  vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument, null, context.subscriptions)
}