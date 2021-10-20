import { createApp } from 'vue'
// import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'

// import * as bootstrap from 'bootstrap/dist/js/bootstrap.js';

createApp(App)
// .use(axios)
// .use(bootstrap)
.use(router)
// .use(router,axios)
.use(store).mount('#app')