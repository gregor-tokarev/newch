<template>
  <div class="item">
    <div v-if="!show" class="item__overlay" />
    <div class="item__img">
      <img :src="imgUrl" :alt="item.title.value" @load="show = true">
    </div>
    <div class="item__body">
      <h3 class="item__title" v-html="title" />
      <p class="item__board" v-html="board" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchItem',
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  data: () => ({
    show: false
  }),
  computed: {
    imgUrl () {
      if (this.item.body && this.item.body.blocks.length) {
        const imgUrl = this.item.body.blocks.find(block => block.type === 'image')
        return imgUrl?.data.file.url || 'https://placewaifu.com/image/145/105'
      }
      return 'https://placewaifu.com/image/145/105'
    },
    title () {
      return this.item._highlightResult?.title?.value
    },
    board () {
      return this.item._highlightResult?.board?.value
    }
  }
}
</script>

<style scoped lang="scss">
.item {
  position: relative;
  display: flex;
  cursor: pointer;
  background-color: var(--text);

  &__overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--text);
  }

  &__title {
    @include button;
  }

  &__img {
    margin-right: 20px;

    img {
      max-width: 50px;
      max-height: 70px;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  ::v-deep {
    em {
      font-style: normal;
      color: var(--text);
      background-color: var(--accent);
    }
  }
}
</style>
