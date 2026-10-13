# MyWay 1.3.1 · Guia Visual Studio / MVC

## O que editar

A interface deixou de depender de um `index.html` gigante como arquivo de trabalho.

- `src/index.shell.html` — casca geral: `head`, login/onboarding, menu lateral, topbar e elementos globais.
- `src/mvc/views/tabs/` — um HTML por aba. Ex.: `today.html`, `finance.html`, `resilience.html`, `control.html`.
- `src/mvc/controllers/tabs/` — ponto reservado para eventos/comportamentos exclusivos de cada aba.
- `src/mvc/controllers/control/appearance.controller.js` — tema, cor do painel e wallpaper.
- `src/mvc/models/` — regras e dados reutilizáveis. O primeiro model migrado é `appearance.model.js`.
- `src/mvc/styles/` — CSS novo por área. É carregado por último para substituir regras antigas sem espalhar `!important` pelo projeto.

## Não editar diretamente

Estes arquivos são produtos do build:

- `src/index.html`
- `src/js/app.js`
- `src/styles/app.css`

Ao salvar uma view/controller/model e executar o modo DEV, eles são reconstruídos automaticamente.

## Rodar no navegador

No terminal, na pasta raiz:

```bat
npm run dev
```

Depois abra:

```text
http://127.0.0.1:5173/dev/editor.html
```

O servidor observa também `src/mvc/`, então uma alteração em qualquer aba reconstrói o front.

## Gerar Windows + Android a partir da mesma interface

```bat
npm run sync
npm run check
```

`npm run sync` monta o HTML final e copia a mesma interface para `web/`, `desktop/www/` e `android/assets/www/`.

## Wallpaper

O wallpaper agora é modo exclusivo de fundo:

1. Com `Sem imagem`, o background usa o tema/cor do painel.
2. Ao escolher uma imagem, a cor de fundo do `body` e da área `.main` fica transparente.
3. Não existe gradiente colorido entre a imagem e o painel.
4. Tema e cor ainda controlam cartões, textos e contraste; eles não substituem a imagem selecionada.

## Migração MVC

O projeto ainda contém `src/js/modules/` e `src/styles/modules/` por compatibilidade. Não é necessário migrar tudo de uma vez. Para qualquer mudança nova de uma aba, prefira:

1. HTML em `mvc/views/tabs/<aba>.html`;
2. eventos em `mvc/controllers/tabs/<aba>.controller.js`;
3. estado/regra reutilizável em `mvc/models/`;
4. CSS em `mvc/styles/`.

Isso permite desmontar o legado gradualmente sem quebrar o executável e o APK ao mesmo tempo.
