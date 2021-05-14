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
import { mapGetters, mapActions } from 'vuex'
import ThreadCard from '~/components/Threads/ThreadCard'
import LoadThreads from '~/components/Threads/LoadThreads'

export default {
  name: 'Index',
  components: {
    LoadThreads,
    ThreadCard
  },
  async fetch ({ store, route }) {
    const boardLink = route.query.b
    store.commit('threads/TOGGLE_LOAD_STATE', true)
    await store.dispatch('threads/fetchAndSetThreads', { boardLink })
  },
  beforeDestroy () {
    this.unsubscribeThreads()
  },
  computed: {
    ...mapGetters('threads', ['getThreads', 'getNewThreads'])
  },
  methods: {
    ...mapActions('threads', ['unsubscribeThreads'])
  }
}
</script>

<style scoped lang="scss">
.index {
  &__load {
    margin-bottom: 140px;
  }

  &__item {
    margin-bottom: 60px;
  }
}
</style>
