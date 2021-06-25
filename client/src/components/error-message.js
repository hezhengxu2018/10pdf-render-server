/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue'
import ErrorMessage from './ErrorMessage.vue'

const MessageConstructor = Vue.extend(ErrorMessage)

let instance

const Message = (options) => {
  if (typeof options === 'string') {
    const selfOptions = {
      message: options,
    }
    instance = new MessageConstructor({
      data: selfOptions,
    })
  } else {
    instance = new MessageConstructor()
  }
  instance.$mount()
  document.querySelector('#errorMessage').appendChild(instance.$el)
  return instance
}

export default Message
