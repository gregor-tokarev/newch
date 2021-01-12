<template>
  <div class="track">
    <Button v-if="isOwner" @click.native="deleteTrack">
      Удалить
    </Button>
    <h1 class="form__title">{{ getTrack.title }}</h1>
    <Editor read :data="getTrack.body"></Editor>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Editor from '~/components/uicomponents/Editor'
import Button from '~/components/uicomponents/Button'

export default {
  name: 'id',
  components: { Button, Editor },
  head () {
    return {
      title: this.getTrack.title
    }
  },
  created () {
    this.redirectIfDeleted(this.getTrack)
  },
  watch: {
    getTrack (value) {
      this.redirectIfDeleted(value)
    }
  },
  async fetch ({
    store,
    route
  }) {
    await store.dispatch('tracks/fetchAndSetTrack', route.params.id)
  },
  methods: {
    ...mapActions('tracks', ['deleteTrack']),
    redirectIfDeleted (value) {
      if (value === 'die') {
        this.$router.push(this.localePath({ name: 'index' }))
      }
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
