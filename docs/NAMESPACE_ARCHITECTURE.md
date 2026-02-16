# Arquitetura de Múltiplos Projetos com Namespaces

Esta documentação detalha a nova arquitetura que permite gerenciar múltiplos projetos com uma única instalação do MCP, usando um repositório de memória centralizado e namespaces.

## 💡 Conceito Principal

Em vez de ter um repositório de memória para cada projeto, usamos **um único repositório de memória** e organizamos cada projeto em uma **pasta separada (namespace)** dentro dele.

### Estrutura do Repositório de Memória

```
memoria-central/                    # Repositório único no GitHub
├── projeto-a/                      # Namespace do projeto A
│   ├── config.json
│   ├── docs/
│   └── decisions/
├── projeto-b/                      # Namespace do projeto B
│   ├── config.json
│   ├── docs/
│   └── decisions/
└── projeto-c/                      # Namespace do projeto C
    ├── config.json
    ├── docs/
    └── decisions/
```

## ⚙️ Configuração

A configuração é dividida em duas partes: **Global** e **Local**.

### 1. Configuração Global

- **Onde**: `~/.mcp-github-manager/config.json`
- **O que contém**: Informações do repositório de memória central
- **Como configurar**: `mcp-github init`

**Exemplo de `~/.mcp-github-manager/config.json`:**
```json
{
  "github_token": "ghp_xxxxxxxxxxxxxxxxxxxx",
  "github_owner": "seu-usuario-github",
  "github_repo": "memoria-central"
}
```

### 2. Configuração Local

- **Onde**: `.mcp-config.json` (na raiz do seu projeto de trabalho)
- **O que contém**: O nome do namespace para aquele projeto
- **Como configurar**: `mcp-github init-project`

**Exemplo de `.mcp-config.json` no seu projeto `meu-app-react`:**
```json
{
  "project_name": "Meu App React",
  "namespace": "meu-app-react"
}
```

## 🚀 Como Funciona

1.  **Detecção de Contexto**: Quando o MCP é ativado, ele procura um arquivo `.mcp-config.json` no diretório atual e nos diretórios pais.
2.  **Carregamento da Config**: 
    - Ele carrega a **configuração global** para saber qual repositório e token usar.
    - Ele carrega a **configuração local** para saber qual namespace (pasta) usar dentro do repositório.
3.  **Resolução de Caminho**: Todas as operações de arquivo (leitura, escrita, etc.) são automaticamente prefixadas com o namespace.

**Exemplo de fluxo:**

- **Comando**: `read_file("docs/API.md")`
- **Config Local**: `namespace: "meu-app-react"`
- **Ação Real**: O MCP lê o arquivo `meu-app-react/docs/API.md` no repositório `memoria-central`.

##  CLI: `mcp-github`

Uma nova ferramenta de linha de comando foi criada para gerenciar essa arquitetura.

### Instalação

```bash
# Clone o repositório do MCP
git clone https://github.com/jeandrorc/mcp-github-project-manager.git
cd mcp-github-project-manager

# Compile o código
npm install
npm run build

# Execute o script de instalação
./install.sh
```

### Comandos

| Comando | Descrição |
| :--- | :--- |
| `mcp-github init` | Configura o repositório de memória global (`~/.mcp-github-manager/config.json`) |
| `mcp-github init-project` | Cria o arquivo `.mcp-config.json` local com o namespace do projeto atual |
| `mcp-github config` | Mostra a configuração ativa (global + local) para o diretório atual |
| `mcp-github help` | Mostra a ajuda |

### Workflow de Setup

**Passo 1: Configuração Global (só uma vez)**

```bash
mcp-github init
# Preencha seu token, owner e nome do repo de memória
```

**Passo 2: Configuração por Projeto (para cada projeto)**

```bash
# Navegue até o diretório do seu projeto
cd ~/projetos/meu-app-react

# Crie a configuração local
mcp-github init-project
# Confirme o namespace (ex: "meu-app-react")
```

Pronto! Agora, sempre que você usar o MCP dentro da pasta `~/projetos/meu-app-react`, ele usará o namespace `meu-app-react` no seu repositório de memória central.

## 🛠️ Componentes Técnicos

### `src/config-loader.ts`

- **Responsabilidade**: Carregar e mesclar as configurações global e local.
- **`loadConfig()`**: 
    1. Carrega a config global (`~/.mcp-github-manager/config.json`) ou variáveis de ambiente.
    2. Procura `.mcp-config.json` no diretório atual e pais.
    3. Se encontrar, mescla as duas configs.
    4. Retorna a configuração final com token, repo e namespace.

### `src/github-manager.ts`

- **Responsabilidade**: Interagir com a API do GitHub.
- **Construtor**: Agora aceita um `namespace` opcional.
- **`resolvePath(path)`**: Um novo método privado que prefixa todos os caminhos de arquivo com o namespace, se ele existir.

**Exemplo:**
```typescript
private resolvePath(path: string): string {
  if (!this.namespace) {
    return path;
  }
  return `${this.namespace}/${path}`;
}
```

### `src/cli.ts`

- **Responsabilidade**: Fornecer a interface de linha de comando para os usuários.
- **Comandos**: Implementa as funções `init`, `init-project` e `config`.
- **Interatividade**: Usa `readline` para fazer perguntas ao usuário durante a configuração.

## ✅ Vantagens desta Arquitetura

- **Centralização**: Um único repositório de memória para todos os projetos.
- **Portabilidade**: A configuração do projeto (`.mcp-config.json`) pode ser comitada no repositório de trabalho, facilitando o onboarding de novos desenvolvedores.
- **Simplicidade**: Menos configuração manual. Configure globalmente uma vez, e depois só defina o namespace para cada projeto.
- **Organização**: A estrutura de pastas no repositório de memória fica limpa e organizada por projeto.
- **Busca Global**: Potencial para futuras ferramentas que possam buscar informações em todos os namespaces (projetos) de uma vez.
- **Backup Fácil**: Fazer backup de um único repositório é mais fácil do que de vários.
