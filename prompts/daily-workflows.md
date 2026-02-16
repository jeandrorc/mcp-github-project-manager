# Prompts de Workflows Diários

Prompts para usar durante o desenvolvimento diário do projeto.

---

## 1. Começar o Dia de Trabalho

Use este prompt no início do dia para carregar o contexto do projeto.

```
Bom dia! Vou começar a trabalhar no projeto {nome_do_projeto}.

**Tarefa de Contexto:**
1. Leia o `config.json` e me dê um resumo do projeto (nome, versão, stack)
2. Leia o `README.md` e destaque os pontos principais
3. Liste os últimos 3 ADRs em `decisions/adr/` para me lembrar das decisões recentes
4. Verifique se há algum `TODO` ou `FIXME` documentado

Me prepare para começar o dia com o contexto completo.
```

---

## 2. Antes de Implementar uma Nova Feature

Use antes de começar a codificar uma nova funcionalidade.

```
Vou implementar uma nova feature: {nome_da_feature}

**Preparação:**
1. Verifique se há alguma documentação relacionada a "{termo_relacionado}" usando `search_content`
2. Leia o `docs/ARCHITECTURE.md` e me diga onde esta feature se encaixa na arquitetura atual
3. Leia `guides/best-practices.md` e me dê as diretrizes relevantes para esta feature
4. Sugira uma estrutura de arquivos/pastas para implementar esta feature

Depois, vou te pedir para criar um ADR para documentar a decisão de implementação.
```

---

## 3. Documentar uma Decisão de Arquitetura

Use quando você toma uma decisão importante e quer documentá-la.

```
Tomei uma decisão de arquitetura que precisa ser documentada.

**Decisão:**
- Título: {titulo_da_decisao}
- Contexto: {contexto_da_decisao}
- Decisão: {o_que_foi_decidido}
- Alternativas consideradas: {outras_opcoes}
- Consequências: {impactos_positivos_e_negativos}

**Tarefa:**
1. Liste os ADRs existentes em `decisions/adr/` para eu ver o número do próximo
2. Crie um novo arquivo `decisions/adr/{numero}-{slug}.md` seguindo o template dos ADRs existentes
3. Preencha com as informações acima
4. Salve o arquivo
```

---

## 4. Atualizar Documentação Após Mudança

Use após fazer mudanças significativas no código.

```
Fiz mudanças no código que afetam a documentação.

**Mudanças:**
{descreva as mudanças feitas}

**Áreas Afetadas:**
{liste as áreas da documentação que podem estar desatualizadas}

**Tarefa:**
1. Para cada área afetada, leia o arquivo de documentação correspondente
2. Identifique as seções que precisam ser atualizadas
3. Sugira as atualizações necessárias
4. Após minha aprovação, atualize os arquivos usando `write_file`

Comece pela área mais crítica: {area_mais_critica}
```

---

## 5. Code Review com Contexto

Use antes de fazer um code review.

```
Vou fazer code review de um PR. Preciso do contexto do projeto.

**PR:**
- Título: {titulo_do_pr}
- Descrição: {descricao_do_pr}
- Arquivos modificados: {lista_de_arquivos}

**Tarefa de Preparação:**
1. Leia `guides/best-practices.md` e me dê um checklist de code review
2. Se o PR afeta a API, leia `docs/API.md` para verificar consistência
3. Se o PR afeta componentes, leia `docs/COMPONENTS.md` para verificar padrões
4. Busque por decisões de arquitetura relacionadas em `decisions/adr/`

Me prepare para fazer um code review informado e consistente com os padrões do projeto.
```

---

## 6. Resolver um Bug

Use quando você está investigando e corrigindo um bug.

```
Estou investigando um bug: {descricao_do_bug}

**Informações:**
- Área afetada: {area_do_codigo}
- Sintomas: {o_que_esta_acontecendo}
- Reprodução: {passos_para_reproduzir}

**Tarefa de Investigação:**
1. Busque por "{termos_relacionados}" na documentação usando `search_content`
2. Leia `docs/TROUBLESHOOTING.md` para ver se há algo relacionado
3. Verifique `docs/ARCHITECTURE.md` para entender o fluxo esperado
4. Sugira possíveis causas baseado na documentação

Depois de corrigir, vou te pedir para atualizar o `docs/TROUBLESHOOTING.md` com este caso.
```

---

## 7. Adicionar um Novo Membro à Equipe

Use quando um novo desenvolvedor entra no time.

```
Um novo membro está entrando na equipe.

**Informações do Novo Membro:**
- Nome: {nome}
- Cargo: {cargo}
- Email: {email}
- GitHub: {username}
- Timezone: {timezone}

**Tarefas:**
1. Leia `team/members.json`
2. Adicione o novo membro à lista
3. Salve o arquivo atualizado
4. Gere um guia de onboarding personalizado para este membro, incluindo:
   - Resumo do projeto (do `README.md`)
   - Passos de setup (do `docs/SETUP.md`)
   - Arquitetura (do `docs/ARCHITECTURE.md`)
   - Melhores práticas (de `guides/best-practices.md`)
   - Apresentação da equipe (de `team/members.json`)
```

---

## 8. Preparar para Deploy

Use antes de fazer deploy para produção.

```
Vou fazer deploy da versão {versao} para produção.

**Checklist de Pré-Deploy:**
1. Leia `docs/DEPLOYMENT.md` e me dê o checklist de deploy
2. Verifique o `config.json` para confirmar a versão atual
3. Atualize a versão no `config.json` para {nova_versao}
4. Liste todas as mudanças desde a última versão (baseado nos ADRs recentes)
5. Verifique se há algum `TODO` crítico pendente

Me prepare para um deploy seguro.
```

---

## 9. Finalizar o Dia de Trabalho

Use no final do dia para documentar o progresso.

```
Finalizando o dia de trabalho no projeto {nome_do_projeto}.

**O que foi feito hoje:**
{descreva brevemente o que foi feito}

**Tarefas:**
1. Se houver decisões importantes tomadas hoje, crie ADRs para elas
2. Se houver documentação desatualizada, liste o que precisa ser atualizado
3. Se houver TODOs para amanhã, crie ou atualize um arquivo `docs/TODO.md`
4. Atualize o campo `last_updated` no `config.json` para a data de hoje

Me ajude a documentar o progresso do dia.
```

---

## 10. Buscar Informação Rápida

Use quando você precisa de uma informação específica rapidamente.

```
Preciso de uma informação rápida sobre {topico}.

**Tarefa:**
Use `search_content` para buscar por "{topico}" em todo o repositório e me dê:
1. Em quais arquivos a informação aparece
2. O contexto relevante de cada ocorrência
3. Um resumo consolidado da informação

Seja conciso e direto.
```
