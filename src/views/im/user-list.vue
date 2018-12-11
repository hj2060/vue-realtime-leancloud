<template>
  <div class="user-list">
    <div class="self">
      <img :src="user.avatar" alt="" class="avatar">
      <span>{{user.name}}</span>
    </div>
    <div class="search">
      <el-input placeholder="搜索" size="mini" v-model="searchText">
        <i
          class="el-icon-search el-input__icon"
          slot="prefix">
        </i>
      </el-input>
    </div>
    <RecycleScroller
      class="user-lists"
      :items="userList"
      :prerender="10"
      :item-height="75"
      key-field="name"
    >
      <div class="item" 
        :class="{active: active === index}" slot-scope="{item, index}" 
        v-if="item.name.toLowerCase().includes(searchText.toLowerCase())"
        @click="selectUser(index)">
        <div class="avatar">
          <img :src="item.avatar" alt="">
        </div>
        <div class="user-info-content">
          <div class="info">
            <span>{{item.name}}</span>
            <span>15:16</span>
          </div>
          <div class="msg">
            昨天我去了那里
          </div>
        </div>
      </div>
    </RecycleScroller>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator'
@Component
export default class List extends Vue {
  @Prop({default: []}) userList!: any[]
  @Prop() user: any
  searchText = ''
  active: null | number = null
  selectUser(i: number) {
    this.active = i
    this.$emit('select', i)
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