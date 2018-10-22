import Vue from 'vue'

import VJstree from './src/index.js'
Vue.use(VJstree)

import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})
