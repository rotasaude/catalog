# Rota Saúde · Catálogo de funcionalidades

App web estático e público que lista as funcionalidades do Ciclo 1 (MVP, módulos 01 a 14) e Ciclo 2 (módulos 15 a 18),
agrupadas por módulo, com uma página por funcionalidade. Não tem backend, login nem
formulário.

- Conteúdo: `src/data/funcionalidades.json` é a **fonte única**, importada no build.
  Para mudar um texto ou status, edite o JSON; o teste de dados confere slugs únicos
  e que todo `status`/`surfaces` exista nos mapas do próprio arquivo.
- Rotas: `/` (lista) e `/funcionalidades/:slug` (ex.: `/funcionalidades/f-03.1`).
  Em produção, o servidor precisa devolver `index.html` para qualquer caminho (SPA).
- Brief e protótipo do design: `design/`.

```bash
npm install
npm run dev        # http://localhost:5178
npm test           # vitest
npm run typecheck
npm run build      # dist/
```
