# Guia de Integração com Ferramentas de IA

Este guia detalha como integrar o **MCP GitHub Project Manager** com várias ferramentas de desenvolvimento assistidas por IA, como Claude Desktop, GitHub Copilot, Cursor e outras.

> 🔑 **Passo 0**: [Gere seu token do GitHub agora (link direto com escopos pré-configurados)](https://github.com/settings/tokens/new?description=MCP%20GitHub%20Project%20Manager&scopes=repo)

## 1. Claude Desktop (Integração Direta)

O Claude Desktop é a maneira mais poderosa de usar este MCP, pois oferece suporte nativo ao Model Context Protocol.

### Configuração

1.  **Localize o arquivo de configuração do Claude Desktop:**
    *   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
    *   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
    *   **Linux**: `~/.config/Claude/claude_desktop_config.json`

2.  **Adicione a configuração do servidor MCP:**

    Abra o arquivo e adicione a seguinte entrada ao objeto `mcpServers`. **Certifique-se de usar o caminho absoluto** para o arquivo `index.js` do seu MCP.

    ```json
    {
      "mcpServers": {
        "github-project-manager": {
          "command": "node",
          "args": ["/caminho/absoluto/para/seu/mcp-github-project/dist/index.js"],
          "env": {
            "GITHUB_TOKEN": "seu_token_pessoal_do_github",
            "GITHUB_OWNER": "seu_usuario_ou_organizacao",
            "GITHUB_REPO": "nome_do_seu_repositorio_de_memoria"
          }
        }
      }
    }
    ```

3.  **Reinicie o Claude Desktop.**

4.  **Verifique a Conexão:**
    Ao iniciar uma nova conversa, o Claude deve indicar que o servidor `github-project-manager` está conectado e pronto para uso.

### Exemplo de Uso

> **Você**: "Usando o `github-project-manager`, leia o arquivo `README.md` e me dê um resumo do projeto."

> **Claude**: *[Executa a ferramenta `read_file` do MCP e retorna o resumo]*

---

## 2. GitHub Copilot Chat (VS Code)

O GitHub Copilot não tem suporte nativo ao MCP, mas você pode "ensiná-lo" a usar o seu repositório de memória de forma eficaz através de prompts e contexto.

### Estratégia: Contexto Aumentado

A ideia é trazer o conteúdo relevante do seu repositório de memória para o chat do Copilot, para que ele possa usá-lo como base para suas respostas e sugestões.

### Passos

1.  **Abra o Repositório de Memória no VS Code:**
    Tenha o seu repositório de memória (o que contém a documentação gerada pelo MCP) aberto no VS Code. Isso permite que o Copilot indexe os arquivos.

2.  **Use o `@workspace` para Focar no Contexto:**
    Inicie suas perguntas no chat do Copilot com `@workspace` para instruí-lo a focar nos arquivos do seu projeto aberto.

    > **Exemplo**: "`@workspace` com base na documentação de arquitetura, qual é a stack tecnológica deste projeto?"

3.  **Copie e Cole Conteúdo Relevante:**
    Para tarefas específicas, copie o conteúdo de um arquivo do seu repositório de memória e cole-o no chat antes de fazer sua pergunta.

    > **Exemplo**:
    > 
    > **Você**:
    > "Aqui está o nosso guia de estilo de componentes (`docs/STYLING.md`):
    > 
    > *[...conteúdo do arquivo...]*
    > 
    > Agora, refatore este componente React para seguir essas diretrizes:
    > 
    > *[...código do componente...]*"

4.  **Crie Comandos Personalizados (`/`):**
    Use os "slash commands" do Copilot para criar atalhos para tarefas comuns. Você pode definir seus próprios comandos nas configurações do VS Code.

    > **Exemplo de comando personalizado `/.docs`**:
    > "Busque no `@workspace` por documentação relacionada a `{sua_pergunta}` e forneça um resumo."

### Workflow Recomendado

1.  **Início do dia**: "`@workspace` qual o status atual do projeto baseado no `config.json` e no `README.md`?"
2.  **Durante o desenvolvimento**: "Preciso criar um novo componente de `UserProfile`. Com base no `docs/COMPONENTS.md` e nos componentes existentes em `src/components`, gere um template inicial para mim."
3.  **Antes de um commit**: "Revise este código e verifique se ele segue as melhores práticas descritas em `guides/best-practices.md`."

---

## 3. Cursor (Editor de Código Focado em IA)

O Cursor é um fork do VS Code com integração de IA mais profunda. A estratégia é semelhante à do Copilot, mas com recursos mais poderosos.

### Estratégia: Base de Conhecimento e Foco em Arquivos

O Cursor permite que você adicione arquivos específicos ao contexto da conversa de forma mais explícita.

### Passos

1.  **Adicione o Repositório de Memória ao Projeto:**
    Tenha tanto o seu projeto de trabalho quanto o repositório de memória abertos no Cursor.

2.  **Use o `@` para Referenciar Arquivos:**
    O Cursor permite referenciar arquivos diretamente no chat usando o símbolo `@`. Isso é extremamente poderoso.

    > **Exemplo**: "Refatore este código em `meu-projeto-de-trabalho/src/components/Button.tsx` para seguir as diretrizes de estilo definidas em `@memoria-do-projeto/docs/STYLING.md`."

3.  **Crie uma Base de Conhecimento (`Codebase`)**: 
    O Cursor permite indexar uma pasta inteira como base de conhecimento. Use isso com seu repositório de memória.

    > **Instrução**: "Indexe a pasta `@memoria-do-projeto` como a base de conhecimento principal para este projeto."

4.  **Converse com sua Documentação:**
    Após indexar, você pode fazer perguntas diretas sobre sua documentação.

    > **Exemplo**: "Quais são os passos para fazer o deploy da aplicação?" (O Cursor buscará a resposta em `docs/DEPLOYMENT.md`).

### Workflow Recomendado

1.  **Configuração inicial**: Use o comando `Cmd+K` (ou `Ctrl+K`) e adicione a pasta do seu repositório de memória à conversa.
2.  **Desenvolvimento**: Selecione um trecho de código, pressione `Cmd+K`, e diga: "Explique este código usando o contexto de `@memoria-do-projeto/docs/ARCHITECTURE.md`."
3.  **Criação de código**: "Gere um novo serviço Node.js para gerenciar usuários, seguindo o padrão de `error-handling` definido em `@memoria-do-projeto/guides/error-handling.md`."

---

## 4. Outras Ferramentas (ChatGPT, Gemini, etc.)

Para IAs que não têm acesso direto ao seu sistema de arquivos, a estratégia é fornecer o contexto manualmente.

### Estratégia: Injeção de Contexto Manual

1.  **Prompt de Sistema Personalizado:**
    Se a ferramenta permitir, configure um "Custom Instruction" ou "System Prompt" para informar à IA sobre a estrutura do seu projeto.

    > **Exemplo de Instrução Personalizada**:
    > "Você é um assistente especialista no projeto `{nome_do_projeto}`. A estrutura de documentação é a seguinte: `docs/` para guias, `decisions/` para ADRs, `team/` para informações da equipe. Sempre que eu fornecer conteúdo de um desses arquivos, use-o como fonte primária de verdade."

2.  **Copiar e Colar é seu Melhor Amigo:**
    Para cada tarefa, copie e cole o conteúdo relevante dos arquivos do seu repositório de memória no início do prompt.

    > **Exemplo**:
    > "Contexto do `docs/API.md`:
    > *[...conteúdo do arquivo...]*
    > 
    > Contexto do `guides/best-practices.md`:
    > *[...conteúdo do arquivo...]*
    > 
    > **Minha Tarefa**:
    > Crie um novo endpoint de API que segue as melhores práticas e o padrão de documentação acima."

## Conclusão

-   **Claude Desktop**: A melhor experiência, com integração direta via MCP.
-   **Cursor**: Excelente para desenvolvimento, permitindo referenciar arquivos de documentação diretamente.
-   **GitHub Copilot**: Bom para contexto no nível do workspace, mas requer mais esforço manual.
-   **Outras IAs**: Totalmente manual, mas ainda útil se você fornecer o contexto de forma consistente.

A chave para o sucesso é **trazer o conhecimento do seu repositório de memória para a conversa com a IA**. O MCP automatiza isso no Claude, enquanto em outras ferramentas, você pode simular esse processo manualmente.
