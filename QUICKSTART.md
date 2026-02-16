# Guia Rápido - MCP GitHub Project Manager

Comece a usar o MCP GitHub Project Manager em 5 minutos.

## Passo 1: Preparar o Repositório GitHub

Seu repositório de projeto deve ter a seguinte estrutura mínima:

```
seu-repositorio/
├── config.json          # Arquivo de configuração (obrigatório)
└── docs/
    └── README.md        # Documentação
```

### Exemplo de config.json

```json
{
  "project": {
    "name": "Meu Projeto",
    "version": "1.0.0",
    "description": "Descrição do meu projeto"
  },
  "team": {
    "lead": "Seu Nome"
  },
  "status": "active"
}
```

## Passo 2: Obter Token de Acesso Pessoal do GitHub

1. Vá para [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token (classic)"
3. Selecione o escopo `repo` (acesso completo a repositórios privados)
4. Clique em "Generate token"
5. **Copie o token** (você não poderá vê-lo novamente)

## Passo 3: Clonar e Configurar o MCP

```bash
# Clone o repositório do MCP
git clone https://github.com/seu-usuario/mcp-github-project-manager.git
cd mcp-github-project-manager

# Instale as dependências
npm install

# Crie o arquivo .env
cp .env.example .env

# Edite .env com suas informações
# GITHUB_TOKEN=seu_token_aqui
# GITHUB_OWNER=seu_usuario
# GITHUB_REPO=seu_repositorio
nano .env

# Compile o código
npm run build
```

## Passo 4: Iniciar o Servidor

```bash
npm start
```

O servidor está pronto para receber requisições MCP.

## Passo 5: Usar com Claude Desktop

1. Localize o arquivo de configuração do Claude Desktop:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Adicione esta configuração:

```json
{
  "mcpServers": {
    "github-project-manager": {
      "command": "node",
      "args": ["/caminho/completo/para/mcp-github-project/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "seu_token_aqui",
        "GITHUB_OWNER": "seu_usuario",
        "GITHUB_REPO": "seu_repositorio"
      }
    }
  }
}
```

3. Reinicie o Claude Desktop

## Exemplos de Uso

### Ler um arquivo
```
Claude: Leia o arquivo docs/README.md do meu projeto
```

### Atualizar configuração
```
Claude: Atualize a versão do projeto para 1.1.0
```

### Criar novo documento
```
Claude: Crie um novo arquivo em docs/CONTRIBUTING.md com um guia de contribuição
```

### Buscar informações
```
Claude: Procure por todas as menções de "database" no repositório
```

### Listar estrutura
```
Claude: Liste todos os arquivos na pasta docs/
```

## Estrutura Recomendada

Para aproveitar ao máximo o MCP, organize seu repositório assim:

```
seu-projeto/
├── config.json
├── README.md
├── docs/
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   └── API.md
├── guides/
│   ├── workflow.md
│   └── best-practices.md
├── team/
│   └── members.json
└── decisions/
    └── adr/
        └── 001-initial-setup.md
```

Veja `example-repo-structure.md` para mais detalhes.

## Troubleshooting

### "GITHUB_TOKEN não definido"
- Certifique-se de que o arquivo `.env` existe
- Verifique se as variáveis estão definidas corretamente

### "Repositório não encontrado"
- Confirme que `GITHUB_OWNER` e `GITHUB_REPO` estão corretos
- Verifique se o token tem acesso ao repositório

### "Arquivo não encontrado"
- Verifique o caminho do arquivo (sensível a maiúsculas/minúsculas)
- Use `list_files` para explorar a estrutura

## Próximos Passos

1. Leia o [README.md](README.md) para documentação completa
2. Consulte o [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) para integrações avançadas
3. Veja o [ARCHITECTURE.md](ARCHITECTURE.md) para entender como funciona

## Suporte

Para problemas ou dúvidas:
1. Verifique a documentação
2. Consulte os exemplos em `example-repo-structure.md`
3. Abra uma issue no repositório do projeto

---

**Pronto para começar!** 🚀
