import * as vscode from 'vscode'

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

  let activeEditor = vscode.window.activeTextEditor
  let timeout: NodeJS.Timer | undefined = undefined

  // create a decorator type that we use to decorate small numbers
  const otodoDecorationType = vscode.window.createTextEditorDecorationType({
    color: '#000',
    outlineWidth: '2px',
    backgroundColor: '#ffbd2a',
    overviewRulerColor: 'rgba(255,189,42,0.8)',
  })

  const xtodoDecorationType = vscode.window.createTextEditorDecorationType({
    opacity: '0.6',
    textDecoration: 'line-through'
  })

  function updateDecorations() {
    if (!activeEditor) {
      return
    }
    const text = activeEditor.document.getText()
    const otodos: vscode.DecorationOptions[] = []
    const xtodos: vscode.DecorationOptions[] = []
    let match
    const ro = /OTODO:/g
    while ((match = ro.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index)
      const endPos = activeEditor.document.positionAt(match.index + match[0].length)
      const decoration = { range: new vscode.Range(startPos, endPos) }
      otodos.push(decoration)
    }
    match = null
    const rx = /XTODO:/g
    while ((match = rx.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index)
      const endPos = activeEditor.document.lineAt(startPos.line).range.end
      // const endPos = activeEditor.document.positionAt(match.index + match[0].length)
      const decoration = { range: new vscode.Range(startPos, endPos) }
      xtodos.push(decoration)
    }
    activeEditor.setDecorations(otodoDecorationType, otodos)
    activeEditor.setDecorations(xtodoDecorationType, xtodos)
  }

  function triggerUpdateDecorations(throttle: boolean = false) {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    if (throttle) {
      timeout = setTimeout(updateDecorations, 500)
    } else {
      updateDecorations()
    }
  }

  if (activeEditor) {
    triggerUpdateDecorations()
  }

  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeEditor = editor
    if (editor) {
      triggerUpdateDecorations()
    }
  }, null, context.subscriptions)

  vscode.workspace.onDidChangeTextDocument(event => {
    if (activeEditor && event.document === activeEditor.document) {
      triggerUpdateDecorations(true)
    }
  }, null, context.subscriptions)
}