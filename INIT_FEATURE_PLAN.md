# Planejamento: Funcionalidade de Inicialização Automática

## Objetivo

Criar uma ferramenta `init_project` que detecta automaticamente o tipo de projeto no repositório de trabalho e gera uma estrutura de memória personalizada com arquivos e templates relevantes.

## Fluxo de Funcionamento

```
1. Usuário executa: init_project
   ↓
2. MCP analisa o repositório de trabalho
   ↓
3. Detecta tipo de projeto (React, Node.js, Python, etc.)
   ↓
4. Identifica tecnologias e padrões
   ↓
5. Gera estrutura de memória personalizada
   ↓
6. Cria arquivos com templates contextualizados
   ↓
7. Retorna resumo do que foi criado
```

## Detecção de Tipo de Projeto

### Indicadores por Tipo

**Frontend (React/Next.js)**
- Arquivos: `package.json` com React/Next.js
- Pastas: `src/components`, `pages`, `app`
- Tecnologias: React, TypeScript, TailwindCSS

**Backend (Node.js/Express)**
- Arquivos: `package.json` com Express/Fastify
- Pastas: `src/routes`, `src/controllers`, `src/models`
- Tecnologias: Node.js, Express, Database

**Full Stack (Monorepo)**
- Pastas: `frontend/`, `backend/`, `packages/`
- Arquivos: `pnpm-workspace.yaml`, `turbo.json`
- Tecnologias: Monorepo tools

**Python**
- Arquivos: `requirements.txt`, `pyproject.toml`, `setup.py`
- Pastas: `src/`, `tests/`
- Tecnologias: Flask, Django, FastAPI

**Mobile (React Native)**
- Arquivos: `package.json` com React Native
- Pastas: `ios/`, `android/`
- Tecnologias: Expo, React Native

## Estrutura de Memória Gerada

### Estrutura Base (Todos os Projetos)

```
config.json                    # Configuração detectada automaticamente
README.md                      # Visão geral do projeto
docs/
  ├── SETUP.md                # Guia de configuração
  ├── ARCHITECTURE.md         # Arquitetura do projeto
  └── DEPLOYMENT.md           # Guia de deployment
team/
  └── members.json            # Informações da equipe
decisions/
  └── adr/                    # Architecture Decision Records
      └── 001-initial-setup.md
```

### Estrutura Específica por Tipo

**Frontend React/Next.js**
```
docs/
  ├── COMPONENTS.md           # Documentação de componentes
  ├── STYLING.md              # Guia de estilo
  └── STATE_MANAGEMENT.md     # Gerenciamento de estado
guides/
  ├── component-patterns.md   # Padrões de componentes
  └── best-practices.md       # Melhores práticas React
```

**Backend Node.js**
```
docs/
  ├── API.md                  # Documentação da API
  ├── DATABASE.md             # Schema e queries
  └── AUTHENTICATION.md       # Sistema de autenticação
guides/
  ├── error-handling.md       # Tratamento de erros
  └── testing.md              # Estratégia de testes
```

**Monorepo**
```
docs/
  ├── MONOREPO.md             # Estrutura do monorepo
  ├── PACKAGES.md             # Documentação de pacotes
  └── WORKFLOWS.md            # Workflows de desenvolvimento
guides/
  ├── adding-packages.md      # Como adicionar pacotes
  └── dependencies.md         # Gerenciamento de dependências
```

**Python**
```
docs/
  ├── API.md                  # Documentação da API
  ├── MODELS.md               # Modelos de dados
  └── TESTING.md              # Estratégia de testes
guides/
  ├── virtual-env.md          # Ambiente virtual
  └── dependencies.md         # Gerenciamento de dependências
```

## Templates Contextualizados

### config.json (Exemplo React)

```json
{
  "project": {
    "name": "Nome detectado do package.json",
    "type": "frontend-react",
    "version": "Versão do package.json",
    "description": "Descrição do package.json"
  },
  "tech_stack": {
    "framework": "React 18.x",
    "language": "TypeScript",
    "styling": "TailwindCSS",
    "state": "Detectado (Redux/Zustand/Context)",
    "build": "Vite/Next.js"
  },
  "structure": {
    "components": "src/components",
    "pages": "src/pages ou app/",
    "hooks": "src/hooks",
    "utils": "src/utils"
  },
  "team": {
    "lead": "A definir",
    "size": "A definir"
  },
  "status": "active",
  "initialized_at": "2024-02-16",
  "initialized_by": "mcp-init"
}
```

## Implementação

### Arquivos a Criar/Modificar

1. **src/project-detector.ts**
   - Detecta tipo de projeto
   - Identifica tecnologias
   - Analisa estrutura de pastas

2. **src/structure-generator.ts**
   - Gera estrutura de pastas
   - Cria arquivos com templates
   - Popula config.json

3. **src/templates/**
   - Templates por tipo de projeto
   - Templates de documentação
   - Templates de ADR

4. **src/index.ts**
   - Adicionar ferramenta `init_project`
   - Integrar detector e gerador

## Parâmetros da Ferramenta

```typescript
{
  name: "init_project",
  description: "Initialize project memory structure based on detected project type",
  inputSchema: {
    type: "object",
    properties: {
      project_path: {
        type: "string",
        description: "Path to the project repository to analyze (optional, uses current repo if not provided)"
      },
      force: {
        type: "boolean",
        description: "Force initialization even if structure already exists"
      }
    },
    required: []
  }
}
```

## Retorno da Ferramenta

```json
{
  "success": true,
  "project_type": "frontend-react",
  "detected_technologies": ["React", "TypeScript", "TailwindCSS", "Vite"],
  "files_created": [
    "config.json",
    "README.md",
    "docs/SETUP.md",
    "docs/ARCHITECTURE.md",
    "docs/COMPONENTS.md",
    "team/members.json",
    "decisions/adr/001-initial-setup.md"
  ],
  "structure": {
    "docs": 4,
    "guides": 2,
    "team": 1,
    "decisions": 1
  },
  "next_steps": [
    "Review and customize config.json",
    "Add team members to team/members.json",
    "Update docs with project-specific information"
  ]
}
```

## Benefícios

1. **Automação**: Cria estrutura completa em segundos
2. **Contextualização**: Templates específicos para cada tipo de projeto
3. **Consistência**: Estrutura padronizada mas personalizada
4. **Produtividade**: Elimina trabalho manual de setup
5. **Inteligência**: Detecta automaticamente tecnologias e padrões
