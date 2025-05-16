import * as vscode from 'vscode';

export function getLastLines(doc: vscode.TextDocument, currentLine: number, numLines: number): string {
    const startLine = Math.max(0, currentLine - numLines);
    return Array.from({ length:currentLine - startLine + 1 }, (_, i) => 
        doc.lineAt(startLine + i).text
    ).join('\n');
}

export function debounce(fn: Function, delay: number):(...args: any[]) => void {
    let timer: NodeJS.Timeout;
    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };

}