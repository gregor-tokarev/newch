<template>
  <div class="thread">
    <!--    <div v-if="!show" class="thread__overlay" v-html="require('@/static/icons/loader.svg?raw')" />-->
    <div class="thread__header">
      <h1 class="thread__title">
        <nuxt-link :to="localePath({ name: 'thread-id', params: { id } })">
          {{ title }}
        </nuxt-link>
      </h1>
      <div class="thread__stats">
        <div class="thread__board">
          /{{ board }}
        </div>
        <div class="thread__info">
          <div class="thread__created">
            {{ fromNow }}
          </div>
          <div class="thread__count">
            {{ commentsCount }} {{ $t('indexPage.comments') }}{{ ending2(commentsCount, $i18n.locale) }}
          </div>
        </div>
      </div>
    </div>
    <div class="thread__body">
      <div class="thread__desc" :class="{'thread__desc--open': show}">
        <Editor read :data="desc" :padding-bottom="0" />
        <div v-if="!show" class="thread__blur" />
      </div>
    </div>

    <div class="thread__open" @click="show = !show">
      {{ !show ? 'Показать все' : 'Свернуть' }}
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/ru'
import ending2 from '~/assets/js/ending2'
import Editor from '~/components/uicomponents/Editor'

export default {
  name: 'ThreadCard',
  components: { Editor },
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
    ending2,
    setLoaded () {
      setImmediate(() => {
        this.show = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
.thread {
  position: relative;
  padding: 10px 20px;
  color: var(--text);
  background-color: var(--bg);

  //&__overlay {
  //  position: absolute;
  //  top: 0;
  //  right: 0;
  //  bottom: 0;
  //  left: 0;
  //  display: flex;
  //  align-items: center;
  //  justify-content: center;
  //  background-color: var(--bg);
  //}

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  &__img {
    flex-shrink: 1;

    img {
      max-height: 205px;
      object-position: top;
      object-fit: cover;
    }
  }

  &__blur {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    height: 20px;
    background-image: linear-gradient(transparent, var(--bg));
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__open {
    color: var(--accent);
    cursor: pointer;
  }

  &__title {
    font-weight: normal;
    color: #f1f1f1;

    @include title-light;

    a {
      color: var(--text);
      text-decoration: underline;
    }
  }

  &__desc {
    position: relative;
    max-height: 100px;
    overflow-y: hidden;

    @include button;

    &--open {
      max-height: unset;
    }
  }

  &__link {
    display: block;

    @include button;
  }

  &__stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__board {
    margin-right: 20px;
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
