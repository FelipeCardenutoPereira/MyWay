# v1.3.7

## v1.3.7 — Controle e Inspiração

- **Inicialização corrigida na raiz:** `99-bootstrap.js` agora é a última etapa do bundle; models, features e controllers são definidos antes do bootstrap. Cada etapa legada também é isolada para um erro não matar o restante da UI.
- **Atualização Windows sem backend velho:** ao encontrar MyWay antigo ocupando `127.0.0.1:43129`, a nova versão compara `appVersion`, encerra apenas o listener MyWay antigo e reassume a mesma origem antes de abrir a janela.
- **Hidratação sem apagar preferências/pins:** pins locais são mesclados com o estado nativo em vez de substituídos por `[]`; alterações recentes de aparência têm prioridade durante a hidratação.
- Wallpaper e Modo enxuto são reaplicados ao evento `myway:hydrated`, evitando regressão visual depois do clique.
- Modo enxuto agora usa binding delegado independente do wallpaper, persiste o estado e mostra Ativado/Desativado.
- Mural de Inspiração recupera pins locais de estados anteriores durante a hidratação e mantém um backup leve dos pins.
- A aba Salvos e os Quadros usam navegação delegada para não perder cliques após re-renderizações.
- Explorar mostra referências locais imediatamente e tenta a busca online em seguida; falha de rede não deixa mais o mural vazio.
- Em Para você, pins salvos permanecem visíveis junto das referências encontradas.


- Corrigido o bug real da v1.3.5 em que os controles de wallpaper podiam existir no HTML sem receber eventos de clique.
- Binding imediato + delegação de eventos + mount explícito da aba Controle.
- Botão selecionado mostra estado visual ATIVO/Selecionado.
- Novo controle Opacidade dos painéis (0–100%) para o wallpaper aparecer através das superfícies do app.
- Opacidade da cor continua independente e inicia em 0% quando não configurada.
- Windows e Android usam a mesma UI v1.3.7.
