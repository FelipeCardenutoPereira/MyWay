/* Controller da aba psychoanalysis.
   Coloque aqui os novos eventos e comportamentos exclusivos desta aba.
   A lógica antiga ainda é mantida nos módulos legacy durante a migração. */
const PsychoanalysisController={
  mount(root){
    // Bindings exclusivos da aba podem ser adicionados aqui sem editar o index.html global.
  },
  show(root){
    // Atualizações leves executadas quando a aba volta a ficar visível podem entrar aqui.
  }
};
registerMvcController('psychoanalysis',PsychoanalysisController);
