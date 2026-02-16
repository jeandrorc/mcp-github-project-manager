# Geração de Token do GitHub - Guia Completo

## Link Direto (Recomendado)

Para facilitar a criação do token, fornecemos um link que já pré-configura todos os escopos necessários:

🔑 **[Clique aqui para gerar seu token](https://github.com/settings/tokens/new?description=MCP%20GitHub%20Project%20Manager&scopes=repo)**

Este link abrirá a página de criação de token do GitHub com:
- **Descrição**: "MCP GitHub Project Manager" (já preenchida)
- **Escopo**: `repo` (já selecionado)

Você só precisa:
1. Clicar no link acima
2. Revisar as permissões (já pré-selecionadas)
3. Clicar em "Generate token"
4. Copiar o token gerado

## Como Funciona o Link

O link usa parâmetros de URL do GitHub para pré-configurar a página de criação de token:

```
https://github.com/settings/tokens/new?description=DESCRICAO&scopes=ESCOPOS
```

**Parâmetros:**
- `description`: Define o nome/descrição do token
- `scopes`: Define os escopos de permissão (separados por vírgula se múltiplos)

**Para este MCP:**
- `description=MCP%20GitHub%20Project%20Manager` (espaços codificados como %20)
- `scopes=repo` (acesso completo a repositórios)

## Escopos Necessários

### `repo` - Acesso Completo a Repositórios

Este é o único escopo necessário para o MCP funcionar. Ele inclui:

- ✅ `repo:status` - Acesso ao status de commits
- ✅ `repo_deployment` - Acesso a deployments
- ✅ `public_repo` - Acesso a repositórios públicos
- ✅ `repo:invite` - Acesso a convites de repositório
- ✅ `security_events` - Acesso a eventos de segurança

**Por que precisamos de `repo`?**

O MCP precisa:
- **Ler** arquivos de repositórios (públicos e privados)
- **Escrever** arquivos (criar, atualizar, deletar)
- **Listar** conteúdo de diretórios
- **Buscar** conteúdo em arquivos
- **Fazer commits** para salvar mudanças

## Criação Manual (Alternativa)

Se preferir criar o token manualmente:

### Passo 1: Acesse as Configurações

Vá para: [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)

### Passo 2: Gerar Novo Token

1. Clique em **"Generate new token"**
2. Escolha **"Generate new token (classic)"**

### Passo 3: Configure o Token

**Note (Descrição):**
```
MCP GitHub Project Manager
```

**Expiration:**
- Escolha a duração desejada (recomendado: 90 dias ou "No expiration" para uso pessoal)

**Select scopes:**
- ☑️ **repo** - Full control of private repositories
  - ☑️ repo:status
  - ☑️ repo_deployment
  - ☑️ public_repo
  - ☑️ repo:invite
  - ☑️ security_events

### Passo 4: Gerar e Copiar

1. Clique em **"Generate token"** no final da página
2. **Copie o token imediatamente** - você não poderá vê-lo novamente!
3. Salve em um local seguro (gerenciador de senhas recomendado)

## Segurança do Token

### ⚠️ Importante

- **Nunca compartilhe** seu token
- **Nunca comite** o token no Git
- **Use variáveis de ambiente** (arquivo `.env`)
- **Revogue tokens** não utilizados
- **Use tokens específicos** para cada aplicação

### Boas Práticas

1. **Use o arquivo `.env`:**
   ```ini
   GITHUB_TOKEN=seu_token_aqui
   ```

2. **Adicione `.env` ao `.gitignore`:**
   ```
   .env
   .env.local
   ```

3. **Revogue tokens antigos:**
   - Vá para [GitHub Settings > Personal access tokens](https://github.com/settings/tokens)
   - Clique em "Delete" nos tokens não utilizados

4. **Use tokens com expiração:**
   - Para ambientes de produção, use tokens com expiração
   - Configure alertas de renovação

## Renovação de Token

Quando um token expira:

1. **Gere um novo token** usando o [link direto](https://github.com/settings/tokens/new?description=MCP%20GitHub%20Project%20Manager&scopes=repo)
2. **Atualize o arquivo `.env`** com o novo token
3. **Reinicie o servidor MCP** (ou a ferramenta que usa o MCP)
4. **Revogue o token antigo** se ainda estiver ativo

## Troubleshooting

### "Token inválido" ou "Bad credentials"

**Causas possíveis:**
- Token expirado
- Token revogado
- Token copiado incorretamente (espaços extras)
- Escopo insuficiente

**Solução:**
1. Gere um novo token usando o link direto
2. Certifique-se de copiar o token completo
3. Verifique se não há espaços antes/depois do token no `.env`

### "Not Found" ou "Repository not found"

**Causas possíveis:**
- Token não tem acesso ao repositório
- Repositório é privado e o token não tem escopo `repo`
- Nome do repositório ou owner incorretos

**Solução:**
1. Verifique se o token tem escopo `repo`
2. Confirme que `GITHUB_OWNER` e `GITHUB_REPO` estão corretos no `.env`
3. Teste o acesso ao repositório no navegador enquanto logado

### "API rate limit exceeded"

**Causas possíveis:**
- Muitas requisições em pouco tempo
- Usando token sem autenticação (limite menor)

**Solução:**
1. Aguarde 1 hora para o limite resetar
2. Certifique-se de que está usando um token válido
3. Reduza a frequência de requisições

## Recursos Adicionais

- [Documentação oficial do GitHub sobre tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Escopos de token do GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)
- [Melhores práticas de segurança](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation)
