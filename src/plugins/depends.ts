import Icon from '@/components/icon/index.vue'
import icons from '@/svg/output.json'
import ElementUI from 'element-ui';
import VueVirtualScroller from 'vue-virtual-scroller';
import api from '../api/index'
import 'element-ui/lib/theme-chalk/index.css';
import '../scss/common.scss';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
(Icon as any).add(icons);
export default (Vue: any) => {
  Vue.prototype.$api = api
  Vue.component('Icon', Icon)
  Vue.use(VueVirtualScroller)
  Vue.use(ElementUI);
}