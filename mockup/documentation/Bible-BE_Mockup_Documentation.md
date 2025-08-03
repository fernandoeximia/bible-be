# Bible-BE - Documentação de Mockup UX/UI

## Visão Geral do Projeto

**Nome:** Bible-BE  
**Tipo:** Aplicação Web de Leitura da Bíblia  
**Foco Principal:** Consulta fácil de versículos e sistema robusto de anotações  
**Plataformas:** Web (Desktop e Mobile)  

### Objetivos do Projeto

1. **Facilitar a leitura da Bíblia** com interface limpa e intuitiva
2. **Simplificar a consulta de versículos** através de busca avançada
3. **Permitir anotações eficientes** com sistema de cores e notas pessoais
4. **Garantir experiência responsiva** em todos os dispositivos
5. **Promover o estudo bíblico** através de ferramentas organizadas

## Pesquisa e Referências

### Aplicações Analisadas
- **YouVersion**: Referência em simplicidade e usabilidade
- **Olive Tree**: Foco em sincronização e recursos avançados
- **Pencil Bible**: Inovação em anotações manuscritas
- **BibleProject**: Design moderno e recursos interativos

### Insights Principais
- Interface clean com foco no texto bíblico
- Sistema de cores para categorização de anotações
- Navegação intuitiva entre livros e capítulos
- Busca robusta por texto e referências
- Sincronização entre dispositivos

## Arquitetura de Informação

### Estrutura Principal
```
Bible-BE
├── Header (Navegação e Busca)
├── Sidebar (Livros e Capítulos)
├── Conteúdo Principal (Texto Bíblico)
├── Painel de Anotações (Lateral/Modal)
└── Footer (Controles de Visualização)
```

### Hierarquia de Navegação
- **Antigo Testamento** (39 livros)
- **Novo Testamento** (27 livros)
- **Capítulos** por livro
- **Versículos** numerados
- **Anotações** organizadas por referência



## Fluxos de Usuário

### 1. Fluxo de Leitura Básica
1. **Entrada** → Usuário acessa a aplicação
2. **Navegação** → Seleciona livro no sidebar
3. **Capítulo** → Escolhe capítulo específico
4. **Leitura** → Visualiza versículos formatados
5. **Navegação** → Usa controles para próximo/anterior

### 2. Fluxo de Busca de Versículos
1. **Busca** → Digita referência (ex: "João 3:16") ou texto
2. **Resultados** → Visualiza lista de versículos encontrados
3. **Seleção** → Clica no resultado desejado
4. **Contexto** → Versículo é exibido no contexto do capítulo
5. **Navegação** → Pode continuar lendo ou fazer nova busca

### 3. Fluxo de Criação de Anotação
1. **Seleção** → Seleciona texto do versículo
2. **Menu** → Popup aparece com opções de anotação
3. **Tipo** → Escolhe entre highlight, nota ou marcador
4. **Personalização** → Seleciona cor (se highlight) ou escreve nota
5. **Salvamento** → Anotação é salva automaticamente
6. **Visualização** → Anotação aparece no painel lateral

### 4. Fluxo de Gerenciamento de Anotações
1. **Acesso** → Abre painel de anotações
2. **Filtro** → Filtra por cor, data ou tipo
3. **Busca** → Busca dentro das anotações salvas
4. **Navegação** → Clica para ir ao versículo anotado
5. **Edição** → Modifica ou exclui anotação existente

## Design System

### Paleta de Cores

#### Cores Principais
- **Azul Escuro**: #2C3E50 (Header e elementos principais)
- **Branco**: #FFFFFF (Fundo principal)
- **Cinza Claro**: #F8F9FA (Sidebar e áreas secundárias)
- **Cinza Médio**: #6C757D (Texto secundário)
- **Preto**: #212529 (Texto principal)

#### Cores de Anotação
- **Amarelo**: #FFF3CD (Versículos importantes/favoritos)
- **Verde**: #D4EDDA (Promessas de Deus)
- **Azul**: #CCE5FF (Comandos/instruções)
- **Rosa**: #F8D7DA (Avisos/advertências)
- **Laranja**: #FFE4B5 (Profecias)
- **Roxo**: #E2D9F3 (Orações)

### Tipografia

#### Fontes
- **Texto Bíblico**: Serif (Georgia, Times New Roman)
- **Interface**: Sans-serif (Inter, Helvetica, Arial)

