/* v37 — short, resumable guides and optional sandbox practice. */
const LEARNING_GUIDES37=[
  {
    "id": "workspace",
    "view": "today",
    "title": "Minha área e as prioridades de hoje",
    "description": "Um painel menor, voltado à sua meta.",
    "steps": [
      {
        "title": "Comece com sua meta",
        "text": "No questionário, escolha a combinação que mais se aproxima da sua meta. O início fica com até três áreas e um campo de foco.",
        "target": "#workspaceHome38"
      },
      {
        "title": "Escolha o dia de hoje",
        "text": "Ao entrar, o app pergunta o que priorizar. Escolha até três áreas ou siga sua área habitual. A troca do dia não substitui seu perfil.",
        "target": "#workspaceToday38"
      },
      {
        "title": "Mude quando precisar",
        "text": "Trocar área permite escolher outra combinação ou ajustar as áreas dentro dela. Seus registros são mantidos.",
        "target": "#quickPersonalize35"
      },
      {
        "title": "Acesse o restante quando quiser",
        "text": "Ver todas as ferramentas abre o menu completo. Mais do painel revela os registros e os recursos adicionais do início; você pode recolher novamente.",
        "target": "#workspaceAll38"
      }
    ],
    "practice": "choice",
    "question": "Precisa focar em Finanças só hoje. O que usar?",
    "options": [
      "Mudar prioridade de hoje",
      "Apagar seus registros de Estudo"
    ],
    "answer": 0,
    "feedback": "A escolha do dia adapta o menu temporariamente, mantendo sua área habitual.",
    "master": false
  },
  {
    "id": "start",
    "view": "today",
    "title": "Comece por uma coisa",
    "description": "Uma rota curta para o primeiro dia.",
    "steps": [
      {
        "title": "Escolha um passo pequeno",
        "text": "No foco do dia, escreva uma ação que você consiga iniciar: “abrir o arquivo e escrever o título”. Não precisa planejar o dia inteiro.",
        "target": "#focusTask"
      },
      {
        "title": "Comece um bloco",
        "text": "Clique em Iniciar no timer. Pause quando precisar; retome pelo mesmo botão. O timer ajuda a começar, sem exigir uma sequência perfeita.",
        "target": "#timerStart"
      },
      {
        "title": "Guarde a distração",
        "text": "Surgiu outra ideia? Capture uma nota curta para voltar depois, sem precisar resolver agora. Em Como usar, o guia de Notas mostra o caminho. Então retorne ao primeiro passo.",
        "target": "[data-view-target=notes]"
      },
      {
        "title": "Siga as prioridades de hoje",
        "text": "Os cartões do início abrem suas áreas prioritárias. Mudar prioridade de hoje adapta só este dia; Trocar área muda seu perfil habitual.",
        "target": "#workspaceHome38"
      }
    ],
    "practice": "choice",
    "question": "Qual tarefa é mais fácil de começar?",
    "options": [
      "Organizar minha vida inteira",
      "Abrir o documento e escrever o título",
      "Terminar tudo hoje"
    ],
    "answer": 1,
    "feedback": "Uma ação observável e pequena dá um ponto de partida claro.",
    "master": false
  },
  {
    "id": "focus",
    "view": "today",
    "title": "Modo foco por uma hora",
    "description": "Reduza o painel a uma prioridade.",
    "steps": [
      {
        "title": "Escolha a prioridade",
        "text": "Modo foco fica no topo. Escolha Trabalho, Estudos ou outra prioridade e escreva o primeiro passo.",
        "target": "#focusMode36"
      },
      {
        "title": "Veja o que muda",
        "text": "Ao começar, o painel e o menu se limitam à prioridade escolhida. O tempo restante aparece no topo; Controle e backup continuam acessíveis.",
        "target": "#focusMode36"
      },
      {
        "title": "Saia quando precisar",
        "text": "Clique novamente em Modo foco para continuar, trocar a prioridade ou voltar ao normal. Você não precisa esperar a hora acabar.",
        "target": "#focusMode36"
      },
      {
        "title": "Decida ao terminar",
        "text": "Depois de uma hora, o app pergunta se quer voltar ao painel normal ou continuar. Uma pausa também é uma escolha válida.",
        "target": "#xpTop36"
      }
    ],
    "practice": "choice",
    "question": "Precisa de outra prioridade antes da hora terminar?",
    "options": [
      "Use Modo foco no topo para trocar ou encerrar",
      "Espere obrigatoriamente uma hora"
    ],
    "answer": 0,
    "feedback": "O botão do topo mantém a escolha com você.",
    "master": false
  },
  {
    "id": "timer",
    "view": "today",
    "title": "Timer e retorno à tarefa",
    "description": "Comece, pause e volte sem cobrança.",
    "steps": [
      {
        "title": "Defina o próximo gesto",
        "text": "Escreva uma ação concreta no foco do dia. Uma ação pequena costuma ser mais simples de retomar que um objetivo amplo.",
        "target": "#focusTask"
      },
      {
        "title": "Inicie e pause",
        "text": "Iniciar começa o bloco; Pausar interrompe a contagem. Volte quando estiver pronto.",
        "target": "#timerStart"
      },
      {
        "title": "Recomece com intenção",
        "text": "Resetar devolve o timer ao início. Use quando quiser um novo bloco, sem precisar apagar o que já fez.",
        "target": "#timerReset"
      },
      {
        "title": "Reconheça o retorno",
        "text": "O contador de retornos registra quando você percebe uma distração e volta. É feedback do dia, não uma nota sobre você.",
        "target": "#returnPlus"
      }
    ],
    "practice": "choice",
    "question": "Você se distraiu. Qual próximo passo ajuda a retomar?",
    "options": [
      "Recomeçar uma ação pequena e reconhecer o retorno",
      "Descartar todo o trabalho feito"
    ],
    "answer": 0,
    "feedback": "Retomar também faz parte do processo.",
    "master": false
  },
  {
    "id": "work",
    "view": "work",
    "title": "Trabalho e Kanban",
    "description": "Tire uma tarefa da cabeça e mova-a por etapas.",
    "steps": [
      {
        "title": "Crie uma atividade",
        "text": "Use + atividade ou o + de A Fazer. Dê um título concreto e, se ajudar, acrescente prazo e projeto.",
        "target": "#workAddCard35"
      },
      {
        "title": "Mova pelo puxador",
        "text": "Segure o ícone ⠿ do cartão e arraste até Fazendo. Solte dentro da coluna. O campo de status do cartão também muda a etapa sem arrastar.",
        "target": "#workKanbanBoard35"
      },
      {
        "title": "Reduza o que aparece",
        "text": "Use busca e filtro de projeto para olhar só o que importa agora. Limpe o filtro para encontrar cartões que sumiram da lista.",
        "target": "#workKanbanSearch35"
      },
      {
        "title": "Conclua e reveja",
        "text": "Mova a atividade para Feito quando terminar. Os relatórios de trabalho ajudam a rever o dia ou o mês, sem cadastrar a tarefa de novo.",
        "target": "#workReportDay"
      }
    ],
    "practice": "kanban",
    "question": "",
    "options": [],
    "answer": 0,
    "feedback": "",
    "master": false
  },
  {
    "id": "workreport",
    "view": "work",
    "title": "Relatório e banco de horas",
    "description": "Revise entregas e compensações.",
    "steps": [
      {
        "title": "Escolha o período",
        "text": "Veja as atividades de hoje, da semana e do mês. Prazos e status vêm das notas de Trabalho.",
        "target": "#workReportDay"
      },
      {
        "title": "Confira antes de exportar",
        "text": "Revise títulos, datas e o que realmente está feito. Ajuste no cartão se houver informação desatualizada.",
        "target": "#workReportMonth"
      },
      {
        "title": "Registre compensações",
        "text": "O banco de horas acompanha os valores que você informar. Insira a recuperação no campo e confirme para registrar.",
        "target": "#bankRecoveryInput"
      },
      {
        "title": "Gere sua cópia",
        "text": "Baixe o relatório para conferir e guardar. Compartilhar só deve ser usado quando você decidir enviar o material.",
        "target": "#workReportDownload"
      }
    ],
    "practice": "choice",
    "question": "O relatório parece incompleto. O que conferir primeiro?",
    "options": [
      "Datas e status dos cartões de Trabalho",
      "Criar cópias de todas as atividades"
    ],
    "answer": 0,
    "feedback": "Os registros da ferramenta alimentam o relatório.",
    "master": false
  },
  {
    "id": "notes",
    "view": "notes",
    "title": "Notas, formato e imagens",
    "description": "Escreva, organize e personalize uma nota.",
    "steps": [
      {
        "title": "Capture uma nota",
        "text": "Escolha a área e o status, escreva um título e o texto, então adicione. Uma frase já é suficiente para começar.",
        "target": "#noteTitle"
      },
      {
        "title": "Formate quando ajudar",
        "text": "Depois de salvar, use Formatar / imagens no cartão. Selecione o trecho para negrito ou itálico; escolha fonte, tamanho e cor no editor.",
        "target": "[data-rich-note36]"
      },
      {
        "title": "Inclua imagens",
        "text": "No editor, adicione até quatro imagens. Legendas e cores ajudam a reconhecer cada uma; clique na miniatura da nota para ampliar.",
        "target": "[data-rich-note36]"
      },
      {
        "title": "Organize sem retrabalho",
        "text": "Arraste pelo ⠿ ou use o status. Cores das legendas personaliza os estados. Abrir Notes abre a janela de notas do aplicativo.",
        "target": "#openNotesWidget"
      }
    ],
    "practice": "note",
    "question": "",
    "options": [],
    "answer": 0,
    "feedback": "",
    "master": false
  },
  {
    "id": "study",
    "view": "puc",
    "title": "Estudos: curso e próxima tarefa",
    "description": "Monte uma trilha que caiba no seu dia.",
    "steps": [
      {
        "title": "Adicione um curso",
        "text": "Cadastre um curso ou matéria que você está estudando. O nome da instituição pode ser alterado em Controle.",
        "target": "#educationAddCourse"
      },
      {
        "title": "Quebre em etapas",
        "text": "Adicione uma tarefa à trilha: por exemplo, “ler duas páginas”. Marque como concluída depois de executar; o progresso se atualiza.",
        "target": "#pucTrackAddTask"
      },
      {
        "title": "Estude em um bloco",
        "text": "Use Pomodoro para um trecho da tarefa. Flash cards ajudam na revisão e vídeos podem ficar reunidos nesta tela.",
        "target": "#studyPomodoroStart"
      },
      {
        "title": "Registre o que fez",
        "text": "Informe minutos, descrição e aulas quando houver. Registrar a sessão torna visível o estudo realizado.",
        "target": "#logStudySession"
      }
    ],
    "practice": "choice",
    "question": "Qual etapa deixa o estudo mais claro?",
    "options": [
      "Estudar tudo",
      "Ler duas páginas e anotar uma dúvida",
      "Nunca fazer pausas"
    ],
    "answer": 1,
    "feedback": "Um trecho concreto permite começar e reconhecer quando terminou.",
    "master": false
  },
  {
    "id": "pomodoro",
    "view": "puc",
    "title": "Pomodoro de estudos",
    "description": "Proteja um bloco de estudo e sua pausa.",
    "steps": [
      {
        "title": "Escreva a tarefa",
        "text": "Use o campo do Pomodoro para indicar o trecho que vai estudar. Deixe os materiais necessários à mão.",
        "target": "#studyPomodoroTask"
      },
      {
        "title": "Inicie o bloco",
        "text": "Clique em Iniciar para contar o período. Trabalhe em uma tarefa durante esse bloco.",
        "target": "#studyPomodoroStart"
      },
      {
        "title": "Pause se precisar",
        "text": "Pausar interrompe o relógio. Resetar inicia uma nova contagem; uma interrupção não apaga o que foi aprendido.",
        "target": "#studyPomodoroPause"
      },
      {
        "title": "Revise e descanse",
        "text": "Ao encerrar, registre sua sessão e escolha uma pausa. Ajuste a próxima tarefa ao tempo e à energia disponíveis.",
        "target": "#logStudySession"
      }
    ],
    "practice": "choice",
    "question": "Uma interrupção aconteceu no bloco. Como seguir?",
    "options": [
      "Pausar, depois retomar ou iniciar outro bloco",
      "Considerar todo o estudo perdido"
    ],
    "answer": 0,
    "feedback": "O timer organiza o tempo; ele não julga a sessão.",
    "master": false
  },
  {
    "id": "flashcards",
    "view": "puc",
    "title": "Flash cards e vídeos",
    "description": "Revise ativamente e reúna materiais.",
    "steps": [
      {
        "title": "Crie uma pergunta",
        "text": "Em + flash card, coloque uma pergunta curta e uma resposta verificável. Um conceito por cartão facilita a revisão.",
        "target": "#flashcardAdd"
      },
      {
        "title": "Tente lembrar antes",
        "text": "Leia a pergunta e tente responder. Só depois use Revelar para comparar com a resposta salva.",
        "target": "#flashcardReveal"
      },
      {
        "title": "Avalie a lembrança",
        "text": "Use Rever quando ainda precisar praticar e Sei quando conseguiu lembrar. É uma autoavaliação, não um exame.",
        "target": "#flashcardAgain"
      },
      {
        "title": "Guarde um vídeo de apoio",
        "text": "Adicione o link e um título ao material de estudo. Links de vídeo precisam de internet e disponibilidade do provedor.",
        "target": "#studyYoutubeAdd"
      }
    ],
    "practice": "flashcard",
    "question": "",
    "options": [],
    "answer": 0,
    "feedback": "",
    "master": false
  },
  {
    "id": "habits",
    "view": "habits",
    "title": "Hábitos do dia",
    "description": "Registre uma pequena ação de cada vez.",
    "steps": [
      {
        "title": "Confira a data",
        "text": "A data ativa no topo define o dia exibido. Use Hoje para voltar ao dia atual antes de registrar.",
        "target": "#activeDate"
      },
      {
        "title": "Registre o que aconteceu",
        "text": "Use os controles de água, caminhada ou meditação. Os registros descrevem o que você fez; não é preciso preencher tudo.",
        "target": "#addWalkMinutes"
      },
      {
        "title": "Acompanhe a leitura",
        "text": "Escolha um livro antes de informar páginas. O total do livro ajuda a mostrar o progresso. Há um guia específico de leitura nesta central.",
        "target": "#habitBookSelect"
      },
      {
        "title": "Observe a semana",
        "text": "Compare os registros para decidir um próximo passo possível. Dias vazios não precisam ser preenchidos com resultados inventados.",
        "target": "#toggleMeditated"
      }
    ],
    "practice": "habit",
    "question": "",
    "options": [],
    "answer": 0,
    "feedback": "",
    "master": false
  },
  {
    "id": "reading",
    "view": "habits",
    "title": "Livro e páginas lidas",
    "description": "Escolha o livro e atualize seu avanço.",
    "steps": [
      {
        "title": "Cadastre seu livro",
        "text": "Se o livro ainda não estiver na lista, adicione-o em Cultura. Volte a Hábitos e escolha no campo de livro.",
        "target": "#habitBookSelect"
      },
      {
        "title": "Informe a leitura",
        "text": "Preencha páginas lidas e o total do livro conforme os rótulos. Confira os valores antes de registrar.",
        "target": "#pagesReadInput"
      },
      {
        "title": "Confirme o registro",
        "text": "Clique em Registrar leitura para salvar no dia ativo. Confira o progresso exibido antes de inserir um novo registro.",
        "target": "#registerReading"
      },
      {
        "title": "Troque quando quiser",
        "text": "Use a lista para escolher outro livro. Se não encontrar um, confira o cadastro em Metas e a seleção atual.",
        "target": "#habitBookSelect"
      }
    ],
    "practice": "choice",
    "question": "O livro não aparece na lista. Onde começar?",
    "options": [
      "Conferir ou adicionar o livro em Cultura",
      "Registrar páginas de outro livro"
    ],
    "answer": 0,
    "feedback": "A seleção de Hábitos usa os livros cadastrados em Cultura.",
    "master": false
  },
  {
    "id": "routine",
    "view": "habits",
    "title": "Rotinas e horários",
    "description": "Crie um lembrete que explique o próximo passo.",
    "steps": [
      {
        "title": "Escreva uma ação",
        "text": "No título da rotina, diga o que fazer: “separar o material de estudo” é mais claro que “organizar”.",
        "target": "#routineTitle"
      },
      {
        "title": "Defina quando",
        "text": "Escolha horário, datas e tipo de repetição. Confira o intervalo de datas para que a rotina apareça quando você espera.",
        "target": "#routineTime"
      },
      {
        "title": "Salve e confira",
        "text": "Adicione a rotina e observe a próxima ocorrência. Edite ou remova as rotinas que não fazem mais sentido.",
        "target": "#addRoutine"
      },
      {
        "title": "Teste o aviso",
        "text": "Ative notificações apenas se quiser e use o teste. Avisos do Windows dependem das permissões e de o app continuar aberto na bandeja.",
        "target": "#testWindowsNotification"
      }
    ],
    "practice": "choice",
    "question": "Qual lembrete comunica uma ação?",
    "options": [
      "Separar o caderno às 19h",
      "Fazer melhor"
    ],
    "answer": 0,
    "feedback": "Uma ação e um horário ajudam a reconhecer o que vem a seguir.",
    "master": false
  },
  {
    "id": "resilience",
    "view": "resilience",
    "title": "Resiliência e cuidado",
    "description": "Escolha um tema e reconheça uma próxima escolha.",
    "steps": [
      {
        "title": "Escolha o que cuidar",
        "text": "Use Adicionar temas / outros vícios para buscar cassino, substâncias ou hábitos. Pode incluir um tema próprio. Marcar não faz diagnóstico.",
        "target": "#resilienceGoals34"
      },
      {
        "title": "Faça um check-in",
        "text": "Informe como se sente, o tema, a data e o resultado. Se não conseguiu desta vez, registre isso também: você mantém o progresso.",
        "target": "#resilienceOutcome34"
      },
      {
        "title": "Prepare uma alternativa",
        "text": "Registre o gatilho e uma estratégia que caiba na situação. Use Identificar gatilhos para mapear uma sequência de comportamentos.",
        "target": "#resilienceStrategy34"
      },
      {
        "title": "Leia o feedback com contexto",
        "text": "XP reconhece ações registradas. Reservatório de Dopamina é uma metáfora de progresso, não mede dopamina. Som de dificuldade é opcional.",
        "target": "#failureSound36"
      }
    ],
    "practice": "choice",
    "question": "Não conseguiu mudar o comportamento hoje. O que ajuda?",
    "options": [
      "Registrar o contexto e preparar uma alternativa",
      "Apagar todo o progresso"
    ],
    "answer": 0,
    "feedback": "Um registro honesto pode orientar sua próxima escolha.",
    "master": false
  },
  {
    "id": "triggers",
    "view": "resilience",
    "title": "Identificar gatilhos",
    "description": "Encontre um ponto para interromper uma sequência.",
    "steps": [
      {
        "title": "Abra o mapa",
        "text": "Clique em Criar mapa de gatilhos. Você pode registrar, por exemplo, beber → fumar maconha → gastar dinheiro.",
        "target": "#triggerAdd36"
      },
      {
        "title": "Descreva o contexto",
        "text": "Preencha a situação inicial e os comportamentos na ordem em que percebeu. A sequência é uma observação pessoal, não uma prova de causa.",
        "target": "#triggerAdd36"
      },
      {
        "title": "Dê nome ao impacto",
        "text": "Informe a consequência e, se houver, o custo financeiro. Isso ajuda a comparar o comportamento com o que quer proteger.",
        "target": "#triggerAdd36"
      },
      {
        "title": "Escolha um ponto de mudança",
        "text": "Escreva uma alternativa e um apoio possível. Salve o mapa e revise quando perceber um novo padrão.",
        "target": "#triggerList36"
      }
    ],
    "practice": "trigger",
    "question": "",
    "options": [],
    "answer": 0,
    "feedback": "",
    "master": false
  },
  {
    "id": "games",
    "view": "games",
    "title": "Jogos de lógica, memória e atenção",
    "description": "Escolha um desafio sem cobrança de velocidade.",
    "steps": [
      {
        "title": "Escolha um jogo",
        "text": "Os quatro cartões oferecem lógica, memória, atenção e resiliência. Escolha pelo tipo de treino que quer experimentar.",
        "target": ".games-catalog35"
      },
      {
        "title": "Leia uma instrução",
        "text": "Lógica pede a regra da sequência; memória pede repetir os símbolos; atenção pede encontrar os alvos; resiliência pede escolher uma alternativa.",
        "target": ".games-catalog35"
      },
      {
        "title": "Tente no seu ritmo",
        "text": "Leia o feedback e tente de novo quando necessário. Memória permite rever a sequência. Sair encerra a rodada sem obrigação de concluir.",
        "target": ".games-catalog35"
      },
      {
        "title": "Veja o histórico",
        "text": "Desafios concluídos ficam no histórico. XP é limitado por jogo e data; os jogos não medem QI nem diagnosticam TDAH.",
        "target": "#gamesXP35"
      }
    ],
    "practice": "choice",
    "question": "Qual número continua a sequência 2, 4, 6…?",
    "options": [
      "7",
      "8",
      "12"
    ],
    "answer": 1,
    "feedback": "A regra deste exemplo é somar 2 a cada número. No jogo, o feedback explica cada sequência.",
    "master": false
  },
  {
    "id": "wellness",
    "view": "meditation",
    "title": "Bem-estar e práticas guiadas",
    "description": "Experimente uma pausa com áudio opcional.",
    "steps": [
      {
        "title": "Escolha a prática",
        "text": "Para perfis gerais, esta tela oferece respiração, jogo dos sentidos e pausa diante da vontade, além de práticas pessoais.",
        "target": "#wellnessGeneric"
      },
      {
        "title": "Use uma etapa por vez",
        "text": "Abra uma prática e siga a instrução atual. Avance no seu ritmo; você pode interromper a qualquer momento.",
        "target": ".guided-card36"
      },
      {
        "title": "Escolha o áudio",
        "text": "Ruído branco e narração são opcionais. Desative se incomodar; não é necessário áudio para acompanhar o exercício.",
        "target": ".guided-card36"
      },
      {
        "title": "Monte uma rotina própria",
        "text": "Adicione uma prática, escolha o tipo e a duração e marque quando fizer. As práticas são opcionais.",
        "target": "#wellnessAddPractice"
      }
    ],
    "practice": "choice",
    "question": "O áudio incomodou. Como continuar?",
    "options": [
      "Desligar o áudio e acompanhar pelo texto",
      "Aumentar o volume para terminar"
    ],
    "answer": 0,
    "feedback": "A prática pode seguir em silêncio, no seu ritmo.",
    "master": false
  },

  {
    "id": "gym",
    "view": "gym",
    "title": "Movimento e treino",
    "description": "Planeje uma atividade realista.",
    "steps": [
      {
        "title": "Crie um plano",
        "text": "Adicione uma atividade com data e duração. Escolha algo compatível com sua rotina, sem tentar preencher todos os dias.",
        "target": "#gymAddPlan34"
      },
      {
        "title": "Registre energia e observações",
        "text": "Informe como se sentiu e uma nota útil sobre a sessão. O registro ajuda a ajustar o próximo plano.",
        "target": "#gymEnergy34"
      },
      {
        "title": "Use as dicas",
        "text": "Veja a próxima dica e adapte ao que consegue fazer hoje. O app organiza a rotina; não prescreve treino individual.",
        "target": "#gymNextTip34"
      },
      {
        "title": "Revise o plano",
        "text": "Ajuste as configurações e próximas sessões conforme sua disponibilidade. Você pode recomeçar com uma atividade pequena.",
        "target": "#gymSettings34"
      }
    ],
    "practice": "choice",
    "question": "Qual plano deixa um começo claro?",
    "options": [
      "Caminhar 10 minutos depois do almoço",
      "Mudar toda a rotina de uma vez"
    ],
    "answer": 0,
    "feedback": "Uma atividade delimitada facilita decidir quando iniciar.",
    "master": false
  },
  {
    "id": "rewards",
    "view": "rewards",
    "title": "XP, níveis e recompensas",
    "description": "Reconheça ações sem exigir perfeição.",
    "steps": [
      {
        "title": "Acompanhe no topo",
        "text": "O nível e o total de XP aparecem no topo. No início os níveis são mais fáceis; o esforço adicional cresce gradualmente.",
        "target": "#xpTop36"
      },
      {
        "title": "Entenda o histórico",
        "text": "Confira quais ações foram reconhecidas. Repetir o mesmo registro não gera XP sem limite e uma dificuldade não remove XP anterior.",
        "target": "#rewardHistory34"
      },
      {
        "title": "Escolha uma recompensa",
        "text": "Use o catálogo para consultar ou personalizar recompensas. Prefira algo coerente com o que quer cuidar.",
        "target": "#rewardCatalog34"
      },
      {
        "title": "Ajuste o feedback",
        "text": "Configure as animações e o feedback conforme sua preferência. Seu objetivo pode ser continuar uma ação útil, sem perseguir todos os pontos.",
        "target": "#rewardFeedback34"
      }
    ],
    "practice": "choice",
    "question": "Para que serve o XP?",
    "options": [
      "Dar visibilidade às ações registradas",
      "Medir seu valor pessoal"
    ],
    "answer": 0,
    "feedback": "O XP é um feedback do aplicativo, não uma medida sobre você.",
    "master": false
  },
  {
    "id": "finance",
    "view": "finance",
    "title": "Finanças do dia",
    "description": "Registre um movimento e veja seu contexto.",
    "steps": [
      {
        "title": "Escolha entrada ou saída",
        "text": "Selecione o tipo, valor, categoria e data. Um lançamento por vez evita duplicar os valores.",
        "target": "#financeTxnType"
      },
      {
        "title": "Adicione e confira",
        "text": "Salve o lançamento e confira o total. Uma descrição curta ajuda a reconhecer depois o que aconteceu.",
        "target": "#financeTxnAdd"
      },
      {
        "title": "Separe recorrências e dívidas",
        "text": "Cadastre gastos fixos e dívidas nas áreas próprias. Antes de inserir de novo, confira se o valor já está representado no período.",
        "target": "#financeFixedAdd"
      },
      {
        "title": "Use pausa e simulação",
        "text": "Se a compra for por impulso, abra a pausa antes de decidir. Simulações são estimativas com os valores informados, não ofertas nem recomendação de investimento.",
        "target": "#financeImpulse34"
      }
    ],
    "practice": "finance",
    "question": "",
    "options": [],
    "answer": 0,
    "feedback": "",
    "master": false
  },
  {
    "id": "goals",
    "view": "culture",
    "title": "Cultura: filmes, séries, livros e jogos",
    "description": "Guarde o que quer aproveitar no seu tempo livre.",
    "steps": [
      {
        "title": "Escolha uma categoria",
        "text": "Adicione um filme, série, livro ou jogo. Um título de cada vez é suficiente. Seu planejamento da casa fica na área Casa.",
        "target": "#addFilm38"
      },
      {
        "title": "Dê nome à escolha",
        "text": "Edite o título para reconhecer o que quer assistir, ler ou jogar. Os livros e jogos já cadastrados continuam aqui.",
        "target": "#booksList"
      },
      {
        "title": "Atualize o status",
        "text": "Use Quero assistir, Assistindo ou Concluído para filmes e séries. Livros usam páginas; jogos podem ter um percentual informado por você.",
        "target": "#filmsList38"
      },
      {
        "title": "Aproveite no seu ritmo",
        "text": "Você pode ajustar sua janela de lazer na opção ao final da tela. A lista organiza preferências; não precisa virar uma cobrança.",
        "target": ".culture-screen38"
      }
    ],
    "practice": "choice",
    "question": "Qual escolha dá um começo claro ao seu tempo de lazer?",
    "options": [
      "Escolher um filme da minha lista",
      "Transformar toda a coleção em obrigação"
    ],
    "answer": 0,
    "feedback": "A coleção ajuda a escolher; você não precisa terminar tudo.",
    "master": false
  },
  {
    "id": "housing",
    "view": "future",
    "title": "Imóveis e planejamento",
    "description": "Compare metas com os dados que você informar.",
    "steps": [
      {
        "title": "Cadastre uma referência",
        "text": "Cole o link do imóvel e use importar quando quiser. Confira os dados importados; páginas externas podem não disponibilizar todos os valores.",
        "target": "#propertyUrl"
      },
      {
        "title": "Confira preço e reserva",
        "text": "Atualize preço, reserva e valores de entrada na área de planejamento. Valores ausentes limitam a simulação.",
        "target": "#view-future"
      },
      {
        "title": "Registre aportes",
        "text": "Insira um aporte realizado e confirme. O aplicativo acompanha os registros informados, sem movimentar dinheiro.",
        "target": "#contributionInput"
      },
      {
        "title": "Leia as estimativas",
        "text": "Prazos e marcos usam as hipóteses cadastradas. Reveja taxas e custos antes de usar uma simulação em uma decisão real.",
        "target": "#propertyGame"
      }
    ],
    "practice": "choice",
    "question": "O prazo simulado mudou. O que conferir?",
    "options": [
      "Preço, reserva, aporte e hipóteses informados",
      "Assumir que a simulação é uma proposta bancária"
    ],
    "answer": 0,
    "feedback": "Estimativas dependem dos valores usados no cálculo.",
    "master": false
  },
  {
    "id": "relationship",
    "view": "relationships",
    "title": "Relacionamentos e memórias",
    "description": "Reúna planos, ideias e datas.",
    "steps": [
      {
        "title": "Registre um plano",
        "text": "Adicione uma tarefa ou plano conjunto com uma descrição simples. Nos perfis gerais, os rótulos são de relacionamento.",
        "target": "#relationshipsAddWeddingPlan"
      },
      {
        "title": "Guarde uma ideia",
        "text": "Escolha o tipo e escreva a ideia para voltar depois. Ela não precisa virar tarefa imediatamente.",
        "target": "#relationshipsAddIdea"
      },
      {
        "title": "Planeje uma viagem",
        "text": "Informe destino, data e uma nota. Os dados organizam o plano; não são uma reserva de passagem ou hospedagem.",
        "target": "#relationshipsAddTrip"
      },
      {
        "title": "Inclua memórias",
        "text": "Selecione fotos quando quiser. Arquivos privados têm uma área própria; use o guia do cofre antes de configurar.",
        "target": "#relationshipsPhotoFiles"
      }
    ],
    "practice": "choice",
    "question": "Uma ideia ainda não tem data. Onde guardá-la?",
    "options": [
      "Na lista de ideias, para revisar depois",
      "Inventar um prazo obrigatório"
    ],
    "answer": 0,
    "feedback": "Uma ideia pode ser guardada sem compromisso imediato.",
    "master": false
  },
  {
    "id": "vault",
    "view": "relationships",
    "title": "Cofre de arquivos",
    "description": "Conheça os controles antes de inserir conteúdo.",
    "steps": [
      {
        "title": "Entenda a área",
        "text": "O cofre organiza arquivos privados e tem bloqueio próprio. Este guia não pede nem registra sua senha ou PIN.",
        "target": "#relationshipsVaultCreate"
      },
      {
        "title": "Configure conscientemente",
        "text": "Para criar o cofre, preencha e confirme o PIN nos campos da ferramenta. Guarde uma referência segura por sua conta.",
        "target": "#relationshipsVaultCreate"
      },
      {
        "title": "Abra e bloqueie",
        "text": "Use Desbloquear para acessar e Bloquear quando terminar. Evite deixar o cofre aberto em um computador compartilhado.",
        "target": "#relationshipsVaultUnlockBtn"
      },
      {
        "title": "Confira a transferência",
        "text": "Arquivos externos podem exigir cópia separada ao trocar de PC. Confira o backup e os arquivos antes de remover a instalação anterior.",
        "target": "#relationshipsVaultLock"
      }
    ],
    "practice": "choice",
    "question": "O tutorial precisa receber seu PIN?",
    "options": [
      "Não; configure só nos campos do cofre",
      "Sim; escreva no exercício de exemplo"
    ],
    "answer": 0,
    "feedback": "Os exercícios não solicitam credenciais ou segredos.",
    "master": false
  },
  {
    "id": "english",
    "view": "english",
    "title": "Inglês em uma rodada curta",
    "description": "Responda, compare e avalie a prática.",
    "steps": [
      {
        "title": "Escolha um nível",
        "text": "Selecione o nível que quer experimentar. Pode mudar depois; é uma escolha de exercício, não um diagnóstico de proficiência.",
        "target": ".english-levels"
      },
      {
        "title": "Abra um exercício",
        "text": "Clique em Novo exercício e leia a instrução. Digite uma tentativa no campo de resposta.",
        "target": "#newEnglishExercise"
      },
      {
        "title": "Ouça e compare",
        "text": "Ouvir usa a voz disponível no dispositivo. Ver resposta revela o modelo para você comparar com sua tentativa.",
        "target": "#showEnglishAnswer"
      },
      {
        "title": "Avalie sua rodada",
        "text": "Use a autoavaliação após comparar. O histórico registra sua prática; reveja o que ainda estiver difícil.",
        "target": "[data-english-score]"
      }
    ],
    "practice": "choice",
    "question": "Qual tradução combina com “book”?",
    "options": [
      "Livro",
      "Janela",
      "Relógio"
    ],
    "answer": 0,
    "feedback": "Book significa livro. No exercício real, a resposta-modelo ajuda a comparar.",
    "master": false
  },
  {
    "id": "journal",
    "view": "journal",
    "title": "Diário e reflexão",
    "description": "Escreva sem precisar transformar tudo em tarefa.",
    "steps": [
      {
        "title": "Comece com uma frase",
        "text": "Escolha humor e energia se quiser, e escreva o que está acontecendo. O registro não precisa ser longo.",
        "target": "#journalText"
      },
      {
        "title": "Salve e encontre depois",
        "text": "Adicione etiquetas que ajudem você a reconhecer o tema. Salve para reunir o registro na lista do diário.",
        "target": "#journalSave"
      },
      {
        "title": "Separe situação e pensamento",
        "text": "Na reflexão, descreva o que ocorreu, o pensamento e a emoção. Evidências e alternativa ajudam a explorar outra leitura da situação.",
        "target": "#cbtSituation"
      },
      {
        "title": "Escolha uma ação possível",
        "text": "Registre um próximo passo. Se precisar, a área de cuidado oferece caminhos de apoio; a ferramenta não substitui atendimento.",
        "target": "#cbtAction"
      }
    ],
    "practice": "choice",
    "question": "Qual frase descreve uma situação observável?",
    "options": [
      "Recebi uma mensagem sem resposta ainda",
      "Ninguém nunca vai se importar"
    ],
    "answer": 0,
    "feedback": "Separar o fato da interpretação dá mais espaço para refletir.",
    "master": false
  },
  {
    "id": "inspiration",
    "view": "inspiration",
    "title": "Inspiração e murais",
    "description": "Guarde referências que você consiga reencontrar.",
    "steps": [
      {
        "title": "Adicione uma referência",
        "text": "Use adicionar pin para preencher título, fonte, imagem ou arquivo. Escolha um mural para reunir um tema.",
        "target": "#inspirationAddPin"
      },
      {
        "title": "Organize por tema",
        "text": "Crie um mural para uma categoria útil. As referências podem ficar salvas sem precisar entrar na sua lista de tarefas.",
        "target": "#inspirationNewBoard"
      },
      {
        "title": "Pesquise quando quiser",
        "text": "A busca e integrações externas dependem de internet e disponibilidade do serviço. Você também pode adicionar uma imagem local.",
        "target": "#inspirationSearchInput"
      },
      {
        "title": "Ajuste seus interesses",
        "text": "Edite interesses para orientar o conteúdo. Escolha o que aparece no painel e revise referências que já não ajudam.",
        "target": "#inspirationEditInterests"
      }
    ],
    "practice": "choice",
    "question": "Quer reunir referências de um projeto. O que usar?",
    "options": [
      "Um mural com um nome reconhecível",
      "Várias notas sem título repetidas"
    ],
    "answer": 0,
    "feedback": "Agrupar por tema facilita reencontrar o material.",
    "master": false
  },
  {
    "id": "channel",
    "view": "channel",
    "title": "Canal e conteúdo",
    "description": "Leve uma ideia até a próxima etapa de produção.",
    "steps": [
      {
        "title": "Capture uma ideia",
        "text": "Use adicionar ideia ou o formulário de conteúdo. Dê um título provisório e escolha um pilar do canal.",
        "target": "#channelAddIdea34"
      },
      {
        "title": "Defina a etapa",
        "text": "Escolha status e data quando houver, escreva notas e anexe roteiro ou thumbnail. PNG mantém a transparência.",
        "target": "#nvAddContent"
      },
      {
        "title": "Reúna aprendizados",
        "text": "Use insights e pesquisa para registrar referências. Recursos online precisam de internet; a chave de API só é necessária se optar por esse recurso.",
        "target": "#nvInsightAdd"
      },
      {
        "title": "Revise resultados",
        "text": "Atualize métricas ou importe analytics quando disponível. Confira o período antes de comparar números.",
        "target": "#nvAnalyticsImport"
      }
    ],
    "practice": "choice",
    "question": "A ideia ainda não está produzida. Qual status faz sentido?",
    "options": [
      "Uma etapa inicial de ideia ou planejamento",
      "Publicada sem ter publicado"
    ],
    "answer": 0,
    "feedback": "O status deve representar a etapa real do conteúdo.",
    "master": false
  },
  {
    "id": "branding",
    "view": "channel",
    "title": "Identidade do canal e PNG",
    "description": "Personalize sem perder transparência.",
    "steps": [
      {
        "title": "Confira a identidade",
        "text": "Edite nome, identificador, plataforma e pilares nas configurações do canal. Os rótulos podem seguir seu projeto.",
        "target": "#channelConfigName"
      },
      {
        "title": "Escolha as cores",
        "text": "Ajuste cor principal e destaque. Observe se o texto continua legível na combinação escolhida.",
        "target": "#channelColorPrimary"
      },
      {
        "title": "Adicione arquivos",
        "text": "Selecione logo, ícone ou banner. Use PNG com transparência quando precisar de fundo transparente.",
        "target": "#channelLogoUpload"
      },
      {
        "title": "Revise antes de redefinir",
        "text": "Confira o resultado na tela. Redefinir restaura a identidade padrão; use somente se essa for sua intenção.",
        "target": "#channelBrandReset"
      }
    ],
    "practice": "choice",
    "question": "Qual arquivo permite uma logo sem fundo opaco?",
    "options": [
      "PNG com canal de transparência",
      "JPEG comum"
    ],
    "answer": 0,
    "feedback": "PNG pode preservar transparência; o arquivo precisa ter essa informação.",
    "master": false
  },
  {
    "id": "reports",
    "view": "reports",
    "title": "Relatórios mensais",
    "description": "Leia seus registros no período escolhido.",
    "steps": [
      {
        "title": "Escolha o mês",
        "text": "Selecione o período antes de interpretar os gráficos. A data ativa e o mês do relatório podem ser diferentes.",
        "target": "#reportMonth"
      },
      {
        "title": "Veja o que foi registrado",
        "text": "Os relatórios resumem registros do aplicativo. Um dia sem informação não prova que você não fez a atividade.",
        "target": "#view-reports"
      },
      {
        "title": "Procure uma decisão pequena",
        "text": "Escolha uma observação útil para ajustar a rotina, em vez de tentar melhorar todos os números de uma vez.",
        "target": "#view-reports"
      },
      {
        "title": "Exporte uma cópia",
        "text": "Baixe o CSV do mês se quiser abrir em uma planilha. A exportação não apaga os dados do aplicativo.",
        "target": "#exportMonthCsv"
      }
    ],
    "practice": "choice",
    "question": "Há um dia vazio no gráfico. O que isso significa?",
    "options": [
      "Não há registro para esse dado",
      "Você com certeza não fez nada"
    ],
    "answer": 0,
    "feedback": "O relatório mostra o que foi informado ao aplicativo.",
    "master": false
  },
  {
    "id": "reminders",
    "view": "reminders",
    "title": "Lembretes e notificações",
    "description": "Faça um aviso dizer exatamente o que fazer.",
    "steps": [
      {
        "title": "Nomeie a ação",
        "text": "Escreva um título curto: “tomar água”, “abrir a aula” ou outra ação que você queira lembrar.",
        "target": "#reminderTitle"
      },
      {
        "title": "Escolha quando",
        "text": "Informe horário e os dias em que faz sentido. Confira a repetição antes de adicionar.",
        "target": "#reminderTime"
      },
      {
        "title": "Salve e gerencie",
        "text": "Adicione o lembrete. Na lista, ative, desative ou remova quando sua rotina mudar.",
        "target": "#addReminder"
      },
      {
        "title": "Confira a permissão",
        "text": "Notificações dependem da autorização do sistema. No Windows, o aplicativo precisa continuar em segundo plano para seus avisos nativos.",
        "target": "#requestNotifications"
      }
    ],
    "practice": "choice",
    "question": "O aviso não apareceu. O que conferir?",
    "options": [
      "Permissões, dias/horário e se o app está em execução",
      "Criar dez lembretes idênticos"
    ],
    "answer": 0,
    "feedback": "Conferir as condições do aviso evita duplicar a lista.",
    "master": false
  },
  {
    "id": "control",
    "view": "control",
    "title": "Controle, perfil e aparência",
    "description": "Ajuste o painel às suas prioridades.",
    "steps": [
      {
        "title": "Confira seu perfil",
        "text": "Edite nome e foto se quiser. A configuração do perfil orienta como o painel se apresenta.",
        "target": "#controlProfileName"
      },
      {
        "title": "Escolha sua área",
        "text": "Trocar área reúne combinações ligadas à sua meta. Você pode ajustar até três prioridades e acessar outras ferramentas pelo modo Completo.",
        "target": "#openPersonalization34"
      },
      {
        "title": "Ajuste a aparência",
        "text": "Escolha fontes, cores e tema escuro ou claro. Alterações visuais não exigem recomeçar seus registros.",
        "target": "#controlDarkToggle"
      },
      {
        "title": "Reveja suas respostas",
        "text": "Refazer o questionário permite ajustar preferências. Comece com o necessário e volte depois para outras opções.",
        "target": "#controlRerunOnboarding"
      }
    ],
    "practice": "choice",
    "question": "Quer enxergar menos ferramentas. Qual escolha ajuda?",
    "options": [
      "Essencial e Personalizar",
      "Apagar todos os dados"
    ],
    "answer": 0,
    "feedback": "Você pode reduzir a navegação sem apagar o histórico.",
    "master": false
  },
  {
    "id": "backup",
    "view": "data",
    "title": "Salvar e levar para outro PC",
    "description": "Entenda o backup local antes de importar.",
    "steps": [
      {
        "title": "Conheça o salvamento",
        "text": "Os registros são salvos localmente neste computador. Não há sincronização automática com OneDrive nesta versão.",
        "target": "#view-data"
      },
      {
        "title": "Baixe uma cópia",
        "text": "Use exportar backup para salvar o JSON em uma pasta que você escolha. Faça uma cópia antes de uma atualização ou troca de computador.",
        "target": "#exportBackup"
      },
      {
        "title": "Confira antes de importar",
        "text": "No outro computador, instale o app e escolha importar backup. Confira o arquivo e as confirmações; exporte os dados atuais antes de substituir.",
        "target": "#importBackup"
      },
      {
        "title": "Leve os arquivos separados",
        "text": "Vídeos e outros arquivos externos podem precisar de cópia própria. Apagar todos os dados é uma ação separada: não é necessário para atualizar.",
        "target": "#exportBackup"
      }
    ],
    "practice": "backup",
    "question": "",
    "options": [],
    "answer": 0,
    "feedback": "",
    "master": false
  },
  {
    "id": "screen-culture",
    "view": "culture",
    "title": "Filmes e séries: minha lista",
    "description": "Guarde uma escolha e marque o que já viu.",
    "steps": [
      {
        "title": "Adicione um título",
        "text": "Use + filme ou + série. Edite o nome diretamente na lista para guardar algo que você quer assistir.",
        "target": "#addSeries38"
      },
      {
        "title": "Escolha o status",
        "text": "Quero assistir guarda uma intenção. Assistindo indica algo iniciado. Concluído marca o que você já viu.",
        "target": "#seriesList38"
      },
      {
        "title": "Mude de ideia sem obrigação",
        "text": "A lista pode mudar com seu gosto e seu tempo disponível. Não há uma cobrança para zerar a coleção.",
        "target": "#filmsList38"
      },
      {
        "title": "Mantenha os assuntos separados",
        "text": "Casa cuida de imóvel e reserva. Cultura reúne suas escolhas de lazer; Hábitos ainda permite registrar páginas dos livros.",
        "target": "#view-culture .section-head"
      }
    ],
    "practice": "choice",
    "question": "Começou uma série e ainda não terminou. Qual status usar?",
    "options": [
      "Assistindo",
      "Concluído"
    ],
    "answer": 0,
    "feedback": "O status representa o momento atual, sem exigir terminar tudo.",
    "master": false
  }
];
let learningActive37=null,learningHighlight37=null,learningCleanup37=null;
