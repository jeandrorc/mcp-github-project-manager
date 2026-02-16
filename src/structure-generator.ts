import { ProjectInfo } from "./project-detector.js";
import { GitHubProjectManager } from "./github-manager.js";

interface GeneratedFile {
  path: string;
  content: string;
}

export class StructureGenerator {
  private manager: GitHubProjectManager;

  constructor(manager: GitHubProjectManager) {
    this.manager = manager;
  }

  /**
   * Generate complete project memory structure
   */
  async generateStructure(projectInfo: ProjectInfo): Promise<string[]> {
    const files = this.generateFiles(projectInfo);
    const createdFiles: string[] = [];

    for (const file of files) {
      try {
        await this.manager.createFile(
          file.path,
          file.content,
          `docs: initialize ${file.path}`
        );
        createdFiles.push(file.path);
      } catch (error) {
        // File might already exist, try to update
        try {
          await this.manager.writeFile(
            file.path,
            file.content,
            `docs: update ${file.path}`
          );
          createdFiles.push(file.path);
        } catch {
          console.error(`Failed to create/update ${file.path}`);
        }
      }
    }

    return createdFiles;
  }

  /**
   * Generate all files based on project type
   */
  private generateFiles(projectInfo: ProjectInfo): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // Base files for all projects
    files.push(this.generateConfigJson(projectInfo));
    files.push(this.generateReadme(projectInfo));
    files.push(this.generateSetupGuide(projectInfo));
    files.push(this.generateArchitectureDoc(projectInfo));
    files.push(this.generateDeploymentGuide(projectInfo));
    files.push(this.generateTeamMembers(projectInfo));
    files.push(this.generateInitialADR(projectInfo));

    // Type-specific files
    if (projectInfo.type.includes("frontend")) {
      files.push(...this.generateFrontendDocs(projectInfo));
    }

    if (projectInfo.type.includes("backend")) {
      files.push(...this.generateBackendDocs(projectInfo));
    }

    if (projectInfo.structure.isMonorepo) {
      files.push(...this.generateMonorepoDocs(projectInfo));
    }

    if (projectInfo.type.includes("mobile")) {
      files.push(...this.generateMobileDocs(projectInfo));
    }

