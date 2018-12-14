<template>
  <div class="container">
    <div class="server-panel">
      <user-list/>
      <message-dialog ref="dialog"/>
    </div>
    <el-dialog title="注册名称" :visible.sync="registerShow" :close-on-click-modal="false">
      <el-input placeholder="请输入名字" v-model="messageName"></el-input>
      <el-button type="success" style="margin-top:20px" @click="addUser">确定</el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UserList from './user-list.vue'
import MessageDialog from './message-dialog.vue'
import {Observer} from 'mobx-vue'
import IM from './im-store'
@Observer
@Component<ImIndex>({
  components: {UserList, MessageDialog}
})
export default class ImIndex extends Vue {
  $im = IM
  dialog!: MessageDialog; closeEvent!: string
  registerShow = false; messageName = ''
  async checkRegister() {
    let userid = localStorage.getItem('userid')
    if (!userid) {
      this.registerShow = true
    } else {
      await this.$im.client(userid)
    }
  }
  async addUser() {
    if (!this.messageName) {
      return this.$message.warning('请输入昵称')
    }
    const name = this.messageName
    await this.$im.addUser(name)
    this.messageName = ''
    this.registerShow = false
  }
  destroyed() {
    window.removeEventListener('beforeunload', this.$im.offline.bind(this.$im))
  }
  mounted() {
    this.checkRegister()
    window.addEventListener('beforeunload', this.$im.offline.bind(this.$im))
    this.dialog = this.$refs.dialog as MessageDialog
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/abstract';
.server-panel{
  background: white;
  border-radius: 2px;
  display: flex;
  width: 1000px;
  margin:auto;
  height:calc(100vh - 90px);
  box-shadow: 1px 1px 10px 0 rgba(0, 0, 0, .1);
}
</style>