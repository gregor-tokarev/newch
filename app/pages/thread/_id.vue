<template>
  <div class="track">
    <h1 class="form__title">
      {{ getThread.title }}
    </h1>
    <div class="track__body">
      <div class="track__right-sidebar">
        <div v-if="isOwner" class="track__sticky">
          <div class="track__icon" @click="open = true" v-html="require('@/static/icons/trash.svg?raw')">
            {{ $t('actions.delete') }}
          </div>
          <br>
          <nuxt-link
            class="track__icon"
            :to="localePath({ name: 'form-edit-id', params: { id: getThread.id } })"
            v-html="require('@/static/icons/edit.svg?raw')"
          />
        </div>
      </div>
      <Editor class="track__editor" read :data="getThread.body || { blocks: [] }" />
    </div>
    <Button
      large
      class="track__reply"
      @click.native="$router.push(localePath({name: 'form-create-trad-comment', params: {trad: $route.params.id}}))"
    >
      Ответить в тред
    </Button>
    <CommentCard
      v-for="(comment, index) in getComments"
      :key="index"
      :comment="comment"
      class="track__comment"
    />
    <DeleteTrad v-if="open" @click:outside="open = false" @close="open = false" />
    <slide-x-right-transition>
      <nuxt-child />
    </slide-x-right-transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { SlideXRightTransition } from 'vue2-transitions'
import Editor from '~/components/uicomponents/Editor'
import Button from '~/components/uicomponents/Button'
import DeleteTrad from '~/components/Modals/DeleteTrad'
import CommentCard from '~/components/CommentComponenets/CommentCard'

export default {
  name: 'Id',
  components: {
    CommentCard,
    DeleteTrad,
    Button,
    SlideXRightTransition,
    Editor
  },
  async fetch ({
    store,
    route
  }) {
    await store.dispatch('threads/fetchAndSetThread', route.params.id)
  },
  data: () => ({
    open: false
  }),
  watch: {
    getTrack (value) {
      this.redirectIfDeleted(value)
    }
  },
  created () {
    this.redirectIfDeleted(this.getThread)
  },
  beforeDestroy () {
    this.unsubscribeThread()
  },
  head () {
    return {
      title: this.getThread.title
    }
  },
  methods: {
    ...mapActions('threads', ['deleteThread', 'unsubscribeThread']),
    redirectIfDeleted (value) {
      if (value === 'die') {
        this.$router.push(this.localePath({ name: 'index' }))
      }
    }
  },
  computed: {
    ...mapGetters('threads', ['getThread', 'getComments']),
    isOwner () {
      return this.getThread.creator === this.$user.uid
    }
  }
}
</script>

<style scoped lang="scss">
.track {
  position: relative;

  &__body {
    position: relative;
    display: flex;
    justify-content: center;
  }

  &__right-sidebar {
    margin-right: 30px;
  }

  &__comment {
    margin-bottom: 90px;
  }

  &__reply {
    display: table;
    margin: 0 0 120px;
  }

  &__icon {
    width: 15px;
    height: 15px;
    cursor: pointer;

    ::v-deep {
      svg,
      path {
        fill: var(--accent) !important;
      }
    }
  }

  &__sticky {
    position: sticky;
    top: 20px;
  }
}
</style>