    return files;
  }

  /**
   * Generate config.json
   */
  private generateConfigJson(info: ProjectInfo): GeneratedFile {
    const config = {
      project: {
        name: info.name,
        type: info.type,
        version: info.version || "1.0.0",
        description: info.description || "Project description",
      },
      tech_stack: {
        framework: info.framework || "N/A",
        language: info.language || "N/A",
        technologies: info.technologies,
        package_manager: info.packageManager || "N/A",
      },
      structure: info.structure,
      team: {
        lead: "A definir",
        size: "A definir",
        contact: "A definir",
      },
      important_links: {
        repository: `https://github.com/${info.name}`,
        documentation: "A definir",
        deployment: "A definir",
      },
      status: "active",
      initialized_at: new Date().toISOString().split("T")[0],
      initialized_by: "mcp-init",
    };

    return {
      path: "config.json",
      content: JSON.stringify(config, null, 2),
    };
  }

  /**
   * Generate README.md
   */
  private generateReadme(info: ProjectInfo): GeneratedFile {
    const content = `# ${info.name}

${info.description || "Descrição do projeto"}

## Visão Geral

Este é um projeto **${info.type}** utilizando as seguintes tecnologias:

${info.technologies.map((tech) => `- ${tech}`).join("\n")}

## Tecnologias

- **Framework**: ${info.framework || "N/A"}
- **Linguagem**: ${info.language || "N/A"}
- **Gerenciador de Pacotes**: ${info.packageManager || "N/A"}

## Estrutura do Projeto

${info.structure.isMonorepo ? "Este é um monorepo contendo múltiplos pacotes." : ""}
${info.structure.hasComponents ? "- Componentes reutilizáveis em \`src/components\`" : ""}
${info.structure.hasPages ? "- Páginas/Rotas em \`src/pages\` ou \`app/\`" : ""}
${info.structure.hasApi ? "- API/Rotas em \`src/api\` ou \`src/routes\`" : ""}
${info.structure.hasModels ? "- Modelos de dados em \`src/models\`" : ""}

## Documentação

- [Guia de Configuração](docs/SETUP.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
${info.type.includes("frontend") ? "- [Componentes](docs/COMPONENTS.md)" : ""}
${info.type.includes("backend") ? "- [API](docs/API.md)" : ""}

## Equipe

Veja [team/members.json](team/members.json) para informações da equipe.

## Status

**Status**: Ativo  
**Última Atualização**: ${new Date().toISOString().split("T")[0]}

---

*Documentação gerada automaticamente pelo MCP GitHub Project Manager*
`;

    return {
      path: "README.md",
      content,
    };
  }

  /**
   * Generate SETUP.md
   */
  private generateSetupGuide(info: ProjectInfo): GeneratedFile {
    let installCmd = "npm install";
    if (info.packageManager === "pnpm") installCmd = "pnpm install";
    if (info.packageManager === "yarn") installCmd = "yarn install";

    const content = `# Guia de Configuração - ${info.name}

## Pré-requisitos

${info.language === "TypeScript" || info.language === "JavaScript" ? `- Node.js 18+ instalado
- ${info.packageManager || "npm"} instalado` : ""}
${info.language === "Python" ? `- Python 3.8+ instalado
- pip instalado` : ""}

## Instalação

### 1. Clone o repositório

\`\`\`bash
git clone <URL_DO_REPOSITORIO>
cd ${info.name}
\`\`\`

### 2. Instale as dependências

${info.language === "TypeScript" || info.language === "JavaScript" ? `\`\`\`bash
${installCmd}
\`\`\`` : ""}
${info.language === "Python" ? `\`\`\`bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`` : ""}

### 3. Configure as variáveis de ambiente

\`\`\`bash
cp .env.example .env
# Edite .env com suas configurações
\`\`\`

### 4. Execute o projeto

${info.type.includes("frontend") ? `\`\`\`bash
${info.packageManager || "npm"} run dev
\`\`\`` : ""}
${info.type.includes("backend") ? `\`\`\`bash
${info.packageManager || "npm"} run start
\`\`\`` : ""}

## Troubleshooting

### Erro de dependências

- Limpe o cache: \`${info.packageManager || "npm"} cache clean --force\`
- Reinstale: \`rm -rf node_modules && ${installCmd}\`

### Erro de porta em uso

- Verifique se outra aplicação está usando a porta
- Altere a porta no arquivo \`.env\`

---

*Última atualização: ${new Date().toISOString().split("T")[0]}*
`;

    return {
      path: "docs/SETUP.md",
      content,
    };
  }

  /**
   * Generate ARCHITECTURE.md
   */
  private generateArchitectureDoc(info: ProjectInfo): GeneratedFile {
    const content = `# Arquitetura - ${info.name}

## Visão Geral

Este documento descreve a arquitetura do projeto **${info.name}**, um sistema **${info.type}**.

## Stack Tecnológica

- **Framework**: ${info.framework || "N/A"}
- **Linguagem**: ${info.language || "N/A"}
- **Tecnologias**: ${info.technologies.join(", ")}

## Estrutura de Diretórios

\`\`\`
${info.name}/
├── src/                    # Código-fonte principal
${info.structure.hasComponents ? "│   ├── components/        # Componentes reutilizáveis" : ""}
${info.structure.hasPages ? "│   ├── pages/             # Páginas/Rotas" : ""}
${info.structure.hasApi ? "│   ├── api/               # Endpoints da API" : ""}
${info.structure.hasModels ? "│   ├── models/            # Modelos de dados" : ""}
│   └── utils/             # Utilitários
├── tests/                 # Testes
└── docs/                  # Documentação
\`\`\`

## Padrões de Arquitetura

${info.structure.isMonorepo ? "### Monorepo\n\nEste projeto utiliza uma arquitetura de monorepo, separando frontend, backend e pacotes compartilhados.\n" : ""}
${info.type.includes("frontend") ? "### Frontend\n\nArquitetura baseada em componentes com separação clara de responsabilidades.\n" : ""}
${info.type.includes("backend") ? "### Backend\n\nArquitetura em camadas: Routes → Controllers → Services → Models.\n" : ""}

## Fluxo de Dados

[Descrever o fluxo de dados da aplicação]

## Decisões de Arquitetura

Veja [Architecture Decision Records](../decisions/adr/) para decisões importantes.

---

*Última atualização: ${new Date().toISOString().split("T")[0]}*
`;

    return {
      path: "docs/ARCHITECTURE.md",
      content,
    };
  }

  /**
   * Generate DEPLOYMENT.md
   */
  private generateDeploymentGuide(info: ProjectInfo): GeneratedFile {
    const content = `# Guia de Deployment - ${info.name}

## Ambientes

- **Desenvolvimento**: Local
- **Staging**: A definir
- **Produção**: A definir

## Build

${info.language === "TypeScript" || info.language === "JavaScript" ? `\`\`\`bash
${info.packageManager || "npm"} run build
\`\`\`` : ""}

