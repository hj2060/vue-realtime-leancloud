<template>
  <RecycleScroller
    class="scroller"
    :items="list"
    :buffer="200"
    :item-height="32"
    :page-mode="false"
    key-field="name"
  >
    <div slot-scope="{ item }" class="user">
      {{ item.name }}
    </div>
  </RecycleScroller>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: 'hj'
        },
        {
          name: '了圣诞节开发'
        }
      ]
    }
  }
}
</script>

<style scoped>
.scroller {
  height: 100%;
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
</style>