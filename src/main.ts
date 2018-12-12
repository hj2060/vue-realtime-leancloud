import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import store from './store';
import depends from './plugins/depends'
Vue.config.productionTip = false;
Vue.use(depends)
new Vue({
  router,
  // store,
  render: (h) => h(App),
}).$mount('#app');
