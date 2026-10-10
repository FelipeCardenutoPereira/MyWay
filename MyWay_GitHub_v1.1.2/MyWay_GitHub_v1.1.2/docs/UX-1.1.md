# UX 1.1 — direção de interface

## Cabeçalhos

Todas as áreas principais usam a mesma hierarquia: eyebrow curto, título editorial, uma linha de apoio e capa horizontal. A capa padrão é abstrata e discreta; cada área pode receber uma imagem própria e pode voltar ao padrão.

## Favoritos no painel

Um favorito representa uma **ferramenta utilizável**, não um atalho decorativo. Ao abrir o painel principal, a seção funcional correspondente é movida temporariamente para o quadro do favorito, preservando IDs e listeners. Ao navegar para outra tela, a seção retorna ao local original antes da renderização. Isso evita duplicação de DOM e mantém a ferramenta editável.

## Diário

O diário funciona como página de caderno: data destacada, campos de humor e energia de 0 a 10, folha pautada e tags discretas. O histórico permanece separado da página de escrita.

## Personalização

Aparência oferece cor global do painel e fundos abstratos. A luminância da cor selecionada define automaticamente contraste de texto, ícones, bordas e superfícies. O usuário continua podendo alternar claro/escuro e reduzir animações.

## Linguagem

Evitar slogans longos ou excessivamente publicitários. Preferir títulos diretos: “Seu trabalho.”, “Seus estudos.”, “Controle seu dinheiro.”, “Suas notas.”, “Seu diário.”.
