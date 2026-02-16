# Estrutura Recomendada para Repositório de Projeto

Este é um exemplo de como organizar seu repositório GitHub para usar com o MCP.

## Estrutura de Pastas

```
seu-projeto/
├── config.json                    # Configuração principal do projeto
├── README.md                      # Documentação geral
├── docs/
│   ├── SETUP.md                  # Guia de configuração inicial
│   ├── ARCHITECTURE.md           # Documentação de arquitetura
│   ├── API.md                    # Documentação da API
│   └── DEPLOYMENT.md             # Guia de deployment
├── guides/
│   ├── workflow.md               # Fluxo de trabalho da equipe
│   ├── best-practices.md         # Melhores práticas
│   ├── troubleshooting.md        # Solução de problemas
│   └── code-style.md             # Guia de estilo de código
├── team/
│   ├── members.json              # Informações da equipe
│   ├── roles.md                  # Descrição de papéis
│   └── contact.md                # Informações de contato
├── decisions/
│   └── adr/                      # Architecture Decision Records
│       ├── 001-initial-setup.md
│       ├── 002-database-choice.md
│       └── 003-api-design.md
├── roadmap/
│   ├── 2024.md                   # Roadmap do ano
│   ├── current-sprint.md         # Sprint atual
│   └── backlog.md                # Backlog de features
└── resources/
    ├── templates/
    │   ├── bug-report.md
    │   ├── feature-request.md
    │   └── pull-request.md
    └── images/
        └── architecture-diagram.png
```

## Arquivo config.json

```json
{
  "project": {
    "name": "Meu Projeto",
    "description": "Descrição do projeto",
    "version": "1.0.0",
    "repository": "https://github.com/usuario/projeto"
  },
  "team": {
    "lead": "Nome do Líder",
    "email": "lead@example.com",
    "slack": "#projeto-channel"
  },
  "tech_stack": {
    "frontend": "React + TypeScript",
    "backend": "Node.js + Express",
    "database": "PostgreSQL",
    "deployment": "Docker + Kubernetes"
  },
  "important_links": {
    "docs": "https://github.com/usuario/projeto/tree/main/docs",
    "issues": "https://github.com/usuario/projeto/issues",
    "wiki": "https://github.com/usuario/projeto/wiki"
  },
  "status": "active",
  "last_updated": "2024-01-15"
}
```

## Arquivo team/members.json

```json
{
  "members": [
    {
      "name": "João Silva",
      "role": "Tech Lead",
      "email": "joao@example.com",
      "github": "joao-silva",
      "timezone": "America/Sao_Paulo"
    },
    {
      "name": "Maria Santos",
      "role": "Backend Developer",
      "email": "maria@example.com",
      "github": "maria-santos",
      "timezone": "America/Sao_Paulo"
    },
    {
      "name": "Pedro Costa",
      "role": "Frontend Developer",
      "email": "pedro@example.com",
      "github": "pedro-costa",
      "timezone": "America/Sao_Paulo"
    }
  ]
}
```

## Exemplos de Uso com o MCP

### Ler documentação
```
Leia o arquivo docs/ARCHITECTURE.md para entender a estrutura do projeto
```

### Atualizar configuração
```
Atualize a versão do projeto para 1.1.0 no config.json
```

### Buscar informações
```
Procure por todas as menções de "database" no repositório
```

### Criar novo documento
```
Crie um novo arquivo em docs/TESTING.md com guia de testes
```

### Listar estrutura
```
Liste todos os arquivos na pasta docs/ recursivamente
```

## Boas Práticas

1. **Mantenha config.json atualizado**: Use-o como fonte única de verdade para informações do projeto
2. **Documente decisões**: Use ADR (Architecture Decision Records) para decisões importantes
3. **Organize por contexto**: Agrupe documentos relacionados em pastas
4. **Use nomes descritivos**: Nomes de arquivos devem ser claros e específicos
5. **Versionamento**: Mantenha histórico de mudanças importantes
6. **Links internos**: Use referências cruzadas entre documentos
7. **Atualizações regulares**: Mantenha a documentação sincronizada com o código

## Dicas de Integração

- Use o MCP para manter documentação sempre atualizada
- Sincronize informações de equipe automaticamente
- Mantenha um changelog centralizado
- Use para gerar relatórios de status do projeto
- Integre com ferramentas de IA para análise de documentação
