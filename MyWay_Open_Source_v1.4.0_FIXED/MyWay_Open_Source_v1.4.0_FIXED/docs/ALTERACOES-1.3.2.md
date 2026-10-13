# MyWay 1.3.2 — Wallpaper + Nutrição

## Wallpaper

O controle não é mais criado apenas por JavaScript. Ele existe diretamente em:

`src/mvc/views/tabs/control.html`

No card **VISUAL DO PAINEL** ficam juntos:

1. Tema do painel
2. Cor do painel
3. Wallpaper

A regra em `src/mvc/styles/control/appearance.css` desliga o fundo de cor e o ambiente abstrato quando `wallpaper-enabled127` está ativo. A imagem é desenhada pela camada `#wallpaperLayer127`.

Lógica: `src/mvc/controllers/control/appearance.controller.js`

## Nutrição

Arquivos principais:

- View: `src/mvc/views/tabs/nutrition.html`
- Model: `src/mvc/models/nutrition.model.js`
- Controller: `src/mvc/controllers/tabs/nutrition.controller.js`
- CSS: `src/mvc/styles/nutrition/nutrition.css`

A aba permite registrar refeições e grupos alimentares, identifica palavras comuns no texto e gera um mapa dos últimos 7 dias com observação, ponto de melhoria e próxima ação.
