<template>
  <div class="container">
    <div class="server-panel">
      <user-list 
        :user="user"
        :user-list="userList" 
        @select="selectUser"/>
      <message-dialog 
        ref="dialog" 
        :dialogist="currentUser"/>
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
import {Realtime, IMClient, Event} from 'leancloud-realtime'
import AV,{ Events } from 'leancloud-storage';
AV.init({
  appId: process.env.VUE_APP_APPID, 
  appKey: process.env.VUE_APP_APPKEY
});
const online = AV.Object.extend('online')
interface RealtimeResponse {
  from: string,
  data: {[key: string]: any},
  id: string,
  cid: string
}
interface User{
  name: string,
  avatar: string,
  objectId: string
}
@Component<ImIndex>({
  components: {UserList, MessageDialog}
})
export default class ImIndex extends Vue {
  dialog!: MessageDialog; closeEvent!: string
  user: User = {name: '', avatar: '', objectId: ''}
  registerShow = false; messageName = ''
  realtime: Realtime | null = null; im: IMClient | null = null
  id = ''; selectIndex: null | number = null
  avatars = [
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/dfb2382301832933dd3a.jpg',
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/4636698f4db837ef78f9.jpg',
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/6fe969910e1c53c54b69.jpg',
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/6fe2d2b6d3d9f793fdfb.jpg',
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/437f60b5e8e205d639e3.jpg',
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/2b72534621816f5c8c9a.jpg',
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/defc36936b816a5305a6.jpg',
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/d6406d66dc3dab2f54b9.jpg',
    'http://lc-xdfaqwh5.cn-n1.lcfile.com/e9654ecdb79129059de6.jpg'
  ]
  userList: Array<User> = []
  async checkRegister() {
    let userid = localStorage.getItem('userid')
    if (!userid) {
      this.registerShow = true
    } else {
      this.id = userid
      this.im = await this.realtime!.createIMClient(this.id)
      const user = AV.Object.createWithoutData('online', this.id)
      await user.set('online', true).save()
      this.addListener()
      this.subscribe()
    }
  }
  get currentUser() {
    if (this.selectIndex !== null) {
      return this.userList[this.selectIndex]
    }
    return {}
  }
  selectUser(index: number) {
    this.selectIndex = index
  }
  async addUser() {
    if (!this.messageName) {
      return this.$message.warning('请输入昵称')
    }
    const name = this.messageName
    const index = Math.floor(Math.random() * this.avatars.length)
    const avatar = this.avatars[index]
    const user = {
      name, avatar, online: true
    }
    const item = new online()
    item.set(user)
    const res = await item.save()
    localStorage.setItem('userid', res.id)
    this.im =  await this.realtime!.createIMClient(res.id)
    this.id = res.id
    this.addListener()
    this.subscribe()
    this.messageName = ''
    this.registerShow = false
  }
  addListener() {
    this.im!.on(Event.MESSAGE, (message) => {
      const res = message!.toJSON() as RealtimeResponse
      console.log(res)
    })
    // 有用户加入房间
    this.im!.on(Event.MEMBERS_JOINED, (payload, conversation) => {
      const id = payload!.invitedBy
      if (!this.userList.find(u => u.objectId === id) && this.id !== id) {
        const query = new AV.Query('online')
        query.get(id).then(user => {
          this.userList.push(user.toJSON())
        })
      }
    })
  }
  // 订阅系统消息
  async subscribe() {
    try{
      // 查找在在线用户
      const query = new AV.Query('online')
      const users = (await query.equalTo('online', true).find()).map(u => {
        const user = u.toJSON()
        if (user.objectId === this.id) {
          this.user = user
        }
        return user
      })
      this.userList = users.filter(u => {
        return u.objectId !== this.id
      })
      const user = this.userList.find((u: User) => u.objectId === this.id)
      // 订阅service room 群对话
      const conversation = await this.im!.getConversation('5c0f77c9303f390069989d5f')
      conversation.join()
    } catch (err) {
      this.$notify.error({
        title: '错误',
        message: err.message
      })
    }
    
  }
  windowUnLoad(e: any) {
    const user = AV.Object.createWithoutData('online', this.id)
    user.set('online', false).save()
    e.preventDefault()
  }
  destroyed() {
    // window.removeEventListener('beforeunload', this.windowUnLoad)
  }
  mounted() {
    this.realtime = new Realtime({
      appId: process.env.VUE_APP_APPID,
      appKey: process.env.VUE_APP_APPKEY
    });
    this.checkRegister()
    window.addEventListener('beforeunload', this.windowUnLoad)
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
}
</style>