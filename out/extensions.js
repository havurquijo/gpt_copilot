"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const openai_1 = require("./openai");
async function activate(context) {
    // Comandos para salvar e deletar chave
    context.subscriptions.push(vscode.commands.registerCommand('gptCopilot.setApiKey', () => (0, openai_1.saveApiKey)(context)), vscode.commands.registerCommand('gptCopilot.deleteApiKey', () => (0, openai_1.deleteApiKey)(context)), vscode.commands.registerCommand('gptCopilot.correctSelectedLine', () => (0, openai_1.correctSelectedLines)(context)), 
    // Comando para abrir o painel de chat (webview)
    vscode.commands.registerCommand('gptCopilot.ask', () => openChatPanel(context)));
    // Provedor de sugestões inline
    context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider([
        { language: 'javascript' },
        { language: 'typescript' },
        { language: 'python' },
        { language: 'java' },
        { language: 'c' },
        { language: 'cpp' },
        { language: 'csharp' },
        { language: 'php' },
        { language: 'go' },
        { language: 'ruby' },
        { language: 'rust' },
        { language: 'html' },
        { language: 'css' },
        { language: 'json' },
        { language: 'markdown' },
        { language: 'shellscript' }
    ], {
        async provideInlineCompletionItems(document, position, _context, _token) {
            const linePrefix = document.lineAt(position).text.substring(0, position.character);
            const prompt = `${linePrefix}`;
            const suggestion = await (0, openai_1.askOpenAI)(context, prompt, true);
            if (!suggestion)
                return [];
            return [
                {
                    insertText: suggestion,
                    range: new vscode.Range(position, position)
                }
            ];
        }
    }));
}
function deactivate() { }
// Função que abre o painel de chat com Webview
function openChatPanel(context) {
    const panel = vscode.window.createWebviewPanel('openaiChat', 'Chat GPT OpenAI', vscode.ViewColumn.Beside, {
        enableScripts: true,
    });
    panel.webview.html = getWebviewContent();
    // Armazenar último arquivo enviado
    let lastUploadedFile = null;
    panel.webview.onDidReceiveMessage(async (message) => {
        switch (message.command) {
            case 'ask':
                const question = message.text;
                // Se houver arquivo, inclua no prompt
                const contextText = lastUploadedFile
                    ? `Arquivo: ${lastUploadedFile.fileName}\nConteúdo:\n${lastUploadedFile.content}\n\nPergunta:\n${question}`
                    : question;
                const answer = await (0, openai_1.askOpenAI)(context, contextText);
                panel.webview.postMessage({
                    command: 'answer',
                    text: answer || 'Sem resposta da OpenAI.',
                });
                break;
            case 'upload':
                lastUploadedFile = {
                    fileName: message.fileName,
                    content: message.content,
                };
                vscode.window.showInformationMessage(`Arquivo recebido: ${message.fileName}`);
                break;
        }
    });
}
function getWebviewContent() {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Chat GPT OpenAI</title>
      <style>
        :root { color-scheme: light dark; }

        body {
          font-family: var(--vscode-font-family);
          background-color: var(--vscode-editor-background);
          color: var(--vscode-editor-foreground);
          margin: 0;
          padding: 20px;
        }

        #chat {
          height: 400px;
          overflow-y: auto;
          background: var(--vscode-editorWidget-background);
          border: 1px solid var(--vscode-editorWidget-border);
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 10px;
        }

        .message {
          max-width: 80%;
          margin: 8px 0;
          padding: 10px 15px;
          border-radius: 15px;
          line-height: 1.4;
          white-space: pre-wrap;
        }

        .user {
          background-color: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          margin-left: auto;
        }

        .bot {
          background-color: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
          margin-right: auto;
        }

        #inputRow {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        #input {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--vscode-input-border);
          background-color: var(--vscode-input-background);
          color: var(--vscode-input-foreground);
        }

        #sendBtn, #uploadBtn {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background-color: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          cursor: pointer;
        }

        #sendBtn:hover, #uploadBtn:hover {
          background-color: var(--vscode-button-hoverBackground);
        }

        #fileInput {
          display: none;
        }

        #chatContainer {
          display: flex;
          flex-direction: column;
        }
      </style>
    </head>
    <body>
      <div id="chatContainer">
        <div id="chat"></div>

        <div id="inputRow">
          <input id="input" type="text" placeholder="Digite sua pergunta" />
          <button id="sendBtn">Enviar</button>
          <button id="uploadBtn">📁 Upload</button>
          <input type="file" id="fileInput" accept=".txt,.js,.ts,.py,.json" />
        </div>
      </div>

      <script>
        const vscode = acquireVsCodeApi();
        const chat = document.getElementById('chat');
        const input = document.getElementById('input');
        const sendBtn = document.getElementById('sendBtn');
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');

        function addMessage(text, className) {
          const div = document.createElement('div');
          div.textContent = text;
          div.className = 'message ' + className;
          chat.appendChild(div);
          chat.scrollTop = chat.scrollHeight;
        }

        function sendMessage() {
          const question = input.value.trim();
          if (!question) return;
          addMessage('Você: ' + question, 'user');
          vscode.postMessage({ command: 'ask', text: question });
          input.value = '';
        }

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') sendMessage();
        });

        uploadBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', () => {
          const file = fileInput.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            const content = reader.result;
            vscode.postMessage({ command: 'upload', fileName: file.name, content });
            addMessage('📁 Arquivo enviado: ' + file.name, 'user');
          };
          reader.readAsText(file);
        });

        window.addEventListener('message', event => {
          const message = event.data;
          if (message.command === 'answer') {
            addMessage('OpenAI: ' + message.text, 'bot');
          }
        });
      </script>
    </body>
    </html>
  `;
}
//# sourceMappingURL=extensions.js.map