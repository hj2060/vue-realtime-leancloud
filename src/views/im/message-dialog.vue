<template>
  <div class="message-panel">
    <header class="md-header" v-if="$im.currentUser">
      <img :src="$im.currentUser.avatar" alt="" class="avatar">
      <span class="name">{{$im.currentUser.name}}</span>
      <span class="icon"></span>
    </header>
    <span class="nomore" v-if="!$im.currentUser">未选择对话</span>
    <div class="message-list" ref="list">
      <div>
        <div class="md-message me" v-if="item.objectId === $im.user.objectId" v-for="item in $im.currentMessages" :key="item.id">
          <div class="info">
            <span class="text" v-html="item.message"></span>
          </div>
          <img class="avatar" :src="$im.user.avatar" alt="">
        </div>
        <div class="md-message other" v-else>
          <img class="avatar" :src="$im.currentUser.avatar" alt="">
          <div class="info">
            <span class="text" v-html="item.message"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="message-list">
      <span class="nomore">暂时没有更多消息</span>
      <div class="message other" v-for="n in 2">
        <img class="avatar" src="https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgeticon?seq=677838611&username=@bd8b0fef612a56a24667f7140aaa61c1&skey=@crypt_c319d90c_e55d04993c14127254af11f989fdae53" alt="">
        <div class="info">
          <span class="text">
            我来啦水电费吉计算两点缴费来得及法律<img class="input-emoji" src="https://wx.qq.com/zh_CN/htmledition/v2/images/spacer.gif"></img>酸辣粉机水立方
          </span>
        </div>
      </div>
      <div class="message me" v-for="n in 2">
        <div class="info">
          <span class="text">
            我来啦水电费吉计算两点缴费来得及法律<img class="input-emoji" src="https://wx.qq.com/zh_CN/htmledition/v2/images/spacer.gif"></img>酸辣粉机水立方
          </span>
        </div>
        <img class="avatar" src="https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgeticon?seq=633027519&username=@037165b685419f2069ffcefce78261757503237e8e69a607570cafbe882a0798&skey=@crypt_c319d90c_0a2a2fba7c46e13e9f8b0cd1b5b79778" alt="">
      </div>
    </div>-->
    <div class="input-panel" v-if="$im.currentUser">
      <div class="tool-list">
        <div>
          <Icon name="emoji" :size="25" @click="openEmoji = true"></Icon>
          <Emoji @select="selectEmoji" :show.sync="openEmoji"></Emoji>
        </div>
        <div>
          <input type="file" name="picture"/>
          <Icon name="picture" :size="22"></Icon>
        </div>
      </div>
      <div>
        <div class="md-input" contenteditable="true" v-html="msg" @keydown.enter="enter" ref="message" @blur="editBlur"></div>
      </div>
      <div class="md-footer">
        <span>按下Cmd+Enter换行</span>
        <button>发送</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Emoji from './emoji.vue'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import {Observer} from 'mobx-vue'
import IM from './im-store'
@Observer
@Component({
  components: {
    Emoji
  }
})
export default class Home extends Vue {
  $im = IM
  msg = ''
  messageElement!: HTMLElement
  messageList!: HTMLElement
  openEmoji = false
  range!: Range
  private xhs(s: string) {
    return s.replace(/(<script>|<\/script>)/g, '')
  }
  private editBlur() {
    if (window.getSelection()) {
      this.range = window.getSelection().getRangeAt(0)
    }
  }
  private selectEmoji(item: {title: string, class: string}) {
    setTimeout(() => {
      const i = item.class.match(/qqface(\d+)/)![1]
      this.insertHtml(`<img class="input-emoji qqemoji${i}" title="${item.title}" src="https://wx.qq.com/zh_CN/htmledition/v2/images/spacer.gif">`)   
    });
  }
  // 向指定光标位置插入html内容
  private insertHtml(html: string) {
    if (!this.range) {
      (this.$refs.message as HTMLElement).innerHTML += html
      return
    }
    let sel = window.getSelection();
    if (sel.rangeCount > 0) {
      let range = sel.getRangeAt(0);      //获取选择范围
      range.deleteContents();             //删除选中的内容
      let el = document.createElement("div"); //创建一个空的div外壳 
      el.innerHTML = html;                 //设置div内容为我们想要插入的内容。
      let frag = document.createDocumentFragment();//创建一个空白的文档片段，便于之后插入dom树
      let node = el.firstChild!;
      let lastNode = frag.appendChild(node);
      this.range.deleteContents()
      this.range.insertNode(frag);                 //设置选择范围的内容为插入的内容
      let contentRange = this.range.cloneRange();  //克隆选区
      contentRange.setStartAfter(lastNode);          //设置光标位置为插入内容的末尾
      contentRange.collapse(true);                   //移动光标位置到末尾
      sel.removeAllRanges();                  //移出所有选区
      sel.addRange(contentRange);             //添加修改后的选区
    }
  }
  enter(e: KeyboardEvent) {
    if (!e.shiftKey) {
      e.preventDefault()
      const message = (this.$refs.message as HTMLElement).innerHTML
      if (message) {
        this.send(message)
      }
    }
  }
  clear() {
    this.msg = '';
    (this.$refs.message as HTMLElement).innerHTML = ' ';
  }
  send(message: string) {
    // const id = this.messages.length ? this.messages[this.messages.length - 1].id + 1 : 1
    // const match = message.match(/<img (\s.)+? title="(.+)"><\/img>/g)
    // // 匹配用于发送
    // const formate = message.replace(/<img .+?>/g, ($m) => {
    //   const res = $m.match(/title="(.+?)"/)
    //   return `[${res![1]}]`
    // })
    this.clear();
    this.$im.send(message)
  }
  mounted() {
    // firefox
    this.$im.bindPushEvnet(() => {
      const list = (this.$refs.list as HTMLElement)
      if (list.children.length) {
        setTimeout(() => {
          list.scrollTop = list.children[0].clientHeight          
        })
      }
    })
    document.execCommand('defaultParagraphSeparator', false, 'br')
  }
}
</script>