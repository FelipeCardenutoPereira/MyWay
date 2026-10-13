/* Controller da aba finance.
   Coloque aqui os novos eventos e comportamentos exclusivos desta aba.
   A lógica antiga ainda é mantida nos módulos legacy durante a migração. */
const FinanceController={
  mount(root){
    // Bindings exclusivos da aba podem ser adicionados aqui sem editar o index.html global.
  },
  show(root){
    // Atualizações leves executadas quando a aba volta a ficar visível podem entrar aqui.
  }
};
registerMvcController('finance',FinanceController);
