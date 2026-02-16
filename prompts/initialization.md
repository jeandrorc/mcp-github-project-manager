# Prompts de Inicialização

Prompts para configurar e inicializar repositórios de memória de projeto.

---

## 1. Inicializar Memória de Projeto Existente

Use este prompt quando você tem um projeto existente no GitHub e quer criar um repositório de memória para ele.

```
Quero criar uma memória completa para o meu projeto de trabalho.

**Projeto de Trabalho:**
- Owner: {owner_do_projeto}
- Repositório: {nome_do_repositorio}
- URL: https://github.com/{owner}/{repo}

**Repositório de Memória (este):**
- Owner: {owner_da_memoria}
- Repositório: {nome_do_repo_de_memoria}

**Tarefa:**
Use a ferramenta `init_project` para analisar o projeto de trabalho e criar toda a estrutura de documentação e memória neste repositório. Depois, me dê um resumo do que foi detectado e criado.
```

---

## 2. Verificar o Que Foi Detectado

Após a inicialização, use este prompt para entender o que o MCP detectou sobre seu projeto.

```
A inicialização foi concluída. Agora:

1. Leia o arquivo `config.json` e me mostre:
   - Tipo de projeto detectado
   - Tecnologias identificadas
   - Estrutura de pastas mapeada

2. Liste todos os arquivos que foram criados na pasta `docs/`

3. Me dê um resumo executivo do projeto baseado no `README.md` gerado
```

---

## 3. Personalizar Após Inicialização

Use este prompt para customizar a documentação gerada automaticamente.

```
A estrutura inicial foi criada. Agora preciso personalizá-la:

1. Leia o arquivo `team/members.json`
2. Substitua o membro placeholder pelos seguintes membros da equipe:
   {cole aqui o JSON dos membros reais}
3. Salve o arquivo atualizado

4. Leia o `config.json`
5. Atualize os seguintes campos:
   - `team.lead`: "{nome_do_lider}"
   - `team.size`: "{tamanho_da_equipe}"
   - `important_links.documentation`: "{url_da_documentacao}"
6. Salve as alterações
```

---

## 4. Criar Memória para Novo Projeto (Sem Código Ainda)

Use quando você está começando um projeto do zero e quer criar a estrutura de memória antes mesmo de escrever código.

```
Estou iniciando um novo projeto e quero criar a estrutura de memória antes de começar a codificar.

**Informações do Projeto:**
- Nome: {nome_do_projeto}
- Tipo: {tipo_do_projeto} (ex: "Frontend React", "Backend Node.js", "Mobile React Native")
- Descrição: {descricao_breve}
- Tecnologias planejadas: {lista_de_tecnologias}

**Tarefa:**
Crie uma estrutura de memória base para este tipo de projeto, incluindo:
1. `config.json` com as informações acima
2. `README.md` inicial
3. Estrutura de `docs/` apropriada para o tipo de projeto
4. Templates de ADR em `decisions/adr/`
5. Estrutura de `team/`

Use a ferramenta `init_project` se possível, ou crie manualmente os arquivos necessários.
```

---

## 5. Migrar Documentação Existente

Use quando você já tem documentação em outro formato e quer migrá-la para a estrutura do MCP.

```
Tenho documentação existente que quero migrar para a estrutura do MCP.

**Documentação Atual:**
{descreva onde está a documentação: Notion, Google Docs, Wiki, etc.}

**Tarefa:**
1. Primeiro, crie a estrutura base usando `init_project` para o meu projeto em {owner}/{repo}
2. Depois, vou te fornecer o conteúdo da documentação existente, e você vai:
   - Identificar onde cada documento se encaixa na nova estrutura
   - Converter o formato se necessário (ex: de HTML para Markdown)
   - Criar ou atualizar os arquivos correspondentes
   - Manter um log de migração em `docs/MIGRATION_LOG.md`

Pronto para começar?
```

---

## 6. Validar Estrutura Criada

Use para verificar se a estrutura foi criada corretamente.

```
Preciso validar se a estrutura de memória foi criada corretamente.

**Checklist de Validação:**

1. **Arquivos Base:**
   - [ ] `config.json` existe e está válido?
   - [ ] `README.md` existe e tem conteúdo relevante?
   - [ ] `team/members.json` existe?

2. **Documentação:**
   - [ ] `docs/SETUP.md` existe?
   - [ ] `docs/ARCHITECTURE.md` existe?
   - [ ] `docs/DEPLOYMENT.md` existe?

3. **Decisões:**
   - [ ] `decisions/adr/001-initial-setup.md` existe?

4. **Específico do Tipo:**
   - [ ] Se frontend: `docs/COMPONENTS.md` existe?
   - [ ] Se backend: `docs/API.md` existe?

**Tarefa:**
Verifique cada item da checklist acima e me dê um relatório de status. Para cada arquivo que não existir ou estiver vazio, crie-o com conteúdo apropriado.
```

---

## 7. Atualizar Memória de Projeto Legado

Use quando você tem um projeto antigo sem documentação e quer criar uma memória para ele.

```
Tenho um projeto legado sem documentação adequada. Quero criar uma memória completa para ele.

**Projeto:**
- Repositório: {owner}/{repo}
- Idade: {idade_do_projeto}
- Estado atual: {ativo/manutenção/arquivado}

**Desafios:**
- Pouca ou nenhuma documentação existente
- Código pode estar desatualizado
- Algumas decisões de arquitetura foram esquecidas

**Tarefa:**
1. Use `init_project` para analisar o repositório e detectar o que for possível
2. Para informações que não podem ser detectadas automaticamente:
   - Crie templates com placeholders marcados como `[TODO: Documentar]`
   - Liste todas as áreas que precisam de documentação manual
3. Priorize a criação de:
   - `docs/ARCHITECTURE.md` - para mapear a arquitetura atual
   - `decisions/adr/` - para documentar decisões conhecidas
   - `docs/TROUBLESHOOTING.md` - para problemas comuns

Comece a análise.
```
