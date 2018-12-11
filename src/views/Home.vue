<template>
  <div class="home">
    <header>
      <div class="logo">
        <img src="https://static.cdn.soulapp.cn/image/admin/logo.png" alt="">
      </div>
      <div class="title">客服系统</div>
      <div class="nav"></div>
    </header>
    <div class="shelf">
      <div class="side-bar">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo">
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">客服会话</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="content">
        <router-view></router-view>
        <Im v-show="imShow"></Im>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {Route} from 'vue-router'
import Im from './im/index.vue'
@Component({
  components: {Im}
})
export default class Home extends Vue {
  imShow = false
  @Watch('$route', {immediate: true})
  routeChange(route: Route) {
    if (route.path === '/home') {
      this.imShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
header{
  width:100%;
  height:50px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px 0 #d9e3ea;
  background: rgba(218,227,234,0.24);
  background: #F6F8FA;
  position: relative;
  z-index: 20;
  .logo{
    width:90px;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width:80px;
      height:30px;
    }
  }
  .title{
    color:rgb(48, 49, 51);
    font-size: 24px;
    margin-left: 20px;
  }
}
.shelf{
  display: flex;
  .side-bar{
    width:200px;
    height:calc(100vh - 50px);
    box-shadow: 0 18px 18px 0 #d4dee6;
    position: relative;
    z-index: 10;
    .el-menu{
      height:100%;
    }
  }
}
.content{
  padding:20px;
  height:calc(100vh - 50px);
  background: #F1F5F8;
  flex:1;
  overflow: auto;
}
</style>
