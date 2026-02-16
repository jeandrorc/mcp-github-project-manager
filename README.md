> [!NOTE]
> Este é um projeto de exemplo e não deve ser usado em produção sem uma revisão de segurança completa.

# MCP GitHub Project Manager

O **MCP GitHub Project Manager** é um servidor [Model Context Protocol (MCP)](https://mcp.dev) que permite interagir com um repositório GitHub privado como se fosse um banco de dados de informações de projeto. Ele foi projetado para ser usado por agentes de IA e automações para ler, escrever e gerenciar documentação, configurações e outros dados importantes de um projeto diretamente no GitHub.

Este servidor transforma seu repositório em uma fonte de verdade estruturada, permitindo que sistemas automatizados acessem e modifiquem informações de forma programática e segura.

## Funcionalidades Principais

- **Leitura e Escrita de Arquivos**: Acessa e modifica arquivos (Markdown, JSON, YAML, etc.) no repositório.
- **Gerenciamento de Configuração**: Lê e atualiza um arquivo `config.json` central para metadados do projeto.
- **Busca de Conteúdo**: Pesquisa por texto dentro dos arquivos do repositório.
- **Estrutura de Diretórios**: Lista o conteúdo de pastas de forma recursiva ou não.
- **Autenticação Segura**: Usa um token de acesso pessoal (PAT) do GitHub para autenticação, garantindo que o acesso seja restrito.
- **Operações Atômicas**: Todas as operações de escrita são realizadas como commits no Git, fornecendo um histórico completo de alterações.

## Casos de Uso

- **Automação de Documentação**: Manter a documentação do projeto (guias, tutoriais, arquitetura) sempre atualizada.
- **Gerenciamento de Conhecimento**: Centralizar decisões de arquitetura (ADRs), guias de boas práticas e informações da equipe.
- **Sincronização de Configurações**: Gerenciar configurações de ambiente e de projeto em um local central.
- **Relatórios Automatizados**: Gerar relatórios de status do projeto a partir de dados armazenados no repositório.
- **Integração com Agentes de IA**: Permitir que um agente de IA acesse o contexto do projeto para responder a perguntas ou realizar tarefas.

## Começando

### Pré-requisitos

- **Node.js**: Versão 18 ou superior.
- **Repositório GitHub**: Um repositório privado para ser usado como backend.
- **Token de Acesso Pessoal (PAT)**: Um token do GitHub com permissões de `repo` para acessar o repositório.

### Configuração

1.  **Clone o repositório do servidor MCP (este projeto):**

    ```bash
    git clone <URL_DESTE_REPOSITORIO>
    cd mcp-github-project-manager
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env` na raiz do projeto, copiando o exemplo de `.env.example`:

    ```bash
    cp .env.example .env
    ```

    Edite o arquivo `.env` com suas informações:

    ```ini
    # GitHub Configuration
    GITHUB_TOKEN=ghp_SEU_TOKEN_DE_ACESSO_PESSOAL
    GITHUB_OWNER=seu_nome_de_usuario_ou_organizacao
    GITHUB_REPO=nome_do_seu_repositorio_de_projeto

    # MCP Server Configuration (opcional)
    MCP_PORT=3000
    MCP_HOST=localhost
    ```

4.  **Compile o código TypeScript:**

    ```bash
    npm run build
    ```

5.  **Inicie o servidor MCP:**

    ```bash
    npm start
    ```

    O servidor agora está em execução e pronto para receber requisições MCP via `stdio`.

## Ferramentas Disponíveis

O servidor expõe um conjunto de ferramentas para interagir com o repositório GitHub.

| Ferramenta         | Descrição                                                 | Parâmetros                                       |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------ |
| `read_file`        | Lê o conteúdo de um arquivo específico.                   | `path: string`                                   |
| `write_file`       | Escreve ou atualiza o conteúdo de um arquivo.             | `path: string`, `content: string`, `message: string` |
| `create_file`      | Cria um novo arquivo no repositório.                      | `path: string`, `content: string`, `message: string` |
| `delete_file`      | Exclui um arquivo do repositório.                         | `path: string`, `message: string`                |
| `list_files`       | Lista arquivos e pastas em um diretório.                  | `path: string`, `recursive: boolean` (opcional)  |
| `search_content`   | Busca por uma string de texto nos arquivos.               | `query: string`, `path: string` (opcional)       |
| `get_project_info` | Retorna o conteúdo do arquivo `config.json`.              | Nenhum                                           |
| `update_config`    | Atualiza um par chave/valor no arquivo `config.json`.     | `key: string`, `value: any`                      |
| `init_project`     | Inicializa a estrutura de memória analisando um repositório. | `target_owner: string` (opcional), `target_repo: string` (opcional) |

### Exemplos de Uso

#### Ler um arquivo

**Comando:**
```json
{
  "tool": "read_file",
  "arguments": {
    "path": "docs/ARCHITECTURE.md"
  }
}
```

**Resultado esperado:**
O conteúdo do arquivo `docs/ARCHITECTURE.md` como uma string de texto.

#### Criar um novo guia

**Comando:**
```json
{
  "tool": "create_file",
  "arguments": {
    "path": "guides/new-feature-workflow.md",
    "content": "# Fluxo de Trabalho para Novas Features\n\n1. Crie uma branch a partir da `main`.\n2. Desenvolva a feature.\n3. Abra um Pull Request.",
    "message": "docs: add new feature workflow guide"
  }
}
```

**Resultado esperado:**
Uma mensagem de sucesso com o link para o commit de criação do arquivo.

#### Atualizar a versão do projeto

**Comando:**
```json
{
  "tool": "update_config",
  "arguments": {
    "key": "project.version",
    "value": "1.1.0"
  }
}
```

**Resultado esperado:**
Uma mensagem confirmando que a configuração foi atualizada e o `config.json` no repositório refletirá a nova versão.

### Usando a Ferramenta de Inicialização (init_project)

Para configurar automaticamente um repositório de memória com base em um projeto existente, use a ferramenta `init_project`.

**Comando:**
```json
{
  "tool": "init_project",
  "arguments": {
    "target_owner": "nome_do_usuario_do_projeto",
    "target_repo": "nome_do_repositorio_do_projeto"
  }
}
```

**Resultado esperado:**
Um relatório em JSON detalhando o tipo de projeto detectado, as tecnologias, e a lista de todos os arquivos de documentação e configuração que foram criados automaticamente.

#### Listar todos os documentos de arquitetura

**Comando:**
```json
{
  "tool": "list_files",
  "arguments": {
    "path": "decisions/adr",
    "recursive": true
  }
}
```

**Resultado esperado:**
Uma lista em formato JSON de todos os arquivos e pastas dentro do diretório `decisions/adr`.

## Estrutura do Repositório de Projeto

Para obter o máximo deste MCP, recomendamos organizar seu repositório de projeto de forma estruturada. Fornecemos um guia de exemplo em `example-repo-structure.md` que detalha uma estrutura de pastas e arquivos recomendada.

## Segurança

- **Escopo do Token**: Crie um token de acesso pessoal com o escopo mínimo necessário (`repo` é suficiente para repositórios privados).
- **Não exponha o token**: Nunca comite o arquivo `.env` ou exponha seu `GITHUB_TOKEN` publicamente.
- **Validação de Caminho**: O servidor não possui mecanismos para prevenir a travessia de diretórios (`../`). Use com cuidado e em ambientes controlados.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir *issues* e *pull requests* para melhorar este projeto.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
