import Vue from 'vue'

import VueJstree from './src/index.js'
Vue.use(VueJstree)

import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})
