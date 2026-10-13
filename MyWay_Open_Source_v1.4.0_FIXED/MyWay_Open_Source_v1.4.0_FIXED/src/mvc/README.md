# MVC do MyWay

- `views/tabs/`: HTML de cada aba.
- `controllers/tabs/`: eventos e comportamento específico de cada aba.
- `models/`: regras/estado compartilhado por domínio.
- `styles/`: CSS novo, organizado por área.

`tools/build-ui.mjs` junta as views no `src/index.html` e empacota controllers/models em `src/js/app.js`.

Regra prática: não coloque HTML novo diretamente em `src/index.html`; edite a view correspondente.
