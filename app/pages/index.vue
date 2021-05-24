<template>
  <div class="page">
    <div class="page__content">
      <main class="page__main">
        <LoadThreads v-if="getNewThreads.length" class="page__load" />
        <ThreadCard
          v-for="(thread) in getThreads"
          :id="thread.id"
          :key="thread.id"
          class="page__item"
          :created="thread.lastUpdate"
          :max-desc-length="50000"
          :desc="thread.body"
          :img-url="thread.imgUrl"
          :comments-count="thread.commentsCount"
          :title="thread.title"
          :board="thread.board"
        />
      </main>
      <aside class="page__aside">
        <nuxt-link tag="div" :to="localePath({name: 'boards'})" class="page__boards">
          Все доски
        </nuxt-link>

        <BoardCardSmall
          v-for="(board, index) in boards"
          :key="board.id"
          :color="index % 2 !== 0 ? 'dark' : 'light'"
          :board="board"
        />
      </aside>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ThreadCard from '~/components/Threads/ThreadCard'
import LoadThreads from '~/components/Threads/LoadThreads'
import BoardCardSmall from '~/components/Boards/BoardCardSmall'

export default {
  name: 'Index',
  components: {
    BoardCardSmall,
    LoadThreads,
    ThreadCard
  },
  watchQuery: ['b', 'qeruy'],
  async fetch ({
    store,
    route
  }) {
    const boardLink = route.query.b
    store.commit('threads/TOGGLE_LOAD_STATE', true)
    await Promise.all([
      store.dispatch('boards/fetchBoardsForIndex'),
      store.dispatch('threads/fetchAndSetThreads', { boardLink })
    ])
  },
  beforeDestroy () {
    this.unsubscribeThreads()
  },
  computed: {
    ...mapGetters('threads', ['getThreads', 'getNewThreads']),
    ...mapGetters('boards', ['boards'])
  },
  methods: {
    ...mapActions('threads', ['unsubscribeThreads'])
  }
}
</script>

<style scoped lang="scss">
.page {
  &__content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__main {
    flex-basis: 65%;
  }

  &__load {
    margin-bottom: 140px;
  }

  &__item {
    margin-bottom: 60px;
  }

  &__aside {
    flex-basis: 27%;
  }

  &__boards {
    margin-bottom: 45px;
    font-size: 24px;
    line-height: 28px;
    color: var(--accent);
    text-align: center;
    cursor: pointer;
  }
}
</style>
