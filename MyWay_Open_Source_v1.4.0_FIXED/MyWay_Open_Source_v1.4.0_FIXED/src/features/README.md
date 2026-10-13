# Features editáveis do MyWay

Esta pasta é a primeira parada para alterações no Visual Studio Code.

- `appearance/`: tema, wallpaper e aparência.
- `navigation/`: menu lateral, pesquisa de ferramentas e navegação.
- `inspiration/`: feed de inspiração e fallback offline.
- `resilience/`: mapa de escolhas/resiliência.
- `ux/`: padrão de botões e pop-ups sem rolagem.
- `zz-stability/`: última camada aplicada; contraste, sidebar, wallpaper, ícone e persistência de sessão Windows.

Os arquivos gigantes `src/js/app.js` e `src/styles/app.css` são gerados automaticamente.
Para recompilar: `npm run build:ui`.
Para sincronizar Windows + Android: `npm run sync`.
