# Arquitetura de Informação - Aplicação Web Bible-BE

## Estrutura Principal da Aplicação

### 1. Tela Principal (Home/Leitura)
**Componentes:**
- Header com navegação e busca
- Painel principal de leitura
- Sidebar de navegação (livros/capítulos)
- Painel de anotações (colapsável)
- Footer com controles de visualização

### 2. Hierarquia de Navegação
```
Home
├── Antigo Testamento
│   ├── Gênesis (50 capítulos)
│   ├── Êxodo (40 capítulos)
│   └── ... (outros livros)
└── Novo Testamento
    ├── Mateus (28 capítulos)
    ├── Marcos (16 capítulos)
    └── ... (outros livros)
```

### 3. Sistema de Anotações
**Tipos de Anotação:**
- **Highlight**: 5 cores predefinidas
- **Nota**: Texto livre vinculado ao versículo
- **Marcador**: Favoritar versículo
- **Tag**: Categorização personalizada

## Fluxo de Usuário Principal

### Fluxo 1: Leitura Básica
1. **Entrada** → Tela principal
2. **Navegação** → Selecionar livro/capítulo
3. **Leitura** → Visualizar versículos
4. **Navegação** → Próximo/anterior capítulo

### Fluxo 2: Busca de Versículo
1. **Busca** → Digitar referência ou texto
2. **Resultados** → Lista de versículos encontrados
3. **Seleção** → Ir para versículo específico
4. **Leitura** → Visualizar no contexto

### Fluxo 3: Criar Anotação
1. **Seleção** → Selecionar texto do versículo
2. **Menu** → Popup com opções de anotação
3. **Tipo** → Escolher highlight, nota ou marcador
4. **Conteúdo** → Adicionar texto (se nota)
5. **Salvar** → Confirmar anotação

### Fluxo 4: Visualizar Anotações
1. **Acesso** → Abrir painel de anotações
2. **Filtro** → Por tipo, cor ou data
3. **Navegação** → Clicar para ir ao versículo
4. **Edição** → Modificar ou excluir anotação

## Componentes de Interface

### Header
- Logo/Nome da aplicação
- Barra de busca central
- Seletor de versão da Bíblia
- Menu de configurações
- Botão de anotações

### Sidebar de Navegação
- Lista de livros (colapsável por testamento)
- Indicador de capítulo atual
- Navegação rápida por capítulos
- Histórico de leitura recente

### Painel Principal
- Título do livro e capítulo
- Versículos numerados
- Texto com formatação clara
- Indicadores visuais de anotações
- Controles de navegação (anterior/próximo)

### Painel de Anotações
- Lista de anotações do capítulo atual
- Filtros por tipo e cor
- Busca dentro das anotações
- Opções de edição/exclusão

### Footer
- Controles de zoom/fonte
- Modo escuro/claro
- Configurações de layout
- Informações de sincronização

## Estados da Interface

### Estado Padrão
- Sidebar fechada em mobile
- Painel de anotações fechado
- Foco no texto bíblico

### Estado de Anotação
- Texto selecionado destacado
- Menu popup visível
- Painel de anotações aberto

### Estado de Busca
- Resultados destacados no texto
- Lista de resultados visível
- Navegação entre ocorrências

## Responsividade

### Desktop (>1024px)
- Layout de 3 colunas
- Sidebar sempre visível
- Painel de anotações lateral

### Tablet (768px-1024px)
- Layout de 2 colunas
- Sidebar colapsável
- Painel de anotações sobreposto

### Mobile (<768px)
- Layout de 1 coluna
- Navegação por menu hamburger
- Anotações em modal fullscreen

