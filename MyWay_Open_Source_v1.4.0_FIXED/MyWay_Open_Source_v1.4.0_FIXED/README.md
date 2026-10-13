# MyWay Open — v1.3.7 MVC

MyWay em **HTML + CSS + JavaScript**, com host Windows em **Go** e projeto Android em **Java/Gradle**. Windows, Android e web continuam usando a mesma interface gerada a partir de `src/`.

## Edite primeiro em `src/mvc/`

O HTML foi separado por aba para não depender de um `index.html` com milhares de linhas.

```text
src/mvc/
├── views/tabs/          um HTML por aba
├── controllers/tabs/    comportamento novo por aba
├── controllers/control/ aparência e controllers compostos
├── models/              regras/estado por domínio
└── styles/              CSS novo organizado por área
```

`src/index.shell.html` guarda a casca global. `src/index.html`, `src/js/app.js` e `src/styles/app.css` são **gerados** e não devem ser editados manualmente.

## Visual Studio

Abra `MyWay.VisualStudio.sln` no Visual Studio 2022 ou execute `ABRIR-MYWAY-NO-VISUAL-STUDIO.bat`.

Para VS Code, `MyWay.code-workspace` continua disponível.

## O que mudou na v1.3.7

- **HTML por aba:** 24 views em `src/mvc/views/tabs/`.
- **MVC gradual:** controllers por aba, model de aparência e registro de controllers sem reescrever o legado de uma vez.
- **Wallpaper:** a imagem selecionada vira o fundo real; não há gradiente/cor sobre ela e `.main` fica transparente enquanto o wallpaper estiver ativo.
- **Aparência agrupada:** tema do painel, cor do painel e wallpaper ficam no mesmo bloco de configuração.
- **Build seguro:** `tools/build-ui.mjs` recompõe as views em um único `index.html` e executa o bootstrap por último, depois de models/features/controllers, mantendo compatibilidade com Windows e Android.
- **Atualização Windows:** uma versão nova não reutiliza silenciosamente o backend de uma versão antiga ainda preso à porta local; a versão é conferida antes da janela abrir.
- **Inspiração resiliente:** pins locais são preservados/mesclados durante a hidratação e Explorar mantém referências locais quando o endpoint online não está disponível.
- **Preview automático:** `npm run dev` observa também `src/mvc/`.

## Estrutura resumida

```text
src/
  index.shell.html       shell editável
  index.html             gerado
  mvc/                   Views / Controllers / Models / Styles
  features/              features isoladas ainda fora do MVC
  js/modules/            base antiga em migração
  styles/modules/        estilos antigos em migração
  assets/

dev/                    editor/preview
desktop/                host Windows em Go
installer/              instalador Windows
android/                projeto Android
tools/                  build, validação e sincronização
```

## Comandos

```bash
npm run dev
npm run build:ui
npm run check
npm run sync
npm run build:windows
npm run build:android
```

`npm run sync` gera a UI e replica a mesma saída para `web/`, `desktop/www/` e `android/assets/www/`.

## Segurança

Não envie ao GitHub keystores, senhas, `service_role` do Supabase, tokens administrativos ou segredos comerciais. A chave privada Android não faz parte do código aberto.

## Licença

O código próprio está sob MIT. Consulte `THIRD_PARTY_NOTICES.md` para recursos e dependências de terceiros.
