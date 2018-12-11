import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Users from './views/users/index.vue'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'im',
          component: {
            render(h: any) {
              return h('div', '')
            }
          }
        },
        {
          path: '/users',
          name: 'users',
          component: Users
        }
      ]
    }
  ],
});