## Deploy

### Opção 1: Vercel/Netlify (Frontend)

${info.type.includes("frontend") ? `\`\`\`bash
# Conecte o repositório ao Vercel/Netlify
# Configure as variáveis de ambiente
# Deploy automático em cada push
\`\`\`` : "N/A"}

### Opção 2: Docker

\`\`\`bash
docker build -t ${info.name} .
docker run -p 3000:3000 ${info.name}
\`\`\`

### Opção 3: Servidor VPS

\`\`\`bash
# SSH no servidor
# Clone o repositório
# Configure e execute
\`\`\`

## Variáveis de Ambiente

Liste todas as variáveis necessárias:

- \`DATABASE_URL\`: URL do banco de dados
- \`API_KEY\`: Chave da API
- [Adicionar outras variáveis]

## Monitoramento

- **Logs**: A definir
- **Métricas**: A definir
- **Alertas**: A definir

---

*Última atualização: ${new Date().toISOString().split("T")[0]}*
`;

    return {
      path: "docs/DEPLOYMENT.md",
      content,
    };
  }

  /**
   * Generate team/members.json
   */
  private generateTeamMembers(info: ProjectInfo): GeneratedFile {
    const members = {
      team_name: `${info.name} Team`,
      members: [
        {
          name: "A definir",
          role: "Tech Lead",
          email: "lead@example.com",
          github: "username",
          timezone: "America/Sao_Paulo",
        },
      ],
      updated_at: new Date().toISOString().split("T")[0],
    };

    return {
      path: "team/members.json",
      content: JSON.stringify(members, null, 2),
    };
  }

  /**
   * Generate initial ADR
   */
  private generateInitialADR(info: ProjectInfo): GeneratedFile {
    const content = `# ADR 001: Configuração Inicial do Projeto

**Data**: ${new Date().toISOString().split("T")[0]}  
**Status**: Aceito

## Contexto

Inicialização do projeto **${info.name}** com as seguintes tecnologias:

${info.technologies.map((tech) => `- ${tech}`).join("\n")}

## Decisão

Utilizaremos **${info.framework || "N/A"}** como framework principal, com **${info.language}** como linguagem de programação.

${info.structure.isMonorepo ? "Adotaremos uma arquitetura de monorepo para facilitar o compartilhamento de código entre pacotes." : ""}

## Consequências

### Positivas

- Stack moderna e bem suportada
- Grande comunidade e recursos disponíveis
- Boa performance e developer experience

### Negativas

- Curva de aprendizado para novos membros
- Dependência de bibliotecas de terceiros

## Alternativas Consideradas

[Descrever outras opções que foram consideradas]

---

*Gerado automaticamente pelo MCP GitHub Project Manager*
`;

    return {
      path: "decisions/adr/001-initial-setup.md",
      content,
    };
  }

  /**
   * Generate frontend-specific docs
   */
  private generateFrontendDocs(info: ProjectInfo): GeneratedFile[] {
    return [
      {
        path: "docs/COMPONENTS.md",
        content: `# Documentação de Componentes

## Componentes Principais

[Listar e documentar componentes principais]

## Padrões de Componentes

- Use componentes funcionais com hooks
- Mantenha componentes pequenos e focados
- Documente props com TypeScript

## Estrutura de Componente

\`\`\`tsx
interface ComponentProps {
  // Props aqui
}

export function Component({ }: ComponentProps) {
  // Implementação
}
\`\`\`
`,
      },
      {
        path: "guides/best-practices.md",
        content: `# Melhores Práticas - Frontend

## Componentes

- Mantenha componentes pequenos e reutilizáveis
- Use TypeScript para tipagem
- Documente props complexas

## Estado

- Use hooks do React para estado local
- ${info.technologies.includes("Redux") ? "Use Redux para estado global" : ""}
- ${info.technologies.includes("Zustand") ? "Use Zustand para estado global" : ""}

## Estilo

- ${info.technologies.includes("TailwindCSS") ? "Use classes do Tailwind" : "Use CSS Modules ou styled-components"}
- Mantenha consistência visual
- Use variáveis para cores e espaçamentos
`,
      },
    ];
  }

  /**
   * Generate backend-specific docs
   */
  private generateBackendDocs(info: ProjectInfo): GeneratedFile[] {
    return [
      {
        path: "docs/API.md",
        content: `# Documentação da API

## Endpoints

### GET /api/example
Descrição do endpoint

**Parâmetros**: Nenhum

**Resposta**:
\`\`\`json
{
  "data": []
}
\`\`\`

## Autenticação

[Descrever sistema de autenticação]

## Rate Limiting

[Descrever limites de requisições]
`,
      },
      {
        path: "guides/error-handling.md",
        content: `# Tratamento de Erros

## Padrões de Erro

Use códigos HTTP apropriados:
- 200: Sucesso
- 400: Bad Request
- 401: Não autenticado
- 403: Não autorizado
- 404: Não encontrado
- 500: Erro interno

## Formato de Erro

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem descritiva"
  }
}
\`\`\`
`,
      },
    ];
  }

  /**
   * Generate monorepo-specific docs
   */
  private generateMonorepoDocs(info: ProjectInfo): GeneratedFile[] {
    return [
      {
        path: "docs/MONOREPO.md",
        content: `# Estrutura do Monorepo

## Pacotes

- \`frontend/\`: Aplicação frontend
- \`backend/\`: API backend
- \`packages/\`: Pacotes compartilhados

## Gerenciamento de Dependências

Usando ${info.packageManager || "npm"} workspaces.

## Comandos

- \`${info.packageManager || "npm"} run build\`: Build todos os pacotes
- \`${info.packageManager || "npm"} run test\`: Testar todos os pacotes
`,
      },
    ];
  }

  /**
   * Generate mobile-specific docs
   */
  private generateMobileDocs(info: ProjectInfo): GeneratedFile[] {
    return [
      {
        path: "docs/MOBILE.md",
        content: `# Documentação Mobile

## Plataformas

- iOS
- Android

## Build

### iOS
\`\`\`bash
${info.technologies.includes("Expo") ? "npx expo run:ios" : "npx react-native run-ios"}
\`\`\`

### Android
\`\`\`bash
${info.technologies.includes("Expo") ? "npx expo run:android" : "npx react-native run-android"}
\`\`\`

## Publicação

[Descrever processo de publicação nas stores]
`,
      },
    ];
  }
}
