# Editar o MyWay no Visual Studio Code

## 1. Abra o workspace

Use `MyWay.code-workspace`. O Explorer mostra atalhos separados para HTML, módulos JavaScript e módulos CSS.

Arquivos principais:

```text
src/
├── index.html
├── js/
│   ├── modules/       <- EDITE AQUI
│   └── app.js         <- GERADO
└── styles/
    ├── modules/       <- EDITE AQUI
    └── app.css        <- GERADO
```

Os bundles gerados ficam ocultos no Explorer por padrão para você não cair em um arquivo de milhares de linhas por engano.

## 2. Mapa rápido dos módulos

JavaScript:
- `00-*` / `01-*` / `02-*`: estado, aparência, conta e utilitários.
- `10-*`: navegação e dashboard.
- `20-*` a `25-*`: finanças, áreas da vida, dados e renderização.
- `30-*`: produtividade e foco.
- `40-*`: notas e drag and drop.
- `50-*`: áreas de trabalho e mobile.
- `60-*`: aparência e assistente.
- `70-*`: sincronização e autenticação.
- `80-*`: widgets e resiliência.
- `90-*` em diante: release e melhorias recentes.
- `97-theme-contract.js`: contraste da cor do painel.
- `98-dashboard-layout.js`: drag and drop e largura dos quadros.
- `98-paged-dialogs.js`: paginação de formulários/pop-ups.

CSS:
- `00-legacy-*` a `65-legacy-*`: estilos históricos já separados em blocos menores.
- `90-theme-contract.css`: regras de contraste/tema.
- `91-dashboard-layout.css`: dashboard reorganizável.
- `92-paged-dialogs.css`: pop-ups em etapas.

## 3. Prévia visual

No VS Code: **Terminal → Run Task → MyWay: editor visual**.

Ou execute `ABRIR-EDITOR-VISUAL.bat`.

Ao salvar um módulo, o servidor refaz `app.js/app.css`. A prévia recarrega automaticamente.

## 4. Validar

Use a tarefa **MyWay: validar código** ou:

```bash
npm run check
```

## 5. Sincronizar Windows + Android

```bash
npm run sync
```

A pasta `src/` é a fonte visual única. O comando replica a interface para `desktop/www`, `android/assets/www` e `web`.

## 6. Gerar

Windows:

```bash
npm run build:windows
```

Android:

```bash
npm run build:android
```

O APK de produção exige Android SDK e sua chave de assinatura configurada no ambiente.
