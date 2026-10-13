# Correção de abertura do Windows · 1.2.2

A versão 1.2.2 remove o `http.FileServer` das rotas da interface e não emite redirecionamentos HTTP para `/`, `/app`, `/index.html`, CSS ou JavaScript.

O aplicativo abre em uma rota explícita `/app?v=1.2.2-open` e usa um perfil Edge separado (`EdgeProfile-open-1.2.2`) para evitar caches de redirecionamentos permanentes criados por builds anteriores.

Se uma janela antiga continuar aberta, feche-a antes de instalar. O instalador encerra `MyWay.exe` automaticamente e substitui o binário em `%LOCALAPPDATA%\Programs\MyWay`.
