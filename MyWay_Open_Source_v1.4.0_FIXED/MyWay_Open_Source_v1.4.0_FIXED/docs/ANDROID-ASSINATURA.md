# Assinatura Android

O pacote histórico `br.com.myway.pessoal` só pode ser atualizado com a chave privada histórica correspondente ao certificado já instalado. O certificado público, sozinho, não permite assinar uma atualização.

Para desenvolvimento sem essa chave, o projeto suporta o pacote paralelo `br.com.myway.openapp`. Configure localmente:

```text
MYWAY_KEYSTORE_PATH=C:\\caminho\\myway-dev.jks
MYWAY_KEYSTORE_PASSWORD=...
MYWAY_KEY_ALIAS=...
MYWAY_KEY_PASSWORD=...
```

Depois execute:

```bash
npm run build:android:clean
```

Não faça commit de `.jks`, `.keystore`, senhas ou arquivos `.env`.
