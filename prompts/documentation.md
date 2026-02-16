# Prompts de Documentação

Prompts para criar, atualizar e manter a documentação do projeto.

---

## 1. Criar Documentação de Nova API

Use quando você cria um novo endpoint de API.

```
Criei um novo endpoint de API que precisa ser documentado.

**Endpoint:**
- Método: {GET/POST/PUT/DELETE}
- Rota: {/api/rota}
- Descrição: {o_que_o_endpoint_faz}
- Parâmetros: {lista_de_parametros}
- Resposta: {formato_da_resposta}
- Autenticação: {requerida/não_requerida}

**Tarefa:**
1. Leia o `docs/API.md` para ver o formato atual da documentação
2. Adicione a documentação deste novo endpoint seguindo o mesmo padrão
3. Salve o arquivo atualizado
4. Se este for o primeiro endpoint de uma nova categoria, crie uma nova seção
```

---

## 2. Documentar um Novo Componente

Use quando você cria um novo componente React/Vue/etc.

```
Criei um novo componente que precisa ser documentado.

**Componente:**
- Nome: {NomeDoComponente}
- Localização: {caminho/do/arquivo}
- Propósito: {o_que_o_componente_faz}
- Props: {lista_de_props_e_tipos}
- Exemplo de uso: {codigo_de_exemplo}

**Tarefa:**
1. Leia `docs/COMPONENTS.md`
2. Adicione a documentação deste componente na seção apropriada
3. Inclua um exemplo de código de uso
4. Se houver variantes ou estados especiais, documente-os
5. Salve o arquivo atualizado
```

---

## 3. Atualizar Guia de Setup

Use quando os passos de configuração do projeto mudam.

```
Os passos de configuração do projeto mudaram.

**Mudanças:**
{descreva o que mudou: novas dependências, novos passos, etc.}

**Tarefa:**
1. Leia o `docs/SETUP.md` atual
2. Identifique as seções que precisam ser atualizadas
3. Atualize o conteúdo com as novas informações
4. Certifique-se de que os comandos estão corretos para {npm/pnpm/yarn}
5. Adicione uma nota sobre a data da última atualização
6. Salve o arquivo
```

---

## 4. Criar Guia de Troubleshooting

Use para documentar problemas comuns e suas soluções.

```
Quero criar/atualizar o guia de troubleshooting.

**Problema Encontrado:**
- Sintoma: {o_que_acontece}
- Causa: {por_que_acontece}
- Solução: {como_resolver}
- Prevenção: {como_evitar_no_futuro}

**Tarefa:**
1. Verifique se `docs/TROUBLESHOOTING.md` existe. Se não, crie.
2. Leia o arquivo para ver o formato atual
3. Adicione este problema na seção apropriada
4. Organize por categoria se necessário (ex: "Problemas de Instalação", "Erros de Runtime")
5. Salve o arquivo
```

---

## 5. Documentar Mudança de Arquitetura

Use quando a arquitetura do projeto muda significativamente.

```
A arquitetura do projeto mudou.

**Mudança:**
{descreva a mudança arquitetural}

**Razão:**
{por que a mudança foi feita}

**Impacto:**
{o que muda para os desenvolvedores}

**Tarefas:**
1. Leia `docs/ARCHITECTURE.md`
2. Atualize as seções afetadas pela mudança
3. Adicione diagramas ou exemplos se necessário (descreva em texto, eu crio depois)
4. Crie um ADR em `decisions/adr/` documentando esta decisão
5. Atualize o `README.md` se a mudança afetar a visão geral do projeto
```

---

## 6. Criar Guia de Estilo de Código

Use para estabelecer padrões de código no projeto.

```
Quero criar um guia de estilo de código para o projeto.

**Linguagem/Framework:** {linguagem_ou_framework}

**Áreas a Cobrir:**
- Nomenclatura (variáveis, funções, classes)
- Formatação (indentação, espaçamento)
- Comentários e documentação
- Estrutura de arquivos
- Importações
- {outras_areas_especificas}

**Tarefa:**
1. Crie um arquivo `guides/code-style.md`
2. Baseie-se nas melhores práticas de {linguagem/framework}
3. Inclua exemplos de "bom" e "ruim" para cada regra
4. Adicione referências para ferramentas de linting (ESLint, Prettier, etc.)
5. Salve o arquivo
```

---

## 7. Atualizar Documentação de Deploy

Use quando o processo de deploy muda.

```
O processo de deploy foi atualizado.

**Mudanças:**
{descreva as mudanças no processo de deploy}

**Novo Ambiente/Ferramenta:**
{se aplicável, descreva novos ambientes ou ferramentas}

**Tarefa:**
1. Leia `docs/DEPLOYMENT.md`
2. Atualize as seções relevantes
3. Adicione novos passos se necessário
4. Atualize variáveis de ambiente se houver mudanças
5. Adicione troubleshooting específico de deploy se relevante
6. Salve o arquivo
```

---

## 8. Criar Changelog

Use para manter um registro de mudanças do projeto.

```
Quero criar/atualizar o CHANGELOG do projeto.

**Versão:** {versao}
**Data:** {data}

**Mudanças:**
- **Added:** {novas_features}
- **Changed:** {mudancas_em_features_existentes}
- **Deprecated:** {features_marcadas_para_remocao}
- **Removed:** {features_removidas}
- **Fixed:** {bugs_corrigidos}
- **Security:** {patches_de_seguranca}

**Tarefa:**
1. Verifique se `CHANGELOG.md` existe na raiz. Se não, crie.
2. Adicione uma nova entrada para a versão {versao}
3. Organize as mudanças nas categorias acima
4. Mantenha o formato [Keep a Changelog](https://keepachangelog.com/)
5. Salve o arquivo
```

---

## 9. Documentar Integração com Serviço Externo

Use quando você integra um serviço de terceiros.

```
Integrei um novo serviço externo ao projeto.

**Serviço:** {nome_do_servico}
**Propósito:** {para_que_serve}
**Documentação oficial:** {url_da_documentacao}

**Configuração:**
- Variáveis de ambiente: {lista_de_vars}
- Credenciais necessárias: {o_que_e_necessario}
- Passos de setup: {passos_para_configurar}

**Uso:**
- Como usar no código: {exemplo_de_codigo}
- Limitações: {rate_limits_ou_restricoes}

**Tarefa:**
1. Crie um arquivo `docs/integrations/{nome_do_servico}.md`
2. Documente todas as informações acima
3. Adicione exemplos de código
4. Atualize o `docs/SETUP.md` para incluir a configuração deste serviço
5. Atualize o `README.md` se for uma integração importante
```

---

## 10. Criar Documentação de Testes

Use para documentar a estratégia de testes do projeto.

```
Quero documentar a estratégia de testes do projeto.

**Tipos de Teste:**
- Unit tests: {framework_e_abordagem}
- Integration tests: {framework_e_abordagem}
- E2E tests: {framework_e_abordagem}

**Cobertura Esperada:** {porcentagem_ou_criterio}

**Como Executar:**
- Todos os testes: {comando}
- Testes específicos: {comando}
- Com cobertura: {comando}

**Tarefa:**
1. Crie um arquivo `docs/TESTING.md`
2. Documente a estratégia de testes
3. Inclua exemplos de como escrever testes
4. Adicione comandos para executar testes
5. Documente como interpretar os resultados
6. Salve o arquivo
```
