<template>
  <div class="boards">
    <ul class="boards__list">
      <li v-for="(board, index) in boards" :key="index" class="boards__board">
        <BoardCard :id="board.id" :name="board.name" :desc="board.desc" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BoardCard from '~/components/Boards/BoardCard'

export default {
  name: 'Index',
  components: { BoardCard },
  async fetch ({ store }) {
    await store.dispatch('boards/fetchAndSetBoards')
  },
  computed: {
    ...mapGetters('boards', ['boards'])
  }
}
</script>
