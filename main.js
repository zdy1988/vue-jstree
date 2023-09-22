import {createApp,h} from 'vue'
import App from './App.vue'

var app = createApp({
  render: () => h(App)
});

app.mount('#app');
