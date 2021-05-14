<template>
  <div class="boards">
    <div class="boards__header">
      <div class="boards__column-name boards__name">
        Название
      </div>
      <div class="boards__column-name boards__desc">
        Описание
      </div>
      <div class="boards__column-name boards__count">
        Количество тредов
      </div>
    </div>
    <ul class="boards__list">
      <li
        v-for="(board, index) in boards"
        :key="index"
        class="boards__board"
        @click="$router.push(localePath({name: 'index', query: {b:board.link}}))"
      >
        <BoardCard :board="board" :color="index % 2 === 0 ? 'dark':'light'" />
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

<style scoped lang="scss">
.boards {
  &__header {
    display: flex;
    padding: 15px 2.5%;
    border-bottom: 1px solid var(--accent);
  }

  &__board {
    cursor: pointer;
  }

  &__column-name {
    font-size: 24px;
    font-weight: bold;
    line-height: 28px;
    color: var(--text);
  }

  &__name {
    flex-basis: 15%;
  }

  &__desc {
    flex-basis: 63%;
  }

  &__count {
    flex-basis: 22%;
  }

  &__list {
    margin-top: 50px;
  }
}
</style>
