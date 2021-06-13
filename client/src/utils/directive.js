function validate(binding) {
  if (typeof binding.value !== 'function') {
    return false
  }

  return true
}

module.exports = {
  bind(el, binding, vNode) {
    if (!validate(binding)) return

    // Define Handler and cache it on the element
    function handler(e) {
      if (!vNode.context) return

      if (
        document.querySelector('#viewerContainer').contains(e.target) &&
        !document
          .querySelector('#secondaryToolbar')
          .classList.contains('hidden')
      ) {
        el.vueClickOutside.callback(e)
      }
    }

    // add Event Listeners
    el.vueClickOutside = {
      handler,
      callback: binding.value,
    }
    const clickHandler =
      'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
    document.addEventListener(clickHandler, handler)
  },

  update(el, binding) {
    if (validate(binding)) el.vueClickOutside.callback = binding.value
  },

  unbind(el) {
    // Remove Event Listeners
    const clickHandler =
      'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
    if (el.vueClickOutside) {
      document.removeEventListener(clickHandler, el.vueClickOutside.handler)
    }
    delete el.vueClickOutside
  },
}
