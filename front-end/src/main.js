import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import routes from './routes';


import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas, fab);

createApp(App)
.use(routes)
.use(store)
.component('fa', FontAwesomeIcon)
.mount('#app');
