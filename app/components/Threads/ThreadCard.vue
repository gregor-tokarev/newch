<template>
  <div class="track">
    <div v-if="!show" class="track__overlay" v-html="require('@/static/icons/loader.svg?raw')" />
    <template>
      <nuxt-link :to="localePath({ name: 'threads-id', params: { id } })">
        <div class="track__img">
          <img :src="imgUrl" :alt="title" @load="setLoaded">
        </div>
      </nuxt-link>
      <div class="track__body">
        <h1 class="track__title">
          <nuxt-link :to="localePath({ name: 'thread-id', params: { id } })">
            {{ title }}
          </nuxt-link>
        </h1>
        <p class="track__desc">
          {{ text }}
        </p>
        <div class="track__footer">
          <div class="track__board">
            /{{ board }}
          </div>
          <div class="track__info">
            <div class="track__created">
              {{ fromNow }}
            </div>
            <div class="track__count">
              {{ commentsCount }} {{ $t('indexPage.comments') }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
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
      if (this.desc) {
        for (const value of this.desc.blocks) {
          if (value.type === 'paragraph') {
            text = value.data.text
          }
        }
      }
      return text
    },
    fromNow () {
      const locale = this.$i18n.locale
      return moment(this.created).locale(locale).fromNow()
    }
  },
  methods: {
    setLoaded () {
      setImmediate(() => {
        this.show = true
      })
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
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg);
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
    font-weight: normal;
    color: #f1f1f1;

    @include title-light;

    a {
      color: var(--text);
      text-decoration: underline;
    }
  }

  &__desc {
    word-break: break-all;

    @include button;
  }

  &__link {
    display: block;

    @include button;
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

    @include button;
  }

  &__info {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: normal;
    line-height: 16px;
    color: #b1b1b1;

    @include button;
  }

  &__created {
    margin-right: 25px;

    @include button;
  }
}
</style>
