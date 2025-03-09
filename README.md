# Plano de Estudos App

## Sobre o Projeto
Este é um aplicativo React desenvolvido com Vite para gerenciar planos de estudos.

## Como Manter o Repositório Abaixo do Limite de 100MB do GitHub

### 1. Arquivos Ignorados pelo Git
O arquivo `.gitignore` já foi configurado para excluir os seguintes diretórios e arquivos que normalmente ocupam muito espaço:

- `node_modules/` - Esta pasta contém todas as dependências do projeto e geralmente é muito grande (>100MB)
- `dist/` e `build/` - Arquivos de compilação que podem ser recriados
- Arquivos de ambiente (`.env`, etc.)
- Arquivos de log e debug
- Arquivos de configuração de editores
- Arquivos de sistema

### 2. Instalação e Desenvolvimento

Para trabalhar com este projeto:

```bash
# Clone o repositório
git clone [URL_DO_REPOSITÓRIO]

# Entre no diretório do projeto
cd plano-de-estudos

# Instale as dependências (isso criará a pasta node_modules localmente, que não será enviada ao GitHub)
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### 3. Boas Práticas para Manter o Repositório Pequeno

- **Nunca** remova o arquivo `.gitignore` ou modifique-o para incluir `node_modules`
- Evite adicionar arquivos binários grandes como imagens, vídeos ou PDFs ao repositório
- Se precisar adicionar arquivos grandes, considere usar o [Git LFS](https://git-lfs.github.com/)
- Periodicamente, verifique o tamanho do seu repositório com `git count-objects -vH`
- Se o repositório já estiver grande, considere usar ferramentas como `git filter-branch` ou `BFG Repo-Cleaner` para remover arquivos grandes do histórico

### 4. Alternativas para Arquivos Grandes

- Use serviços de armazenamento em nuvem para arquivos de mídia grandes
- Considere usar CDNs para bibliotecas JavaScript em vez de incluí-las no repositório
- Otimize imagens antes de adicioná-las ao repositório

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Visualizar build de produção localmente
npm run preview
```