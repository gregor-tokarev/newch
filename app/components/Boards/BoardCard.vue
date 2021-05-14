<template>
  <div
    :class="{
      'board--light': color === 'light'
    }"
    class="board"
  >
    <div class="board__name">
      {{ board.name }}
    </div>
    <div class="board__desc">
      {{ board.desc }}
    </div>
    <div class="board__count">
      {{ board.threadsCount }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BoardCard',
  props: {
    board: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: 'dark'
    }
  }
})
</script>

<style scoped lang="scss">
.board {
  display: flex;
  align-items: center;
  padding: 15px 2.5%;

  &--light {
    background-color: var(--bg);
  }

  &__name,
  &__desc,
  &__count {
    color: var(--text);

    @include button;
  }

  &__name {
    flex-basis: 15%;
  }

  &__desc {
    flex-basis: 63%;
  }

  &__count {
    flex-basis: 22%;
    color: var(--label);
  }
}
</style>
