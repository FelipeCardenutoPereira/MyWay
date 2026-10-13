/* Controller da aba reminders.
   Coloque aqui os novos eventos e comportamentos exclusivos desta aba.
   A lógica antiga ainda é mantida nos módulos legacy durante a migração. */
const RemindersController={
  mount(root){
    // Bindings exclusivos da aba podem ser adicionados aqui sem editar o index.html global.
  },
  show(root){
    // Atualizações leves executadas quando a aba volta a ficar visível podem entrar aqui.
  }
};
registerMvcController('reminders',RemindersController);
