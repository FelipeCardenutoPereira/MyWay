MyWay Android · código v1.2.3

A interface é sincronizada de ../src e usa a mesma base HTML/CSS/JavaScript do Windows.
VersionCode do projeto: 74 · versionName: 1.2.6.

Para gerar um APK de atualização compatível com uma instalação existente, use a mesma chave de assinatura usada nessa instalação. Sem a chave original, o Android trata o APK como outro assinante e pode exigir desinstalação.

Use `npm run build:android` na raiz ou o Gradle Wrapper desta pasta, com JDK 17 e Android SDK configurados.


MYWAY 1.3.0 - ASSINATURA E PACOTE CLEAN
-----------------------------------------
O applicationId padrão é br.com.myway.pessoal. Atualizações desse pacote exigem a mesma chave privada usada na instalação histórica.
Se essa chave não estiver disponível, use o pacote paralelo br.com.myway.openapp:
  npm run build:android:clean

Nunca publique .jks/.keystore no GitHub. O .gitignore já bloqueia esses arquivos.