#### Tamanhos
- **Desktop**:
  - Título do livro: 32px
  - Número do versículo: 16px
  - Texto do versículo: 18px
  - Interface: 14-16px

- **Mobile**:
  - Título do livro: 24px
  - Número do versículo: 14px
  - Texto do versículo: 16px
  - Interface: 14px

### Espaçamento e Layout

#### Grid System
- **Desktop**: Layout de 3 colunas (Sidebar + Conteúdo + Anotações)
- **Tablet**: Layout de 2 colunas (Conteúdo + Sidebar colapsável)
- **Mobile**: Layout de 1 coluna (Navegação por menu)

#### Breakpoints
- **Desktop**: >1024px
- **Tablet**: 768px - 1024px
- **Mobile**: <768px


## Especificações de Componentes

### Header
**Funcionalidades:**
- Logo/nome da aplicação (canto esquerdo)
- Barra de busca central com placeholder "Buscar versículo ou texto..."
- Seletor de versão da Bíblia (dropdown)
- Ícone de configurações
- Botão de anotações (contador de anotações)

**Comportamento:**
- Busca em tempo real com sugestões
- Busca por referência (ex: "João 3:16") ou texto livre
- Header fixo no topo durante scroll

### Sidebar de Navegação
**Funcionalidades:**
- Lista de livros organizados por testamento
- Indicador visual do livro/capítulo atual
- Navegação rápida por capítulos
- Seção "Recentes" com últimas leituras
- Busca rápida de livros

**Comportamento:**
- Colapsável em tablets e mobile
- Scroll independente do conteúdo principal
- Destaque visual do item ativo

### Painel Principal de Leitura
**Funcionalidades:**
- Título do livro e número do capítulo
- Versículos numerados e formatados
- Indicadores visuais de anotações existentes
- Seleção de texto para anotação
- Controles de navegação (anterior/próximo)

**Comportamento:**
- Texto responsivo e legível
- Scroll suave entre capítulos
- Destaque de versículos anotados
- Menu contextual ao selecionar texto

### Sistema de Anotações

#### Popup de Anotação
**Funcionalidades:**
- Opções de highlight com 6 cores
- Campo para adicionar nota textual
- Botão de marcador/favorito
- Botões salvar/cancelar

**Comportamento:**
- Aparece ao selecionar texto
- Posicionamento inteligente (evita sair da tela)
- Salvamento automático

#### Painel de Anotações
**Funcionalidades:**
- Lista de todas as anotações do usuário
- Filtros por cor, tipo e data
- Busca dentro das anotações
- Preview do versículo e nota
- Opções de editar/excluir

**Comportamento:**
- Colapsável/expansível
- Sincronização em tempo real
- Navegação direta ao versículo

### Busca Avançada
**Funcionalidades:**
- Busca por referência exata
- Busca por texto livre
- Filtros por livro/testamento
- Histórico de buscas
- Sugestões automáticas

**Resultados:**
- Lista de versículos encontrados
- Destaque dos termos buscados
- Contexto do versículo
- Opção de ir para o capítulo completo

## Funcionalidades Técnicas

### Sistema de Anotações
- **Tipos**: Highlight, Nota, Marcador
- **Cores**: 6 opções predefinidas
- **Armazenamento**: Local Storage + Sincronização opcional
- **Formato**: JSON com referência bíblica e conteúdo
- **Busca**: Indexação para busca rápida

### Navegação
- **URL amigável**: /livro/capitulo/versiculo
- **Histórico**: Navegação com botões voltar/avançar
- **Bookmarks**: Salvamento de posição de leitura
- **Compartilhamento**: URLs diretas para versículos

### Performance
- **Carregamento**: Lazy loading de capítulos
- **Cache**: Armazenamento local de conteúdo
- **Otimização**: Minificação de texto bíblico
- **Responsividade**: Adaptação automática de layout

### Acessibilidade
- **Contraste**: Conformidade WCAG 2.1 AA
- **Navegação**: Suporte completo a teclado
- **Screen readers**: Marcação semântica adequada
- **Zoom**: Suporte a zoom até 200%
- **Modo escuro**: Alternativa para baixa luminosidade


## Mockups Criados

### Desktop
1. **Tela Principal** - Layout completo com sidebar, conteúdo e painel de anotações
2. **Sistema de Anotação** - Popup de anotação com opções de cores e notas
3. **Busca de Versículos** - Interface de busca com resultados e contexto
4. **Painel de Anotações** - Lista expandida de anotações salvas

