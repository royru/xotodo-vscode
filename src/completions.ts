import * as vscode from 'vscode'

export const completionProvider = vscode.languages.registerCompletionItemProvider(
  { scheme: "file" },
  {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      // only suggest if the line content before `position` comprises `OTODO:`
      const lineContentBefore = document.lineAt(position.line).text.substr(0, position.character)
      if (!lineContentBefore.match(/OTODO:/)) {
        return []
      }

      const now = new Date()

      const today = new vscode.CompletionItem("@due:today",)
      today.insertText = "due:" + dateToString(now)
      today.documentation = "Prints today in the format yyyy-mm-dd."

      const tomorrow = new vscode.CompletionItem("@due:tomorrow")
      tomorrow.insertText = "due:" + dateToString(new Date(now.setDate(now.getDate() + 1)))
      tomorrow.documentation = "Prints tomorrow in the format yyyy-mm-dd."

      const inAWeek = new vscode.CompletionItem("@due:in a week")
      const inAWeekDate = new Date(now.setDate(now.getDate() + 7))
      inAWeek.insertText = "due:" + dateToString(inAWeekDate)
      inAWeek.documentation = "Prints in a week in the format yyyy-mm-dd."

      return [today, tomorrow, inAWeek]
    }
  },
  "@"
)

function dateToString(d: Date): string {
  let m = d.getMonth() + 1
  const month = m < 10 ? "0" + m : m
  const day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
  const year = d.getFullYear()
  return `${year}-${month}-${day}`
}