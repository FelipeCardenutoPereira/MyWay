# Android v1.3.5

- Package DEV/CLEAN: `br.com.myway.open135`.
- A chave DEV local fica em `android/signing-dev/` e é ignorada pelo Git.
- O APK entregue foi montado com a UI v1.3.5 sincronizada e assinado com essa chave DEV.
- O projeto Gradle está configurado para compilar o mesmo packageId e usar essa chave DEV local quando nenhuma chave externa for fornecida.
- Para produção/Play Store, substitua pela sua chave definitiva via `MYWAY_KEYSTORE_*`.
