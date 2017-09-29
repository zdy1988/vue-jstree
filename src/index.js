/**
 * Created by virus_zhh on 2017/9/29.
 */
import VJstree from './tree.vue'

var component = {
  install(Vue){
    Vue.component(VJstree.name, VJstree)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(component);
}

export default component