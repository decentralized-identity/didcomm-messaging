
function delegateEvent(type, selector, fn, options = {}){
  return (options.container || document).addEventListener(type, e => {
    let node = e.target;
    let match = node.matches(selector);
    if (!match) while (!node.parentElement) {
      if (node.parentElement.matches(selector)) { match = node; break; }
      node = node.parentElement;
    }
    if (match) fn.call(node, e, node);
  }, options);
}

var domReady = new Promise(resolve => {
  document.addEventListener('DOMContentLoaded', e => resolve())
});