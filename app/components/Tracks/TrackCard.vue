<template>
  <div class="track">
    <div class="track__img">
      <img :src="imgUrl" :alt="title">
    </div>
    <div class="track__body">
      <h1 class="track__title">{{ title }}</h1>
      <p class="track__desc">{{ text }}</p>
      <div class="track__footer">
        <div class="track__board">/{{ board }}</div>
        <div class="track__info">
          <div class="track__created">{{ created.getTime() }}</div>
          <div class="track__count">{{ commentsCount }}</div>
          комментариев
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrackCard',
  props: {
    imgUrl: {
      type: String,
      default: 'https://picsum.photos/295/210'
    },
    title: {
      type: String,
      default: 'Untitled'
    },
    desc: {
      type: String,
      default: 'Автор скуп на буквы'
    },
    board: {
      type: String,
      default: 'dsf'
    },
    created: {
      type: Date,
      default: new Date()
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    maxDescLength: {
      type: Number,
      default: 1000
    }
  },
  computed: {
    text () {
      let text = this.desc
      if (text.length > this.maxDescLength) {
        text = text.slice(0, this.maxDescLength)
        text += '...'
      }
      return text
    }
  }
}
</script>

<style scoped lang="scss">
.track {
  display: flex;
  color: $text;

  &__img {
    min-width: 295px;
    object-fit: cover;
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 1.5%;
  }

  &__title {
    margin-bottom: 30px;
    font-size: 28px;
    font-weight: normal;
    line-height: 33px;
    color: #f1f1f1;
  }

  &__desc {
    word-break: break-all;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  &__board {
    color: $accent;
    cursor: pointer;
  }

  &__info {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: normal;
    line-height: 16px;
    color: #b1b1b1;
  }

  &__created {
    margin-right: 25px;
  }
}
</style>
