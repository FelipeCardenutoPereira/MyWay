/* Controller da aba Inspiration · v1.3.7.
   Reidrata o mural sempre que a aba abre e não depende de listeners criados no primeiro render. */
const InspirationController={
  mount(root){
    recoverInspirationPins137?.();
    ensureInspirationReady137?.();
  },
  show(root){
    recoverInspirationPins137?.();
    ensureInspirationReady137?.();
  }
};
registerMvcController('inspiration',InspirationController);
