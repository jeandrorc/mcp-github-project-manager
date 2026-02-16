# Guia de Integração do MCP GitHub Project Manager

Este guia explica como integrar o MCP GitHub Project Manager em diferentes ambientes e ferramentas.

> 🔑 **Antes de começar**: [Gere seu token do GitHub com os escopos corretos](https://github.com/settings/tokens/new?description=MCP%20GitHub%20Project%20Manager&scopes=repo)

## Integração com Claude Desktop

O MCP GitHub Project Manager pode ser integrado com o Claude Desktop para permitir que o Claude acesse e modifique informações do seu projeto diretamente.

### Configuração

1. **Localize o arquivo de configuração do Claude Desktop:**

   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Adicione o servidor MCP à configuração:**

   ```json
   {
     "mcpServers": {
       "github-project-manager": {
         "command": "node",
         "args": ["/caminho/para/mcp-github-project/dist/index.js"],
         "env": {
           "GITHUB_TOKEN": "seu_token_aqui",
           "GITHUB_OWNER": "seu_usuario",
           "GITHUB_REPO": "seu_repositorio"
         }
       }
     }
   }
   ```

3. **Reinicie o Claude Desktop.**

4. **Verifique se o servidor está conectado:**

   Na conversa com Claude, você deverá ver uma indicação de que o servidor MCP está disponível.

## Integração com Agentes Personalizados

Se você estiver criando um agente personalizado que use MCP, aqui está como configurar:

### Exemplo em Node.js

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function initializeClient() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./dist/index.js"],
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      GITHUB_OWNER: process.env.GITHUB_OWNER,
      GITHUB_REPO: process.env.GITHUB_REPO,
    },
  });

  const client = new Client(
    {
      name: "my-agent",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  return client;
}

// Usar o cliente
const client = await initializeClient();
const tools = await client.listTools();
console.log("Available tools:", tools);
```

## Integração com Docker

Para usar o MCP em um contêiner Docker:

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos do projeto
COPY package.json package-lock.json ./
COPY src ./src
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Compilar TypeScript
RUN npm run build

# Expor como servidor MCP
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mcp-github-project:
    build: .
    environment:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
      GITHUB_OWNER: ${GITHUB_OWNER}
      GITHUB_REPO: ${GITHUB_REPO}
    volumes:
      - ./config:/app/config
```

## Integração com Sistemas de Automação

### GitHub Actions

Use o MCP em um workflow do GitHub Actions:

```yaml
name: Update Project Documentation

on:
  schedule:
    - cron: '0 0 * * 0'  # Toda segunda-feira

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install MCP
        run: |
          git clone https://github.com/seu-usuario/mcp-github-project-manager.git
          cd mcp-github-project-manager
          npm install
          npm run build

      - name: Run MCP Tool
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_OWNER: ${{ github.repository_owner }}
          GITHUB_REPO: ${{ github.event.repository.name }}
        run: |
          node dist/index.js
```

## Casos de Uso Avançados

### 1. Sincronização Automática de Documentação

Crie um agente que periodicamente:
- Leia a documentação atual
- Identifique partes desatualizadas
- Atualize com informações correntes

```typescript
async function syncDocumentation(client: Client) {
  // Ler documentação atual
  const docs = await client.callTool({
    name: "read_file",
    arguments: { path: "docs/README.md" },
  });

  // Processar e atualizar
  const updated = processDocumentation(docs);

  // Escrever de volta
  await client.callTool({
    name: "write_file",
    arguments: {
      path: "docs/README.md",
      content: updated,
      message: "docs: auto-update documentation",
    },
  });
}
```

### 2. Relatórios Automatizados

Gere relatórios de status do projeto:

```typescript
async function generateStatusReport(client: Client) {
  // Obter informações do projeto
  const projectInfo = await client.callTool({
    name: "get_project_info",
    arguments: {},
  });

  // Buscar atualizações recentes
  const updates = await client.callTool({
    name: "search_content",
    arguments: { query: "TODO", path: "docs" },
  });

  // Compilar relatório
  const report = generateReport(projectInfo, updates);

  // Salvar relatório
  await client.callTool({
    name: "create_file",
    arguments: {
      path: `reports/status-${new Date().toISOString().split('T')[0]}.md`,
      content: report,
      message: "docs: generate status report",
    },
  });
}
```

### 3. Integração com Agentes de IA

Use com agentes de IA para responder perguntas sobre o projeto:

```typescript
async function askAboutProject(client: Client, question: string) {
  // Buscar informações relevantes
  const results = await client.callTool({
    name: "search_content",
    arguments: { query: question },
  });

  // Ler documentação relacionada
  const docs = await client.callTool({
    name: "read_file",
    arguments: { path: "docs/README.md" },
  });

  // Passar para o modelo de IA para responder
  return generateAnswer(question, results, docs);
}
```

## Troubleshooting

### Erro: "Token inválido"

- Verifique se o token do GitHub é válido
- Confirme que o token tem permissão `repo`
- Verifique se o token não expirou

### Erro: "Repositório não encontrado"

- Confirme que `GITHUB_OWNER` e `GITHUB_REPO` estão corretos
- Verifique se o token tem acesso ao repositório
- Certifique-se de que o repositório é privado e o token tem permissão

### Erro: "Arquivo não encontrado"

- Verifique o caminho do arquivo (sensível a maiúsculas/minúsculas)
- Confirme que o arquivo existe no repositório
- Tente listar os arquivos para verificar a estrutura

## Boas Práticas

1. **Segurança**: Nunca exponha seu `GITHUB_TOKEN` em repositórios públicos.
2. **Commits**: Use mensagens de commit descritivas para rastrear alterações.
3. **Estrutura**: Mantenha uma estrutura de repositório consistente.
4. **Validação**: Valide dados antes de escrever no repositório.
5. **Logging**: Implemente logging para rastrear operações do MCP.

## Recursos Adicionais

- [Documentação do MCP](https://mcp.dev)
- [API do GitHub](https://docs.github.com/en/rest)
- [Octokit.js](https://octokit.github.io/rest.js/)
