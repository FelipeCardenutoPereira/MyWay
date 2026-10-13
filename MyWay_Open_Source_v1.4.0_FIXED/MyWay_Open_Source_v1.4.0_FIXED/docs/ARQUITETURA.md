# Arquitetura aberta do MyWay 1.3.1

```text
src/
  index.shell.html              <- shell global editável
  index.html                    <- GERADO; não editar
  mvc/
    views/tabs/                 <- uma view HTML por aba
    controllers/tabs/           <- comportamento novo por aba
    controllers/control/        <- controllers compostos (ex.: aparência)
    models/                     <- regras/estado por domínio
    styles/                     <- CSS novo por domínio
  features/                     <- features isoladas ainda fora do MVC
  js/modules/                   <- compatibilidade/legado em migração
  styles/modules/               <- compatibilidade/legado em migração
  js/app.js                     <- GERADO
  styles/app.css                <- GERADO
  assets/
        |
        +-- npm run sync
              |-- web/
              |-- desktop/www/        <- embutido no .exe
              +-- android/assets/www/ <- carregado pelo APK

desktop/                       <- host Windows em Go
android/                       <- app Android em Java/Gradle
installer/                     <- instalador Windows em Go
tools/                         <- montagem das views, bundle, validação, sync e build
dev/editor.html                <- preview visual
```

## Regra de fonte única

A fonte da interface continua sendo `src/`, mas agora o HTML é editado em partes. `src/index.html` é somente a saída gerada para manter Windows e Android usando a mesma página final.

## MVC gradual

O MyWay tem código histórico grande. A v1.3.1 não moveu toda a lógica legada de uma vez porque isso aumentaria muito o risco de regressão. A migração é incremental:

- View nova/alterada: `mvc/views/tabs/`;
- Controller novo: `mvc/controllers/`;
- Model/regra compartilhada: `mvc/models/`;
- CSS novo: `mvc/styles/`.

O registro em `mvc/controllers/00-registry.js` monta controllers por aba quando a navegação abre cada view.

## Windows e Android

`npm run sync` gera o mesmo `index.html`, `app.js` e `app.css` para web, Windows e Android. Assim, a separação MVC existe no fonte sem introduzir `fetch()` de fragmentos em runtime, evitando incompatibilidade no WebView e no host local.
