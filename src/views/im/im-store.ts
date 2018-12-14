import { action, computed, observable } from "mobx";
import {Event, ConversationBase, TextMessage } from 'leancloud-realtime'
import im, {RealtimeResponse} from './im'
import AV from 'leancloud-storage';
import dayjs from 'dayjs'
const avatars = [
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
interface User{
  name: string
  avatar: string
  objectId: string
  messages: any[]
  unread?: boolean
  lastMessage: string
  conversation?: ConversationBase
}
type messageType = 'text' | 'image'
interface PushMessage {
  timestamp: string | Date | number
  message: {
    content: string
    type: messageType
    width?: number
    height?: number}
}
class IMStore {
    id: string = ''
    $im = new im()
    // 每当
    pushEvent: Function = () => {}
    // 使用者信息
    @observable user!: User
    @observable userList: User[] = []
    @observable selectIndex: number | null = null
    get im() {
      return this.$im.im
    }
    // 当前对话用户
    @computed 
    get currentUser() {
      if (this.userList.length && this.selectIndex !== null) {
        return this.userList[this.selectIndex]
      }
      return null
    }
    // 当前信息列表
    @computed
    get currentMessages() {
      if (this.userList.length && this.selectIndex !== null) {
        return this.userList[this.selectIndex].messages
      }
      return []
    }
    public offline() {
      const user = AV.Object.createWithoutData('online', this.id)
      user.set('online', false).save()
    }
    public bindPushEvnet(event: Function) {
      this.pushEvent = event
    }
    public async sendMedia(file: File, type: messageType = 'image') {
      try {
        const handle = await new AV.File(file.name, file).save()
        if (type === 'image') {
          this.getImageSize(file).then(img => {
            console.log(img.width, img.height)
            this.pushMessage(this.currentUser!, {message: {type: 'image', content: img.src, width: img.width, height: img.height}, timestamp: Date.now()})            
          })
        }
        this.send(handle.url(), type)
      } catch(err) {
        console.error('pictureMessage Error', err.message)
      }
    }
    public async sendText(message: string) {
      this.pushMessage(this.currentUser!, {message: {
        type: 'text',
        content: message
      }, timestamp: new Date}, this.user.objectId)
      this.send(message, 'text')
    }
    public async client(id: string) {
      this.id = id
      try {
        await this.$im.client(id)
        const user = AV.Object.createWithoutData('online', id)
        await user.set('online', true).save()
      } catch (err) {
        console.log(err)
      }
      this.usersInit()
      this.listenMessage()
      this.listenService()
    }
    @action.bound
    public async send(message: string, type: messageType = 'text') {
      const currentUser = this.currentUser!
      if (!currentUser.conversation) {
        currentUser.conversation = await this.$im.createConversation(currentUser.objectId, this.user.objectId)
      }
      return currentUser.conversation.send(new TextMessage(JSON.stringify({content: message, type})))
    }
    @action.bound 
    public setIndex(index: number) {
      this.selectIndex = index
    }
    @action.bound 
    public async addUser(userName: string) {
      const index = Math.floor(Math.random() * avatars.length)
      const avatar = avatars[index]
      const user = {
        name: userName, avatar, online: true
      }
      const online = AV.Object.extend('online')
      const item = new online()
      item.set(user)
      const res = await item.save()
      localStorage.setItem('userid', res.id)
      return this.client(res.id)
    }
    /**
     * 内部方法
     */
    // 监听消息
    @action.bound 
    private async listenMessage() {
      this.im.on(Event.MESSAGE, (message, conversation) => {
        const res = message!.toJSON() as RealtimeResponse
        const sender = this.userList.find(u => u.objectId === res.from) as User;
        const {type, content} = JSON.parse(res.text)
        console.log(type, content)
        if (type === 'image') {
          this.getImageSize(content).then(img => {
            this.pushMessage(sender, {message: {
              type: 'image',
              content: content,
              width: img.width,
              height: img.height
            }, timestamp: res.timestamp})            
          })
        }
        if (type === 'text') {
          this.pushMessage(sender, {message: {
            type: 'text',
            content: content
          }, timestamp: res.timestamp})
        }
      })
    }
    getImageSize(url: string | File): Promise<HTMLImageElement> {
      return new Promise((resolve) => {
        const img = document.createElement('img')
        if (typeof url === 'string') {
          img.src = url
          img.onload = () => {
            resolve(img)
          }
        } else {
          const fr = new FileReader();
          fr.onload = function (e: any) {
            img.src = e.target.result
            img.onload = () => resolve(img)
          }
          fr.readAsDataURL(url)
        }
      })
    }
    // 监听群聊用于同步在线用户
    @action.bound 
    private async listenService() {
      // 有用户加入房间
      this.im.on(Event.MEMBERS_JOINED, (payload, conversation) => {
        const id = payload!.invitedBy
        if (this.id !== id && !this.userList.find(u => u.objectId === id)) {
          const query = new AV.Query('online')
          query.get(id).then(user => {
            this.userList.unshift({...user.toJSON(), messages: [], conversation: null})
          })
        }
      })
    }
    // 加入用户消息队列
    @action.bound 
    private pushMessage(sender: User, res: PushMessage, userid?: string) {
      const start = new Date()
      const current = new Date(res.timestamp)
      let datestr = ''
      if (start.valueOf() - current.valueOf() > 24 * 60 * 1000) {
        datestr = dayjs(current).format('YY/MM/DD')
      } else {
        datestr = dayjs(current).format('HH:mm')
      }
      sender.messages.push({
        objectId: userid || sender.objectId,
        id: sender.messages.length + 1,
        content: res.message,
        date: datestr,
        timestamp: current.valueOf()
      })
      if (res.message.type === 'text') {
        sender.lastMessage = res.message.content
      }
      // 虚拟滚动组件强制更新
      sender.messages = sender.messages.slice()
      // console.log(sender.messages)
      if (this.currentUser && (userid || sender.objectId === this.currentUser!.objectId)) {
        this.pushEvent()
      }
        // if (currentUser.objectId !== sender.objectId) {
        //   sender.unread = true
        //   this.userSort()
        // }
    }
    @action.bound 
    private async userSort() {
      // this.userList = this.userList.sort((a, b) => {
      //   if (!a.messages.length || !a.messages.length) {
      //     return 0
      //   }
      //   const timestamp1 = a.messages[a.messages.length - 1].timestamp
      //   const timestamp2 = a.messages[b.messages.length - 1].timestamp
      //   return timestamp1 > timestamp2 ? -1 : 1
      // })
    }
    @action.bound private async usersInit() {
      // 查找在在线用户
      const query = new AV.Query('online')
      const users = (await query.equalTo('online', true).find()).map(u => {
        const user = u.toJSON()
        if (user.objectId === this.id) {
          this.user = user
        }
        user.messages = []
        user.conversation = null
        user.lastMessage = ''
        return user
      })
      this.userList = users.filter(u => {
        return u.objectId !== this.id
      })
    }
    
}
export default new IMStore()