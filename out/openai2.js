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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveApiKey = saveApiKey;
exports.deleteApiKey = deleteApiKey;
exports.getApiKey = getApiKey;
exports.askOpenAI = askOpenAI;
const vscode = __importStar(require("vscode"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const path = __importStar(require("path"));
async function saveApiKey(context) {
    const apiKey = await vscode.window.showInputBox({
        prompt: 'Digite sua chave da OpenAI',
        ignoreFocusOut: true,
        password: true
    });
    if (apiKey) {
        await context.secrets.store('openai-api-key', apiKey);
        vscode.window.showInformationMessage('Chave da OpenAI salva com segurança!');
    }
}
async function deleteApiKey(context) {
    await context.secrets.delete('openai-api-key');
    vscode.window.showInformationMessage('Chave da OpenAI apagada com sucesso.');
}
async function getApiKey(context) {
    return await context.secrets.get('openai-api-key');
}
async function askOpenAI(context, userPrompt) {
    const apiKey = await getApiKey(context);
    if (!apiKey) {
        vscode.window.showErrorMessage('Chave da API da OpenAI não configurada. Execute "Salvar chave da OpenAI".');
        return null;
    }
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Nenhum editor de texto ativo encontrado.');
        return null;
    }
    const document = editor.document;
    const totalLines = document.lineCount;
    const language = document.languageId;
    const fileName = path.basename(document.fileName);
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const folderStructure = workspaceFolder ? path.relative(workspaceFolder.uri.fsPath, document.uri.fsPath) : fileName;
    // Pega as últimas 10 linhas de código
    const lastLines = [];
    const numContextLines = 10;
    const startLine = Math.max(0, totalLines - numContextLines);
    for (let i = startLine; i < totalLines; i++) {
        lastLines.push(document.lineAt(i).text);
    }
    // Criação de prompt com contexto
    const prompt = `
Você é um assistente de programação.

Aqui está o contexto do projeto:
- Linguagem: ${language}
- Nome do arquivo: ${fileName}
- Estrutura do caminho: ${folderStructure}
- Total de linhas no arquivo: ${totalLines}

Últimas ${numContextLines} linhas do código:
${lastLines.join('\n')}

Solicitação do usuário:
${userPrompt}
  `.trim();
    try {
        const res = await (0, node_fetch_1.default)('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                max_tokens: 256
            })
        });
        const data = await res.json();
        return data?.choices?.[0]?.message?.content?.trim() || null;
    }
    catch (error) {
        console.error('Erro ao chamar OpenAI:', error);
        vscode.window.showErrorMessage('Erro ao conectar com a API da OpenAI.');
        return null;
    }
}
//# sourceMappingURL=openai2.js.map