declare module 'vue-virtual-scroller' {
  const module: any
  export const DynamicScroller: any
  export const DynamicScrollerItem: any
  export default module
}
declare module 'leancloud-realtime-plugin-typed-messages' {
  export class ImageMessage {
    constructor(file: any)
    setText(message: string): void
    setAttributes(attr: {[key: string]: any}): void
  }
}