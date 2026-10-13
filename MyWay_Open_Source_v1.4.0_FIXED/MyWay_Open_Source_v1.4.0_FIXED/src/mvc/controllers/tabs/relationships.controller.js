/* Controller da aba relationships.
   Coloque aqui os novos eventos e comportamentos exclusivos desta aba.
   A lógica antiga ainda é mantida nos módulos legacy durante a migração. */
const RelationshipsController={
  mount(root){
    // Bindings exclusivos da aba podem ser adicionados aqui sem editar o index.html global.
  },
  show(root){
    // Atualizações leves executadas quando a aba volta a ficar visível podem entrar aqui.
  }
};
registerMvcController('relationships',RelationshipsController);
