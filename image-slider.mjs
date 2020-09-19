(async function(window) {
  if(typeof window !== 'undefined') { return; }

  const {
    findTotalCount,
    render,
    slotChangedHandler,
    dispatchSlideChangedEvent
  } = await import('./src/helpers.mjs');

  class ImageSlider extends HTMLElement {
    constructor() {
      super();
      this.root = this.attachShadow({ mode: 'open'});

      this.state = {
        count: 0,
        isLocked: false,
        selectedIndex: 0,
        selectedImage: null
      };
      this.width = null;
      this.position = null
    }

    get isLocked() { return this.state.isLocked; }
    get selectedImage() { return this.state.selectedImage; }
    get selectedIndex() { return this.state.selectedIndex; }   
    get count() { return this.state.count; }

    connectedCallback(){
      this.width = this.getBoundingClientRect().width;
      this.state.count = findTotalCount(this);
      render(this);
      this.root.querySelector('#main').addEventListener('slotchange', slotChangedHandler.bind(this));
    }

    next(){
      if (this.selectedIndex < this.count - 1) {
        this.state.selectedIndex = this.state.selectedIndex + 1;
        this.state.selectedImage = this.querySelectorAll('> img, > picture')[this.state.selectedIndex + 1];
        this.$slide.style.setProperty('--img-slider--index', this.state.selectedIndex);
        dispatchSlideChangedEvent(this);
      }
    }
    
    prev(){
      if (this.selectedIndex !== 0) {
        this.state.selectedIndex = this.state.selectedIndex - 1;
        this.state.selectedImage = this.querySelectorAll('> img, > picture')[this.state.selectedIndex - 1];
        this.$slide.style.setProperty('--img-slider--index', this.state.selectedIndex);
        dispatchSlideChangedEvent(this);
      } 
    }
    
    slideTo(index) {
      if(!index || typeof index !== 'number') { return; }
      const idx = Math.round(index);
      if(idx > 0 && idx < this.count - 1) {
        this.state.selectedIndex = idx - 1;
        this.state.selectedImage = this.querySelectorAll('> img, > picture')[idx - 1];
        this.$slide.style.setProperty('--img-slider--index', this.state.selectedIndex);
        dispatchSlideChangedEvent(this, idx,  this.querySelectorAll('> img, > picture')[idx]);
      }
    }

  };

  if (!!window.customElements && !window.customElements.get('image-slider')) {
    window.customElements.define('image-slider', ImageSlider);
  }

})(window);