import * as vscode from 'vscode';
import fetch from 'node-fetch';

export async function saveApiKey(context: vscode.ExtensionContext) {
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

export async function deleteApiKey(context: vscode.ExtensionContext) {
  await context.secrets.delete('openai-api-key');
  vscode.window.showInformationMessage('Chave da OpenAI apagada com sucesso.');
}

export async function getApiKey(context: vscode.ExtensionContext): Promise<string | undefined> {
  return await context.secrets.get('openai-api-key');
}

export async function askOpenAI(context: vscode.ExtensionContext, customPrompt?: string, inline?: Boolean): Promise<string | null> {
  const apiKey = await getApiKey(context);
  if (!apiKey) {
    vscode.window.showErrorMessage('Chave da API da OpenAI não configurada. Execute "Salvar chave da OpenAI".');
    return null;
  }

  const editor = vscode.window.activeTextEditor;
  let fullPrompt = customPrompt || '';
  let systemPrompt = '';
  let inlineValue = inline || false;

  if (editor && inlineValue) {
    console.log('Editor ativo encontrado, gerando prompt automático.');
    // 🧠 Inline (editor ativo e sem prompt customizado, ou uso automático)
    const document = editor.document;
    const fileName = document.fileName;
    const language = document.languageId;
    const folder = vscode.workspace.asRelativePath(fileName).split('/').slice(0, -1).join('/');

    const lastLines = document.getText(new vscode.Range(
      Math.max(0, document.lineCount - 10), 0,
      document.lineCount, document.lineAt(document.lineCount - 1).range.end.character
    ));

    systemPrompt = `
    Você é um assistente de código dentro de um editor. Sua tarefa é continuar o código ou o texto exatamente da última linha fornecida, **sem repetir ou reescrever o que já existe na última linha**. Não retorne markdown senão for a linguagem principal do texto, não formate o texto, não adicione comentários e não explique nada. Apenas complete o código ou o texto.
    Não explique nem comente, apenas complete o código diretamente.
    `.trim();

    fullPrompt = `
    Arquivo: ${fileName}
    Pasta: ${folder}
    Linguagem: ${language}
    Últimas linhas do código:
    ${lastLines}

    Complete o trecho acima, começando exatamente da próxima parte após a última linha.
    `.trim();

  } else {
    // 💬 Modo chat (customPrompt está presente)
    console.log('Prompt customizado encontrado, gerando prompt de chat.');
    systemPrompt = 'Você é um assistente conversacional técnico. Responda perguntas de forma clara e objetiva, com explicações se necessário.';
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0,
        max_tokens: 500
      })
    });

    const data = await res.json();
    console.log('Resposta da OpenAI:', JSON.stringify(data, null, 2));

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      vscode.window.showErrorMessage('Resposta da OpenAI não veio no formato esperado.');
      return 'Sem resposta da OpenAI.';
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    vscode.window.showErrorMessage('Erro ao conectar com a API da OpenAI.');
    return null;
  }
}

export async function correctSelectedLines(context: vscode.ExtensionContext): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('Abra um arquivo para corrigir uma linha.');
    return;
  }

  const selection = editor.selection;
  const document = editor.document;

  const selectedText = document.getText(selection);
  if (!selectedText.trim()) {
    vscode.window.showInformationMessage('Selecione ao menos uma linha de código para corrigir.');
    return;
  }

  const fileName = document.fileName;
  const language = document.languageId;
  const folder = vscode.workspace.asRelativePath(fileName).split('/').slice(0, -1).join('/');

  const lastLines = document.getText(new vscode.Range(
    Math.max(0, document.lineCount - 10), 0,
    document.lineCount, document.lineAt(document.lineCount - 1).range.end.character
  ));

  const fullPrompt = `
Este é um trecho de código que precisa de correção:

${selectedText}

Considere o contexto do código e faça as correções necessárias:
Arquivo: ${fileName}
Pasta: ${folder}
Linguagem: ${language}
Últimas linhas do código:
${lastLines}

Por favor, retorne apenas o código corrigido com as correções feitas comentadas na linguagem de programação usada.
`.trim();

  const systemPrompt = `
Você é um assistente especializado em correção de código. Corrija o código selecionado, retornando somente o trecho corrigido (em texto plano sem markdown) com comentários de correção na linguagem usada.
`.trim();

  const apiKey = await getApiKey(context);
  if (!apiKey) {
    vscode.window.showErrorMessage('Chave da API da OpenAI não configurada.');
    return;
  }

  console.log("System Prompt:", systemPrompt);
  console.log("Full Prompt:", fullPrompt);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0,
        max_tokens: 300
      })
    });

    const data = await res.json();
    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      vscode.window.showErrorMessage('Resposta inválida da OpenAI.');
      return;
    }

    const correctedCode = data.choices[0].message.content.trim();

    // Substitui a seleção inteira
    await editor.edit(editBuilder => {
      editBuilder.replace(selection, correctedCode);
    });

    vscode.window.showInformationMessage('Código corrigido com sucesso!');
  } catch (error) {
    console.error('Erro ao chamar OpenAI para correção:', error);
    vscode.window.showErrorMessage('Erro ao conectar com a API da OpenAI.');
  }
}


