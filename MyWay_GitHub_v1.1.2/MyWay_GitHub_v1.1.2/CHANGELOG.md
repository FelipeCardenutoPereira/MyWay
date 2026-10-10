# Changelog

## 1.1.2
- Corrige o menu lateral quando o recolhimento automático está ativo: sem textos cortados, grupos inacessíveis ou favoritos vazando para fora da barra.
- O menu automático também expande por foco de teclado e respeita hover/foco antes de recolher.
- O atalho do Diário passa a integrar o mesmo dock flutuante de Assistente, Respiração e Hábitos.
- A área de inglês deixa de recomendar A Odisseia e usa orientação genérica de leitura compatível com o nível.

## 1.1.1 — 2026-10-09

- Corrigido o travamento do carregamento no Windows: a inicialização tentava associar um evento ao campo de busca exclusivo do menu móvel mesmo quando esse elemento não existia no desktop.
- O vínculo do controle móvel agora é condicional, permitindo que a inicialização do painel desktop conclua normalmente.
- Novo instalador Windows por usuário: encerra uma instância antiga antes de atualizar, preserva os dados pessoais em AppData, recria atalhos e registra desinstalação.
- Pacote portátil e fonte para GitHub atualizados com o hotfix.

## 1.1.0 — 2026-10-09

- Favoritos do painel agora podem exibir a seção funcional real da ferramenta, em vez de um cartão-resumo ou da página inteira.
- Favoritos receberam interface reduzida e menos texto.
- Diário redesenhado como caderno: data no topo, linhas de escrita, melhor espaçamento e escalas numéricas de 0 a 10.
- Atalho com ícone para abrir o Diário.
- Cabeçalhos padronizados, menores e com capas substituíveis por seção.
- Textos editoriais simplificados: “Controle seu dinheiro.”, “Seu trabalho.”, “Suas notas.” e equivalentes.
- Novos fundos abstratos: malha, fitas, topografia e partículas, além das opções anteriores.
- Cor global do painel configurável, com contraste claro/escuro calculado automaticamente.
- Controles neutros revisados: azul profundo no tema escuro e cinza claro legível no tema claro.
- Espaçamento do botão “Hoje” corrigido.
- Navegação reorganizada: “Criação e relações” removido; itens correspondentes passaram para “Metas”; “Desenvolvimento pessoal” virou “Desenvolvimento”.
- Conexão externa de IA e comando de voz removidos da experiência; assistente interno prioriza processamento local.
- Escalas antigas do Diário (1–5) recebem migração única para 0–10.
- Android: `versionCode 66`, `versionName 1.1.0`.
