import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import * as bootstrap from 'bootstrap/dist/js/bootstrap.js';

createApp(App)
// .use(bootstrap)
.use(router).use(store).mount('#app')