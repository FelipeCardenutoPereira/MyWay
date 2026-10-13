# GitHub sem complicação

## Primeira publicação

1. Crie um repositório vazio no GitHub.
2. No Windows, abra PowerShell dentro da pasta do projeto.
3. Execute:

```powershell
.\PUBLICAR-NO-GITHUB.ps1 -RepoUrl "https://github.com/SEU-USUARIO/myway.git"
```

Ou use GitHub Desktop: **Add existing repository** e selecione esta pasta.

## O que entra no Git

Entra: HTML, CSS, JavaScript, Java, Go, scripts, documentação e configurações do VS Code/GitHub Actions.

Não entra: APK, EXE, ZIP, keystore, senhas e configurações privadas. Binários devem ser anexados a uma **GitHub Release**.

## Builds automáticos

- `quality.yml`: valida a interface a cada push/PR.
- `windows.yml`: gera EXE/Setup e publica como artifact.
- `android.yml`: gera APK de debug automaticamente; para release atualizável use os secrets de assinatura descritos no workflow.
