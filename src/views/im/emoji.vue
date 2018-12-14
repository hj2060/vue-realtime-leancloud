<template>
  <transition name="up">
    <div class="qq_face" v-show="show" ref="box">
      <div class="face-box">
        <a v-for="item in emojis" :key="item.title" :title="item.title" :class="item.class" @click="$emit('select', item)">{{item.title}}</a>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import emoji from './emoji.json'
@Component
export default class Home extends Vue {
  @Prop({default: false}) show!: boolean
  emojis = emoji
  outClick(e: Event) {
    const box = (this.$refs.box as HTMLElement)
    const target = e.target as HTMLElement
    if(!box.contains(target) && this.show) {
      this.$emit('update:show', false)
    }
  }
  mounted() {
    window.addEventListener('click', this.outClick)
  }
  destroyed() {
    window.removeEventListener('click', this.outClick)
  }
}
</script>

<style lang="scss">

</style>