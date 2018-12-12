<template>
  <div class="user-list">
    <div class="self" v-if="$im.user">
      <img :src="$im.user.avatar" alt="" class="avatar">
      <span>{{$im.user.name}}</span>
    </div>
    <div class="search">
      <el-input placeholder="搜索" size="mini" v-model="searchText">
        <i
          class="el-icon-search el-input__icon"
          slot="prefix">
        </i>
      </el-input>
    </div>
    <div class="user-lists">
      <div class="item" 
        :class="{active: $im.selectIndex === index}" 
        v-for="(item, index) in showList($im.userList)"
        :key="item.objectId"
        v-if="item.name.toLowerCase().includes(searchText.toLowerCase())"
        @click="selectUser(index)">
        <div class="avatar">
          <span class="bage" v-if="item.unread"></span>
          <img :src="item.avatar" alt="">
        </div>
        <div class="user-info-content">
          <div class="info">
            <span>{{item.name}}</span>
            <span>{{item.messages | lastInfo('date')}}</span>
          </div>
          <div class="msg" v-html="item.messages.length ? item.messages[item.messages.length-1].message : ''">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Observer} from 'mobx-vue'
import IM from './im-store'
import { Component, Vue, Prop, Watch} from 'vue-property-decorator'
@Observer
@Component<List>({
  filters: {
    lastInfo(v: any[], key: string) {
      if (v.length) {
        return v[v.length - 1][key]
      }
      return ''
    }
  }
})
export default class List extends Vue {
  $im = IM
  searchText = ''
  selectUser(i: number) {
    this.$im.setIndex(i)
  }
  showList(v: any[]) {
    return this.$im.userList.filter(u => {
      return u.name.includes(this.searchText)
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/abstract';
.user-list{
  width:260px;
  min-width: 260px;
  background: #FBFBFB;
  border-right: 1px solid #F2F6FC;
  .self{
    display: flex;
    padding:20px 20px 0 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    .avatar{
      width:30px;
      height:30px;
      margin-right: 10px;
      display: inline-block;
    }
  }
}
.search{
  height:60px;
  align-items: center;
  display: flex;
  padding:0 30px;
}
.user-lists{
  height:calc(100% - 60px);
  overflow-y: auto;
  .item{
    .bage{
      position: absolute;
      display: block;
      width:10px;
      height:10px;
      border-radius: 50%;
      right: -5px;
      top:-5px;
      background: #F56C6C;
    }
    display: flex;
    align-items: center;
    height:75px;
    cursor: pointer;
    border-bottom: 1px solid #EBEEF5;
    padding:12px 18px;
    transition: .15s;
    &.active{
      background: #F2F6FC;
    }
    .avatar{
      position: relative;
      width:40px;
      height:40px;
      margin-right: 10px;
      img{
        width:100%;
        height:100%;
      }
    }
  }
}
.user-info-content{
  height:40px;
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .info{
    display: flex;
    justify-content: space-between;
    span:first-child{
      color:#212121;
      font-size: 14px;
    }
    span:nth-child(2) {
      font-size: 12px;
      color:#888888;
    }
  }
  .msg{
    @include scale(1);
    font-size: 12px;
    color:#888888;
  }
}
</style>