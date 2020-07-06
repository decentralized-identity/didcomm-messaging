


customElements.define('slide-panels', class SidePanels extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();
    
    this.addEventListener('pointerup', e => {
      if (e.target === this) this.close();
    })
  }
  get active (){
    return this.getAttribute('open');
  }
  toggle(panel){
    this.active === panel ? this.close() : this.open(panel)
  }
  open (panel){
    this.setAttribute('open', panel);
  }
  close (){
    this.removeAttribute('open');
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open': for (let child of this.children) {
        if (child.id === current) child.setAttribute('open', '');
        else child.removeAttribute('open', '');
      }
      break;
    }
  }
});

customElements.define('detail-box', class DetailBox extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();   
    
    this.addEventListener('pointerup', e => {
      if (e.target.hasAttribute('detail-box-toggle')) {
        e.stopPropagation();
        this.toggle();   
      }
    });

    this.addEventListener('transitionend', e => {
      let node = e.target;
      if (node.parentElement === this && node.tagName === 'SECTION' && e.propertyName === 'height') {
        node.style.height = this.hasAttribute('open') ? 'auto' : null;
      }
    });
  }
  toggle(){
    this.toggleAttribute('open');
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open':
        for (let node of this.children) {
          if (node.tagName === 'SECTION') {
            if (current !== null) {
              if (node.offsetHeight < node.scrollHeight) {
                node.style.height = node.scrollHeight + 'px';
              }
            }
            else if (node.offsetHeight > 0) {
              node.style.height = node.offsetHeight + 'px';
              let scroll = this.scrollHeight;
              node.style.height = 0;
            }
            break;
          }
        }
    }
  }
});

customElements.define('tab-panels', class TabPanels extends HTMLElement {
  constructor() {
    super();
    delegateEvent('click', 'tab-panels > nav > *', (e, delegate) => {
      let nav = delegate.parentElement;
      if (nav.parentElement === this) {
        this.setAttribute('selected-index', Array.prototype.indexOf.call(nav.children, delegate))
      }
    }, { container: this, passive: true });
  }
  static get observedAttributes() {
    return ['selected-index'];
  }
  attributeChangedCallback(attr, last, current) {
    domReady.then(() => {
      switch(attr) {  
        case 'selected-index':
          let index = current || 0;
          let nav = this.querySelector('nav');
          if (nav.parentElement === this) {
            let tabs = nav.children;
            let selected = tabs[index];
            for (let tab of tabs) tab.removeAttribute('selected');
            if (selected) selected.setAttribute('selected', '');
            let panel = Array.prototype.filter.call(this.children, node => {
              if (node.tagName === 'SECTION') {
                node.removeAttribute('selected');
                return true;
              }
            })[index];
            if (panel) panel.setAttribute('selected', '');
          }
          break;
      }
    });
  }
});