"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastLines = getLastLines;
exports.debounce = debounce;
function getLastLines(doc, currentLine, numLines) {
    const startLine = Math.max(0, currentLine - numLines);
    return Array.from({ length: currentLine - startLine + 1 }, (_, i) => doc.lineAt(startLine + i).text).join('\n');
}
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
//# sourceMappingURL=utils.js.map