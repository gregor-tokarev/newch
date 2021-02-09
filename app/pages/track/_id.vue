<template>
  <div class="track">
    <h1 class="form__title">
      {{ getTrack.title }}
    </h1>
    <div class="track__body">
      <div class="track__right-sidebar">
        <div v-if="isOwner" class="track__sticky">
          <div class="track__icon" @click="deleteTrackMethod" v-html="require('@/static/icons/trash.svg?raw')">
            {{ $t('actions.delete') }}
          </div>
          <br>
          <nuxt-link
            class="track__icon"
            :to="localePath({ name: 'form-edit-id', params: { id: getTrack.id } })"
            v-html="require('@/static/icons/edit.svg?raw')"
          />
        </div>
      </div>
      <Editor class="track__editor" read :data="getTrack.body || { blocks: [] }"/>
    </div>
    <Button large>Ответить в тред</Button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Editor from '~/components/uicomponents/Editor'
import Button from '~/components/uicomponents/Button'

export default {
  name: 'Id',
  components: {
    Button,
    Editor
  },
  async fetch ({
    store,
    route
  }) {
    await store.dispatch('tracks/fetchAndSetTrack', route.params.id)
  },
  watch: {
    getTrack (value) {
      this.redirectIfDeleted(value)
    }
  },
  created () {
    this.redirectIfDeleted(this.getTrack)
  },
  beforeDestroy () {
    this.unsubscribeTrack()
  },
  head () {
    return {
      title: this.getTrack.title
    }
  },
  methods: {
    ...mapActions('tracks', ['deleteTrack', 'unsubscribeTrack']),
    redirectIfDeleted (value) {
      if (value === 'die') {
        this.$router.push(this.localePath({ name: 'index' }))
      }
    },
    async deleteTrackMethod () {
      await this.deleteTrack()
      this.$router.replace(this.localePath({ name: 'form-create-track' }))
    }
  },
  computed: {
    ...mapGetters('tracks', ['getTrack']),
    isOwner () {
      return this.getTrack.creator === this.$user.uid
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

  &__editor {
    width: 750px;
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
