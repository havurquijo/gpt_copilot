# 🧠 GPT Copilot for VS Code


## 👋 Ei, você aí!

![GPT Copilot VSCode Demo](https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif)

Já está explorando as APIs do GPT e não quer pagar pelo GitHub Copilot?
Mas ainda assim quer **todas aquelas funcionalidades incríveis direto no VS Code**?

Então este projeto é pra você! 🎯

Com esta extensão, você usa **sua própria chave da OpenAI** para ter um assistente inteligente dentro do seu VS Code – com sugestões inline, correções de código, e até um painel de chat amigável. Tudo isso sem depender de serviços pagos adicionais!


## Descrição 

Extensão para o Visual Studio Code que integra a API da OpenAI para fornecer sugestões inteligentes, correções de código e um painel de chat interativo — tudo diretamente no seu editor favorito. 


## Custo

Utilizando uma chave de API da OpenAI com o modelo `gpt-3.5-turbo`, o custo estimado mensal é de aproximadamente **US\$ 3 a US\$ 4**, dependendo do volume de uso.
Você pode consultar os valores atualizados diretamente na [página oficial de preços da OpenAI](https://openai.com/pricing).


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
```

2. Abra no VS Code:

```bash
code gpt-copilot-vscode
```

3. Compile e inicie a extensão (F5 para abrir uma janela de teste)

## 🔐 Configuração da API Key

Execute o comando:

```bash
> GPT Copilot: Set API key
```

Cole sua chave da OpenAI. A chave será armazenada de forma segura.

## 📦 Comandos Disponíveis

| Comando                                                         | Descrição                                |
| --------------------------------------------------------------- | ---------------------------------------- |
| `GPT Copilot: Set API Key`                                      | Salva sua API key                        |
| `GPT Copilot: Apagar chave da OpenAI`                           | Deleta a chave armazenada                |
| `GPT Copilot: Corrigir seleção com VSCode GPT Copilot (OpenAI)` | Envia o trecho selecionado para correção |
| `GPT Copilot: Perguntar ao GPT em chat`                         | Abre o painel lateral com o chat GPT     |

## 🧠 Como Usar

### 1. Sugestões Inline

* Comece a digitar código.
* Pressione `Ctrl + Espaço` para ver sugestões geradas pela IA.

### 2. Correção de Código

* Selecione uma ou mais linhas de código.
* Selecione e faça `Click Direito` no código selecionado e va para a opção `GPT Copilot: Corrigir seleção com VSCode GPT Copilot (OpenAI)`.

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

Desenvolvido com 💙 por \[Hermes A V Urquijo].

