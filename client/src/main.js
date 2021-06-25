/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue'
import { ObserveVisibility } from 'vue-observe-visibility'
import App from './App.vue'
import errorMessage from './components/error-message'

Vue.directive('observe-visibility', ObserveVisibility)
Vue.prototype.$EventBus = new Vue()

Vue.prototype.$errorMessage = errorMessage

new Vue({
  render: (h) => h(App),
}).$mount('#app')
