# Login por código de e-mail — MyWay 1.2.5

Na tela **Entrar no MyWay**, o usuário pode continuar usando a senha da conta em nuvem ou selecionar **Entrar por código no e-mail**.

O fluxo de código/link:

1. usa o mesmo e-mail da conta MyWay/Supabase;
2. solicita um OTP/magic link com criação de usuário desativada;
3. aceita o código recebido ou o link completo;
4. anexa a sessão validada ao mesmo perfil e à mesma sincronização existente.

O PIN local de versões antigas não é a senha da conta em nuvem. Não armazene senhas no projeto, no GitHub ou em arquivos de configuração.
