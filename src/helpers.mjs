import { html } from './templates';

export function slotChangedHandler(e) {
  this.width = this.getBoundingClientRect().width;
  this.state.count = findTotalCount(this);
  render(this);
  this.$slide = this.root.querySelector('.img_slider__container');
  this.removeEventListener('mousedown', lockImg, false);
  this.addEventListener('mousedown', lockImg, false);
  this.removeEventListener('touchstart', lockImg, false);
  this.addEventListener('touchstart', lockImg, false);
  this.removeEventListener('mouseup', moveImg, false);
  this.addEventListener('mouseup', moveImg, false);
  this.removeEventListener('touchend', moveImg, false);
  this.addEventListener('touchend', moveImg, false);
  this.removeEventListener('touchmove', dragImg, false);
  this.addEventListener('touchmove', dragImg, false);
  this.removeEventListener('mousemove', dragImg, false);
  this.addEventListener('mousemove', dragImg, false);
  this.removeEventListener('resize', getImageWidth.bind(this), false);
  this.addEventListener('resize', getImageWidth.bind(this), false);
}

export function findTotalCount(component) {
  const images = component.querySelectorAll('> picture, > img');
  const fallbackImages = component.querySelectorAll('picture > img');
  return !!images && !!images.length
    ? images.length - (!!fallbackImages.length ? fallbackImages.length : 0)
    : 0;
}

export function render(component) {
  if(!component.root) { return; }
  let $template = document.createElement('template');
  $template.innerHTML = html(component);
  component.root.appendChild(document.importNode($template.content, true));
}

export function dispatchSlideChangedEvent(container, overrideIndex, overrideImage) {
  container.dispatchEvent(new CustomEvent('slide-changed', {
    detail: {
      selectedIndex: overrideIndex === 0 || overrideIndex > -1 ? overrideIndex : container.selectedIndex,
      selectedImage: !!overrideImage ? overrideImage : container.selectedImage
    },
    composed: true,
    bubbles: true
  }));
}


function getImageWidth() {
  this.width = this.getBoundingClientRect().width;
}

function dragImg(evt) {
  evt.preventDefault();
  const container = evt.target;
  if(!!container && container.isLocked) {
    container.$slide.style.setProperty('--img-slider--tx', `${Math.round(unify(evt).clientX - container.position)}px`);
  }
}

function unify(evt) {
  return evt.changedTouches ? evt.changedTouches[0] : evt;
}

function lockImg(evt) {
  const container = evt.target;
  if(!!container && container.$slide) {
    container.position = unify(evt).clientX;
    container.$slide.classList.toggle('smooth', !(container.state.isLocked = true));
  }
}

function moveImg(evt) {
  const container = evt.target;
  if(!!container && container.isLocked){
    let distance = unify(evt).clientX - container.position;
    let direction = Math.sign(distance);
    let factor = +(direction * distance / container.width).toFixed(2);
    if((container.selectedIndex > 0 || direction < 0) &&
      (container.selectedIndex < container.count - 1 || direction > 0) && factor > .2) {
      container.$slide.style.setProperty('--img-slider--index', container.state.selectedIndex -= direction);
      container.root.querySelector('.img_slider__counter span').setAttribute('data-index', `${container.state.selectedIndex + 1}`);
      factor = 1 - factor;
    }
    container.$slide.style.setProperty('--img-slider--tx', '0px');
    container.$slide.classList.toggle('smooth', !(container.state.isLocked = false));
    container.$slide.style.setProperty('--img-slider--factor', factor);
    container.position = null;
  }
  dispatchSlideChangedEvent(container);
}