# Guia de Prompts: Usando o MCP com Ferramentas de IA

Este guia fornece exemplos de prompts para usar com o **MCP GitHub Project Manager** em ferramentas como Claude Desktop, GitHub Copilot Chat, Cursor e outras IAs de conversação. Use estes prompts como base para interagir com a memória do seu projeto de forma eficiente.

## 🧠 A Mentalidade Correta

Pense no MCP como um **assistente técnico que tem acesso direto ao seu repositório**. Seja claro, direto e informe qual ferramenta usar quando souber. Se não souber, descreva o que você quer, e a IA provavelmente escolherá a ferramenta certa.

**Dica de Ouro**: Comece suas sessões de trabalho com um prompt que carrega o contexto do projeto:

> "Vou trabalhar no projeto `{nome_do_projeto}`. Carregue o contexto lendo o `README.md` e o `config.json` para entender o estado atual do projeto."

---

## 🚀 Ferramenta `init_project` (Inicialização)

Use esta ferramenta para configurar um novo repositório de memória a partir de um projeto de trabalho existente.

| Caso de Uso | Exemplo de Prompt |
| :--- | :--- |
| **Inicialização Completa** | "Quero criar uma memória para o meu projeto `{nome_do_repo_de_trabalho}` que está no GitHub em `{owner}/{repo}`. Use a ferramenta `init_project` para analisar este projeto e configurar este repositório de memória com toda a estrutura e documentação." |
| **Análise de Projeto** | "Analise o projeto `{owner}/{repo}` e me diga qual o tipo de projeto, tecnologias e estrutura de pastas ele possui. Use a ferramenta `init_project` para isso." |
| **Estrutura para Novo Projeto** | "Estou começando um novo projeto `{tipo_de_projeto}` (ex: 'backend Node.js com TypeScript'). Use a ferramenta `init_project` para criar uma estrutura de memória base para este tipo de projeto neste repositório." |

---

## 📖 Ferramenta `read_file` (Leitura)

Para obter informações contidas em arquivos específicos.

| Caso de Uso | Exemplo de Prompt |
| :--- | :--- |
| **Entender Arquitetura** | "Qual é a arquitetura atual do projeto? Leia o arquivo `docs/ARCHITECTURE.md` e me dê um resumo." |
| **Verificar Configuração** | "Como configuro o ambiente de desenvolvimento? Leia as instruções em `docs/SETUP.md`." |
| **Consultar Decisões** | "Preciso entender por que escolhemos PostgreSQL. Leia o ADR correspondente em `decisions/adr/`." |
| **Verificar API** | "Mostre-me os endpoints da API documentados em `docs/API.md`." |
| **Listar Membros da Equipe** | "Quem está na equipe do projeto? Leia as informações de `team/members.json`." |

---

## ✍️ Ferramentas `write_file` e `create_file` (Escrita e Criação)

Para modificar ou adicionar novos arquivos. É uma boa prática pedir para a IA ler o arquivo primeiro, propor a mudança e depois escrever.

| Caso de Uso | Exemplo de Prompt |
| :--- | :--- |
| **Atualizar Documentação** | "O guia de setup (`docs/SETUP.md`) está desatualizado. Adicione uma seção sobre a configuração do Docker. O novo conteúdo é: `{seu_conteúdo}`. Use `write_file` para atualizar." |
| **Criar um Novo Guia** | "Crie um novo guia de melhores práticas para testes em `guides/testing-best-practices.md`. O conteúdo inicial deve ser: `{seu_conteúdo}`." |
| **Registrar uma Decisão** | "Vamos registrar uma nova decisão de arquitetura. Crie o arquivo `decisions/adr/003-use-redis-for-caching.md` com o seguinte conteúdo..." |
| **Adicionar Membro à Equipe** | 1. "Leia o arquivo `team/members.json`."\n2. "Agora, adicione o seguinte membro à lista: {JSON do novo membro}."\n3. "Use `write_file` para salvar o arquivo atualizado." |
| **Refatorar um Documento** | "O `README.md` está confuso. Refatore-o para ser mais claro, focando em... [descreva as mudanças]. Depois, use `write_file` para salvar." |

---

## 🔍 Ferramenta `search_content` (Busca)

Para encontrar informações quando você não sabe o nome do arquivo.

| Caso de Uso | Exemplo de Prompt |
| :--- | :--- |
| **Encontrar Código** | "Onde no projeto estamos usando a biblioteca `axios`? Use `search_content` para encontrar todas as menções." |
| **Localizar Tarefas** | "Encontre todas as tarefas `// TODO:` ou `// FIXME:` pendentes no repositório." |
| **Pesquisar Decisões** | "Houve alguma discussão sobre 'autenticação' nos documentos de arquitetura? Procure por 'autenticação' na pasta `decisions/`." |
| **Verificar Uso de API** | "Mostre-me todos os lugares onde a função `getUser` é chamada." |

---

## ⚙️ Ferramentas `get_project_info` e `update_config` (Configuração)

Para ler e modificar o arquivo `config.json` central.

| Caso de Uso | Exemplo de Prompt |
| :--- | :--- |
| **Verificar Versão** | "Qual é a versão atual do projeto? Use `get_project_info` para descobrir." |
| **Atualizar Versão** | "Atualize a versão do projeto para `2.1.0`. Use a ferramenta `update_config`." |
| **Adicionar Configuração** | "Adicione um novo link importante no `config.json`. A chave é `important_links.staging_url` e o valor é `https://staging.meuprojeto.com`." |
| **Mudar Status** | "O projeto agora está em modo de manutenção. Altere o campo `status` para `maintenance` no `config.json`." |

---

## 📂 Ferramenta `list_files` (Listagem)

Para explorar a estrutura de arquivos do repositório.

| Caso de Uso | Exemplo de Prompt |
| :--- | :--- |
| **Explorar Documentos** | "Liste todos os arquivos na pasta `docs/`." |
| **Ver Estrutura Completa** | "Mostre-me a estrutura completa de arquivos do projeto, de forma recursiva." |
| **Encontrar ADRs** | "Liste todos os Architecture Decision Records na pasta `decisions/adr/`." |

---

## 🔄 Prompts Combinados (Workflows)

Combine ferramentas para realizar tarefas mais complexas.

**Workflow: Adicionar uma nova feature e documentá-la**

1.  **Você**: "Vou adicionar uma feature de 'autenticação com Google'. Primeiro, preciso entender a estrutura da API. Leia o `docs/API.md` e o `docs/AUTHENTICATION.md`."
2.  **Você**: "Ok, agora crie um novo arquivo `docs/api/google-auth.md` com a documentação da nova API..."
3.  **Você**: "Atualize o `docs/API.md` principal para incluir um link para o novo documento `google-auth.md`."
4.  **Você**: "Finalmente, atualize o `config.json` para adicionar `google_auth: enabled` na seção `features`."

**Workflow: Onboarding de um novo membro**

1.  **Você**: "Um novo desenvolvedor vai entrar na equipe. Gere um guia de onboarding para ele."
2.  **IA (usando o MCP)**:
    *   Lê `docs/SETUP.md` para instruções de configuração.
    *   Lê `docs/ARCHITECTURE.md` para a visão geral da arquitetura.
    *   Lê `guides/best-practices.md` para as melhores práticas.
    *   Lê `team/members.json` para apresentar a equipe.
3.  **IA**: "Aqui está um guia de onboarding personalizado para o novo membro..."
