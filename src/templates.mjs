export function html(component) {
  return `
    <style>
      ${css(component)}
    </style>
    <slot name="prev-action"></slot>
    <div class="img_slider__container" style="--img-slider--index: ${component.selectedIndex}">
      <slot id="main"></slot>  
    </div>
    <slot name="next-action"></slot>
    <slot name="custom-action"></slot>
    <slot name="slider-counter"></slot>
  `;
}

function css(component) {
  return  `
    :host {
      position: relative;
      display: block;
      overflow-x: hidden;
      max-height: 100%;
    }

    .img_slider__container,
    ::slotted(img),
    ::slotted(picture) {
      display: block;
      padding: 0;
      margin: 0;
    }

    .smooth {
      transition: transform calc(var(--img-slider--factor, 1) * .5s) ease-out; 
    }

    .img_slider__container,
    .img_slider__counter {
      display: flex;
      align-items: center;
    }

    .img_slider__container {
      --img-slider--count: ${component.count};
      min-width: 100%;
      min-height: 50%;
      max-height: 100%;
      background: #333;
      background: var(--img-slider--bkg-color, #333);
      width: 100%;
      width: calc(var(--img-slider--count) * 100%);
      overflow-y: hidden;
      transform: translate(calc(var(--img-slider--index, 0) / var(--img-slider--count) * -100% + var(--img-slider--tx, 0px)));
      transition: transform .5s ease-out;
    }

    ::slotted([slot=prev-action]),
    ::slotted([slot=next-action]),
    ::slotted([slot=custom-action]) {
      position: absolute;
      z-index: 10;
    }

    ::slotted([slot=prev-action]),
    ::slotted([slot=next-action]),
    ::slotted([slot=custom-action]) {
      cursor: pointer;
    }

    ::slotted(img),
    ::slotted(picture) {
      user-select: none;
      width: 100%;
      width: calc(100% / var(--img-slider--count));
      pointer-events: none;
    }
  `;
}
