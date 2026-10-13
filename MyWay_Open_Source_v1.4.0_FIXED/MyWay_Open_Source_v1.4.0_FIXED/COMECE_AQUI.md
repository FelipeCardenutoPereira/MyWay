# MyWay Open 1.3.7 MVC — comece aqui

## 1. Abra o projeto

### Visual Studio 2022

Abra `MyWay.VisualStudio.sln` ou dê dois cliques em `ABRIR-MYWAY-NO-VISUAL-STUDIO.bat`.

### VS Code

Abra `MyWay.code-workspace` ou execute `EDITAR-MYWAY.bat`.

## 2. Para mudar uma tela

Vá em `src/mvc/views/tabs/` e abra a aba correspondente:

- `today.html` — Hoje
- `finance.html` — Finanças
- `resilience.html` — Resiliência
- `journal.html` — Diário
- `control.html` — Controle
- etc.

Não edite `src/index.html`: ele é gerado.

## 3. Para mudar comportamento

Use `src/mvc/controllers/tabs/<aba>.controller.js` para comportamento exclusivo da aba.

Tema, cor e wallpaper ficam em:

- `src/mvc/controllers/control/appearance.controller.js`
- `src/mvc/models/appearance.model.js`
- `src/mvc/styles/control/appearance.css`

## 4. Visualize enquanto edita

```bash
npm run dev
```

Abra `http://127.0.0.1:5173/dev/editor.html`.

A prévia observa `src/mvc/`, `src/features/` e a base legada.

## 5. Valide e sincronize

```bash
npm run sync
npm run check
```

O build monta as 24 views no `index.html` final e envia a mesma interface para Windows e Android.

## 6. Gere os aplicativos

```bash
npm run build:windows
npm run build:android
```

Para o pacote Android paralelo CLEAN, quando necessário:

```bash
npm run build:android:clean
```

A chave de assinatura deve permanecer privada.
