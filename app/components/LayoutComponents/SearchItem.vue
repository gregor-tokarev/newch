<template>
  <div class="item">
    <div class="item__overlay" v-if="!show"></div>
    <div class="item__img">
      <img :src="imgUrl" @load="show = true" :alt="item.title">
    </div>
    <div class="item__body">
      <h3 class="item__title" v-html="item.title && item.title.value"></h3>
      <p class="item__board" v-html="item.board && item.board.value"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchItem',
  data: () => ({
    show: false
  }),
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  computed: {
    imgUrl () {
      if (this.item.body && this.item.body.blocks.length) {
        const imgUrl = this.item.body.blocks.find(block => block.type?.value === 'image')
        return imgUrl?.data?.file?.url?.value
      }
      return 'https://placewaifu.com/image/145/105'
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
