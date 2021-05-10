<template>
  <div class="index">
    <LoadThreads v-if="getNewThreads.length" class="index__load" />
    <ThreadCard
      v-for="(thread, index) in getThreads"
      :id="thread.id"
      :key="index"
      class="index__item"
      :created="thread.lastUpdate"
      :max-desc-length="50000"
      :desc="thread.body"
      :img-url="thread.imgUrl"
      :title="thread.title"
      :board="thread.board"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  async fetch ({ store }) {
    await store.dispatch('threads/fetchAndSetThreads')
  },
  beforeDestroy () {
    this.unsubscribeThread()
  },
  computed: {
    ...mapGetters('threads', ['getThreads', 'getNewThreads'])
  }
}
</script>
