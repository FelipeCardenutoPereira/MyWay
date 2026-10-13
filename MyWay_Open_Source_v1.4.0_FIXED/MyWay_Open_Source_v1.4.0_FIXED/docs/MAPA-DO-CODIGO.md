# Mapa do código — MyWay Open 1.3.1 MVC

## Comece por `src/mvc/`

A interface foi separada para evitar editar um `index.html` gigante.

| Quero alterar | Onde mexer primeiro |
| --- | --- |
| HTML da aba Hoje | `src/mvc/views/tabs/today.html` |
| HTML de Finanças | `src/mvc/views/tabs/finance.html` |
| HTML de Resiliência | `src/mvc/views/tabs/resilience.html` |
| HTML de Controle | `src/mvc/views/tabs/control.html` |
| Comportamento novo de uma aba | `src/mvc/controllers/tabs/<aba>.controller.js` |
| Tema, cor do painel e wallpaper | `src/mvc/controllers/control/appearance.controller.js` + `src/mvc/models/appearance.model.js` + `src/mvc/styles/control/appearance.css` |
| Casca geral, login, menu e topbar | `src/index.shell.html` |
| Pesquisa de ferramentas / menu lateral | `src/features/navigation/tool-search127.js` + `.css` |
| Inspiração / referências | `src/features/inspiration/reliable-feed127.js` + `.css` |
| Mapa de escolhas / resiliência | `src/features/resilience/simple-map127.js` + `.css` |
| Login/Supabase legado | `src/js/modules/70-sync-auth.js`, `91-auth-access125.js`, `99-ux-auth126.js` |
| Dashboard/favoritos legado | `src/js/modules/98-dashboard-layout.js` |
| Host Windows | `desktop/` |
| Android | `android/` |

## Arquivos gerados — não editar

- `src/index.html`
- `src/js/app.js`
- `src/styles/app.css`

`tools/build-ui.mjs` recompõe automaticamente as 23 views no `index.html`, junta JavaScript no `app.js` e CSS no `app.css`.

## Fluxo rápido

1. Abra `MyWay.VisualStudio.sln` ou execute `ABRIR-MYWAY-NO-VISUAL-STUDIO.bat`.
2. Edite a view/controller/model correspondente.
3. Rode `npm run dev` para prévia automática.
4. Antes de build, rode `npm run sync` e `npm run check`.
