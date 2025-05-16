Claro! Com base em toda nossa conversa, aqui está um `README.md` completo e profissional para seu projeto de extensão do VS Code que integra a API da OpenAI:

---

````markdown
# 🧠 GPT Copilot for VS Code

Extensão para o Visual Studio Code que integra a API da OpenAI para fornecer sugestões inteligentes, correções de código e um painel de chat interativo — tudo diretamente no seu editor favorito.

## ✨ Funcionalidades

- 💬 **Painel de Chat** com interface integrada ao VS Code
- 🤖 **Sugestões em tempo real** no editor (autocomplete inteligente)
- 🛠️ **Correção de trechos de código selecionados**
- 📂 **Upload de arquivos** como contexto para o modelo
- 🌙 Suporte ao tema atual do VS Code (claro/escuro)
- 🔐 Gerenciamento de chave da API OpenAI
- 💡 Suporte a múltiplas linguagens de programação

## 🧪 Linguagens Suportadas

- JavaScript
- TypeScript
- Python
- Java
- C, C++, C#
- PHP
- Go
- Ruby
- Rust
- HTML, CSS
- JSON, Markdown
- Shell Script
- _(e outras via suporte global opcional)_

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/gpt-copilot-vscode.git
````

2. Abra no VS Code:

   ```bash
   code gpt-copilot-vscode
   ```

3. Compile e inicie a extensão (F5 para abrir uma janela de teste)

## 🔐 Configuração da API Key

Execute o comando:

```bash
> GPT Copilot: Definir Chave da API
```

Cole sua chave da OpenAI. A chave será armazenada de forma segura.

## 📦 Comandos Disponíveis

| Comando                                    | Descrição                                |
| ------------------------------------------ | ---------------------------------------- |
| `GPT Copilot: Definir Chave da API`        | Salva sua API key                        |
| `GPT Copilot: Remover Chave da API`        | Deleta a chave armazenada                |
| `GPT Copilot: Corrigir Código Selecionado` | Envia o trecho selecionado para correção |
| `GPT Copilot: Abrir Chat`                  | Abre o painel lateral com o chat GPT     |

## 🧠 Como Usar

### 1. Sugestões Inline

* Comece a digitar código.
* Pressione `Ctrl + Espaço` para ver sugestões geradas pela IA.

### 2. Correção de Código

* Selecione uma ou mais linhas de código.
* Execute: `GPT Copilot: Corrigir Código Selecionado`.

### 3. Chat com o GPT

* Execute: `GPT Copilot: Abrir Chat`
* Use a interface para conversar com o modelo.
* Envie mensagens, anexe arquivos de contexto e receba respostas inteligentes.

## 🗂 Upload de Arquivos (no painel)

* Clique em **Selecionar Arquivo** para enviar um arquivo que servirá como contexto da pergunta.
* O conteúdo do arquivo é lido localmente e enviado junto com sua pergunta.

## 🧑‍💻 Desenvolvimento

### Estrutura principal:

* `extension.ts` – Código da extensão principal
* `getWebviewContent.ts` – HTML + JS do painel de chat
* `askOpenAI.ts` – Comunicação com a API da OpenAI
* `utils.ts` – Manipulação da chave da API e helpers
* `correctSelectedLines.ts` – Correção de código selecionado

## 🧰 Requisitos

* Node.js
* VS Code
* Conta e chave da OpenAI

## 📄 Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

Desenvolvido com 💙 por \[hermes A V Urquijo].

