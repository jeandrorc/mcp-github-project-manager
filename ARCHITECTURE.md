# Arquitetura do MCP GitHub Project Manager

## Visão Geral

Este é um servidor Model Context Protocol (MCP) que funciona como um gerenciador de informações de projeto, usando um repositório GitHub privado como backend de armazenamento.

## Funcionalidades

### 1. Leitura de Dados
- Ler arquivos Markdown de documentação
- Ler configurações em JSON/YAML
- Listar estrutura de pastas do projeto
- Buscar informações específicas

### 2. Escrita de Dados
- Atualizar arquivos existentes
- Modificar configurações
- Adicionar conteúdo a arquivos

### 3. Criação de Dados
- Criar novos arquivos Markdown
- Criar estruturas de pastas
- Inicializar configurações de projeto

## Estrutura do Repositório

```
projeto-github/
├── config.json                 # Configuração principal do projeto
├── docs/
│   ├── README.md              # Documentação geral
│   ├── SETUP.md               # Guia de configuração
│   ├── ARCHITECTURE.md        # Arquitetura técnica
│   └── CONTRIBUTING.md        # Guia de contribuição
├── guides/
│   ├── workflow.md            # Fluxo de trabalho
│   ├── best-practices.md      # Melhores práticas
│   └── troubleshooting.md     # Solução de problemas
├── team/
│   └── members.json           # Informações da equipe
└── decisions/
    └── adr/                   # Architecture Decision Records
        └── 001-initial-setup.md
```

## Ferramentas do MCP

### 1. `read_file`
- **Descrição**: Lê um arquivo do repositório
- **Parâmetros**: `path` (caminho do arquivo), `format` (markdown, json, yaml, text)
- **Retorno**: Conteúdo do arquivo

### 2. `write_file`
- **Descrição**: Escreve ou atualiza um arquivo
- **Parâmetros**: `path`, `content`, `message` (mensagem de commit)
- **Retorno**: Status da operação

### 3. `create_file`
- **Descrição**: Cria um novo arquivo
- **Parâmetros**: `path`, `content`, `message`
- **Retorno**: URL do arquivo criado

### 4. `list_files`
- **Descrição**: Lista arquivos em uma pasta
- **Parâmetros**: `path`, `recursive` (booleano)
- **Retorno**: Lista de arquivos e pastas

### 5. `search_content`
- **Descrição**: Busca conteúdo em arquivos
- **Parâmetros**: `query`, `path` (opcional)
- **Retorno**: Resultados da busca com contexto

### 6. `get_project_info`
- **Descrição**: Obtém informações gerais do projeto
- **Parâmetros**: nenhum
- **Retorno**: Configuração e metadados do projeto

### 7. `update_config`
- **Descrição**: Atualiza configuração do projeto
- **Parâmetros**: `key`, `value`
- **Retorno**: Nova configuração

## Autenticação

- Usa token de API do GitHub (GitHub Personal Access Token)
- Token armazenado em variável de ambiente: `GITHUB_TOKEN`
- Acesso a repositórios privados via API REST do GitHub

## Tecnologias

- **Node.js**: Runtime JavaScript
- **Octokit**: Cliente GitHub oficial
- **MCP SDK**: Framework Model Context Protocol
- **TypeScript**: Tipagem estática

## Fluxo de Dados

```
Usuário/Agent
    ↓
MCP Server (Node.js)
    ↓
Octokit GitHub API Client
    ↓
GitHub Repository (Private)
    ↓
Arquivos (Markdown, JSON, YAML)
```

## Segurança

- Token de API do GitHub com escopo mínimo necessário
- Validação de caminhos para evitar acesso fora do repositório
- Commits assinados com mensagens descritivas
- Sem armazenamento local de dados sensíveis

## Próximos Passos

1. Implementar servidor MCP em Node.js
2. Configurar autenticação GitHub
3. Implementar ferramentas de leitura/escrita
4. Criar testes e exemplos
5. Documentar uso e integração
