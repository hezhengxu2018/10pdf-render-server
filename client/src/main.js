import Vue from 'vue'
import { ObserveVisibility } from 'vue-observe-visibility'
import App from './App.vue'

Vue.directive('observe-visibility', ObserveVisibility)

new Vue({
  render: h => h(App),
}).$mount('#app')