### Mobile
1. **Tela Principal Mobile** - Layout otimizado para smartphone
2. **Menu de Navegação** - Sidebar adaptada para mobile
3. **Tela de Configurações** - Opções de personalização

### Wireframes
1. **Wireframe Desktop** - Estrutura básica da interface
2. **Wireframe de Anotações** - Fluxo de criação de anotações
3. **Wireframe de Busca** - Layout de resultados de busca
4. **Wireframes Mobile** - Versões mobile das principais telas

## Especificações de Implementação

### Stack Tecnológico Recomendado

#### Frontend
- **Framework**: React.js ou Vue.js
- **Styling**: Tailwind CSS ou Styled Components
- **Estado**: Redux/Zustand para gerenciamento de estado
- **Roteamento**: React Router ou Vue Router

#### Backend
- **API**: Node.js com Express ou Python Flask
- **Banco de Dados**: PostgreSQL para dados estruturados
- **Cache**: Redis para performance
- **Autenticação**: JWT para sessões de usuário

#### Infraestrutura
- **Hospedagem**: Vercel, Netlify ou AWS
- **CDN**: CloudFlare para distribuição de conteúdo
- **Monitoramento**: Sentry para tracking de erros

### Estrutura de Dados

#### Versículos
```json
{
  "id": "genesis_1_1",
  "book": "Genesis",
  "chapter": 1,
  "verse": 1,
  "text": "No princípio, Deus criou os céus e a terra.",
  "version": "NVI"
}
```

#### Anotações
```json
{
  "id": "annotation_123",
  "user_id": "user_456",
  "verse_id": "genesis_1_1",
  "type": "highlight|note|bookmark",
  "color": "#FFF3CD",
  "note": "Texto da anotação pessoal",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### APIs Necessárias

#### Endpoints Principais
- `GET /api/books` - Lista de livros da Bíblia
- `GET /api/books/{book}/chapters/{chapter}` - Capítulo específico
- `GET /api/search?q={query}` - Busca de versículos
- `POST /api/annotations` - Criar anotação
- `GET /api/annotations` - Listar anotações do usuário
- `PUT /api/annotations/{id}` - Atualizar anotação
- `DELETE /api/annotations/{id}` - Excluir anotação

## Próximos Passos

### Fase 1: Desenvolvimento Base (4-6 semanas)
1. **Setup do projeto** e configuração do ambiente
2. **Implementação da estrutura básica** de navegação
3. **Integração com API bíblica** (Bible API ou similar)
4. **Interface de leitura básica** sem anotações
5. **Responsividade** para mobile e desktop

### Fase 2: Sistema de Anotações (3-4 semanas)
1. **Implementação do sistema de highlights**
2. **Funcionalidade de notas pessoais**
3. **Painel de gerenciamento de anotações**
4. **Sistema de cores e categorização**
5. **Persistência local e sincronização**

### Fase 3: Funcionalidades Avançadas (2-3 semanas)
1. **Busca avançada** com filtros
2. **Histórico de leitura**
3. **Configurações de usuário**
4. **Modo escuro**
5. **Otimizações de performance**

### Fase 4: Polimento e Deploy (1-2 semanas)
1. **Testes de usabilidade**
2. **Correções de bugs**
3. **Otimização para SEO**
4. **Deploy em produção**
5. **Documentação de usuário**

## Considerações Finais

### Pontos Fortes do Design
- **Interface limpa** focada na leitura
- **Sistema de anotações intuitivo** com cores
- **Navegação eficiente** entre livros e capítulos
- **Responsividade completa** para todos os dispositivos
- **Acessibilidade** considerada desde o design

### Oportunidades de Melhoria Futura
- **Planos de leitura** estruturados
- **Compartilhamento social** de versículos
- **Comentários bíblicos** integrados
- **Áudio da Bíblia** para acessibilidade
- **Sincronização em nuvem** para múltiplos dispositivos
- **Modo offline** para leitura sem internet

### Métricas de Sucesso
- **Tempo de carregamento** < 3 segundos
- **Taxa de retenção** > 70% após 7 dias
- **Facilidade de uso** (SUS Score > 80)
- **Acessibilidade** (WCAG 2.1 AA compliance)
- **Performance mobile** (Lighthouse Score > 90)

---

**Projeto:** Bible-BE  
**Versão da Documentação:** 1.0  
**Data:** Janeiro 2025  
**Status:** Mockup Completo - Pronto para Desenvolvimento

