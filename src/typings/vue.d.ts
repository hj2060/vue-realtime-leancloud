import Vue from 'vue'
import api from '../api/index'
declare module 'vue/types/vue' {
  interface Vue {
    $api: typeof api
    mounted(): void
    destroyed(): void
  }
}
