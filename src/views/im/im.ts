import {Realtime, IMClient} from 'leancloud-realtime'
export default class IM {
  realtime = new Realtime({
    appId: process.env.VUE_APP_APPID,
    appKey: process.env.VUE_APP_APPKEY
  })
  im!: IMClient
  // 链接im
  public client(id: string) {
    return this.realtime.createIMClient(id).then(im => {
      this.im = im
      this.joinService()
      return im
    })
  }
  public createConversation(id: string, userid: string) {
    return this.im.createConversation({
      members: [id],
      name: `${userid} & ${id}`
    })
  }
  // 加入客服群聊 用于接收其他人上线推送
  private async joinService() {
    const conversation = await this.im.getConversation('5c0f77c9303f390069989d5f')
    conversation.join()
  }
}
export interface RealtimeResponse {
  from: string
  data: {[key: string]: any}
  id: string
  cid: string
  text: string
  timestamp: string
}