<template>
  <nuxt-link class="track__link" prefetch :to="localePath({ name: 'track-id', params: { id } })">
    <div class="track">
      <div class="track__overlay" v-if="!show"></div>
      <div class="track__img">
        <img :src="imgUrl" @load="show = true" :alt="title">
      </div>
      <div class="track__body">
        <h1 class="track__title">{{ title }}</h1>
        <p class="track__desc">{{ text }}</p>
        <div class="track__footer">
          <div class="track__board">/{{ board }}</div>
          <div class="track__info">
            <div class="track__created">{{ fromNow }}</div>
            <div class="track__count">{{ commentsCount }} комментариев</div>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import moment from 'moment'
import 'moment/locale/ru'

export default {
  name: 'TrackCard',
  data: () => ({
    show: false
  }),
  props: {
    id: {
      type: String,
      require: true
    },
    imgUrl: {
      type: String,
      default: 'https://placewaifu.com/image/145/105'
    },
    title: {
      type: String,
      default: 'Без названия'
    },
    desc: {
      type: Object,
      default: () => ({
        time: Date.now(),
        version: '2.19.1',
        blocks: []
      })
    },
    board: {
      type: String,
      default: 'b'
    },
    created: {
      type: [String, Number],
      default: moment.now()
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
      let text
      if (this.desc !== null) {
        for (const value of this.desc.blocks) {
          if (value.type === 'paragraph') {
            text = value.data.text
          }
        }
      }
      return text
    },
    fromNow () {
      return moment(this.created).locale('ru').fromNow()
    }
  }
}
</script>

<style scoped lang="scss">
.track {
  position: relative;
  display: flex;
  color: var(--text);

  &__overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--text);
  }

  &__img {
    flex-shrink: 1;

    img {
      max-height: 205px;
      object-position: top;
      object-fit: cover;
    }
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

  &__link {
    display: block;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  &__board {
    color: var(--accent);
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
