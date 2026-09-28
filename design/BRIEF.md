# Rota Saúde · Funcionalidades do Ciclo 1 — brief de implementação

## Objetivo
App web estático e público que lista as funcionalidades do Ciclo 1 (módulos 01 a 10) agrupadas por módulo. Cada funcionalidade tem uma página própria. Não tem backend, login nem formulário.

## Arquivos deste pacote
- `funcionalidades.json`: **fonte única do conteúdo**. São 10 módulos e 115 funcionalidades, com status, descrição, benefício e telas. Não reescreva os textos; leia deste arquivo.
- `referencia-layout.html`: protótipo funcional. Siga o layout, os tokens de cor, a tipografia e o comportamento dele. O código é só referência, não é para copiar.

## Stack
- React + Vite + TypeScript, como os outros apps do projeto (ajuste ao padrão do repositório).
- Roteamento no cliente (React Router, ou o que o projeto já usa):
  - `/` → lista de módulos
  - `/funcionalidades/:slug` → página da funcionalidade (ex.: `/funcionalidades/f-03.1`)
- Importe o JSON no build (`import data from './funcionalidades.json'`). Nada é buscado em tempo de execução.
- Crie tipos TypeScript para o JSON (`Module`, `Feature`, `Status`, `Surface`).

## Telas
### Lista (`/`)
- Cabeçalho: marca "Rota Saúde", selo "Ciclo 1 · módulos 01 a 10", título "Funcionalidades do Ciclo 1" e um parágrafo de introdução.
- Um bloco recolhível por módulo (`<details>`/`<summary>` nativo, ou um accordion acessível):
  - fechado: "Módulo NN", nome, `description`, selo de status e contagem (módulo 10: "5 de 7 entregues");
  - aberto: a lista de funcionalidades; cada item é um link para a página da funcionalidade;
  - item com status diferente do módulo (ex.: "Planejado", "Canal desativado") mostra esse status ao lado do título.
- Guarde quais módulos estão abertos. Ao voltar de uma funcionalidade, o módulo dela deve aparecer aberto e rolado até a vista.

### Página da funcionalidade
- Link "Todas as funcionalidades", que volta para a lista com o módulo aberto.
- Linha de apoio com "Módulo NN · Nome" e o ID (`F-NN.M`) discreto, em fonte mono.
- Título (h1), selo de status, benefício (`benefit`) em destaque e `note` quando existir.
- "Onde aparece": um cartão por item de `surfaces`, com ícone, rótulo e texto de `surfaces` no JSON. Se `surfaces` estiver vazio, mostre "Sem tela em uso: depende de um canal desativado."
- Navegação "Anterior / Próxima" dentro do mesmo módulo.
- Slug inválido → página "Funcionalidade não encontrada" com link para a lista.

## Componentes sugeridos
`StatusBadge`, `ModuleAccordion`, `FeatureLink`, `FeaturePage`, `SurfaceCard`, `Pager`.

## Regras de conteúdo
- Só o status `available` usa linguagem afirmativa. Os textos de `validating` e `planned` já vêm no JSON com o prefixo "Em validação:" e "Planejado:"; mantenha-os.
- O selo de status sempre combina ícone e texto, para ser legível em escala de cinza e por pessoas daltônicas: círculo cheio com check (disponível), meio cheio (em validação), contorno com ponto (planejado) e contorno cortado (desativado). Os SVGs estão no HTML de referência.
- Toda a interface em português do Brasil.

## Visual
- Tokens em CSS custom properties, com tema claro e escuro (`prefers-color-scheme`). Os valores estão no `:root` do HTML de referência.
- Fontes (Google Fonts): Schibsted Grotesk (títulos), IBM Plex Sans (texto) e IBM Plex Mono (IDs).
- Responsivo a partir de 360px, sem rolagem horizontal.

## Acessibilidade (critério de aceite)
- Contraste AA nos dois temas.
- Foco visível em tudo que é clicável; accordion e links operáveis só pelo teclado.
- Hierarquia de títulos correta: h1 por página; h2 nos módulos.
- Ao abrir uma funcionalidade, mova o foco para o h1. Atualize o `document.title` a cada rota.
- Respeite `prefers-reduced-motion`.

## Testes
- Unitário: a validação dos dados confere que todo `slug` é único e que todo `surfaces` e todo `status` existem nos mapas do JSON.
- Componentes/e2e: abrir e fechar um módulo; navegar até uma funcionalidade e voltar com o módulo aberto; slug inválido; Anterior/Próxima.

## Fora do escopo
Busca, filtros, login, backend e formulários.
