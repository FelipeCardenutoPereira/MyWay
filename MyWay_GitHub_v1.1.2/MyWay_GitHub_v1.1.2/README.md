# MyWay 1.1.2

Código-fonte do MyWay para Windows e Android. A 1.1.2 corrige o menu lateral em recolhimento automático, integra o Diário ao dock dos atalhos flutuantes e remove a recomendação específica de A Odisseia da área de inglês.

## Estrutura

- `web/` — interface canônica HTML/CSS/JavaScript.
- `android/` — projeto Android (SDK 35, minSdk 26).
- `windows/current-www/` — interface usada pelo aplicativo Windows.
- `windows/build/` — scripts de integração/empacotamento da base Windows.
- `windows/installer/` — fonte do instalador Windows por usuário (Go), sem chaves privadas nem binários embutidos no repositório.
- `supabase/` — SQL e templates de autenticação.
- `site/` — página de distribuição; coloque o APK final em `site/downloads/` somente na etapa de publicação.
- `scripts/sync-web.py` — sincroniza `web/` para Android e Windows.
- `docs/UX-1.1.md` — escopo da refatoração visual e funcional.

## Desenvolvimento rápido

1. Edite `web/index.html`, `web/app.css` e `web/app.js`.
2. Execute `python scripts/sync-web.py`.
3. Valide o JavaScript com `node --check web/app.js`.
4. Compile a plataforma desejada.

### Android

Requisitos: JDK 17, Android SDK 35 e conexão para resolver as dependências Gradle na primeira compilação.

```bash
cd android
./gradlew assembleDebug
```

Para uma release assinada, defina as variáveis de ambiente abaixo; nenhuma chave privada é versionada neste repositório:

- `MYWAY_KEYSTORE_PATH`
- `MYWAY_KEYSTORE_PASSWORD`
- `MYWAY_KEY_ALIAS`
- `MYWAY_KEY_PASSWORD`

Depois:

```bash
./gradlew assembleRelease
```

A configuração padrão do AdMob usa IDs oficiais de teste. Não publique uma release comercial com IDs de teste nem inclua credenciais privadas no repositório.

### Windows

A camada visual está completa em `windows/current-www/`. A construção nativa preserva a base Windows anterior porque o código-fonte Go original dessa base não estava disponível no material recuperado. O executável-base e chaves privadas não são versionados. Para reconstruir a base nativa, coloque o executável-base esperado pelos scripts e use Python + `pefile`. O instalador distribuído na 1.1.2 também possui fonte em `windows/installer/`; antes de compilá-lo, crie a pasta `payload/` ao lado de `main.go` com a saída Windows pronta e execute `GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-s -w -H=windowsgui"`.

## Nuvem

O cliente usa uma chave **publishable** do Supabase, que por definição fica no aplicativo cliente. Segurança real deve ficar em RLS/policies e funções do banco. Nunca coloque `service_role`, senha administrativa ou segredo de assinatura no front-end.

## Observações

O assistente interno desta versão é organizacional e usa regras locais inspiradas em princípios de TCC, priorização, intenção de implementação e redução de fricção. Ele não faz diagnóstico e não substitui acompanhamento profissional.

Os binários de fontes usados em builds anteriores não são distribuídos neste pacote de código; a interface mantém fallbacks de sistema (`Segoe UI`, `Georgia`, Arial e sans-serif).
