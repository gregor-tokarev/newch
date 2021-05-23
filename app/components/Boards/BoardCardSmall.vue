<template>
  <div
    class="card"
    :class="{
      'card--light': color === 'light'
    }"
  >
    <div class="card__header">
      <nuxt-link tag="div" :to="localePath({name: 'index', query: {b: board.link}})" class="card__link">
        /{{ board.link }}
      </nuxt-link>
      <div class="card__name">
        {{ board.name }}
      </div>
      <div class="card__threads-count">
        Посты: {{ board.threadsCount }}
      </div>
    </div>
    <div class="card__desc">
      {{ board.desc }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BoardCardSmall',
  props: {
    color: {
      type: String,
      default: 'dark'
    },
    board: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  padding: 15px 30px 30px;
  cursor: pointer;

  &--light {
    background-color: var(--bg);
  }

  &__header {
    display: flex;
    color: var(--text);
  }

  &__link {
    margin-right: 15px;
    color: var(--accent);
  }

  &__threads-count {
    margin-left: auto;
  }

  &__desc {
    margin-top: 10px;
    color: var(--label);
    text-align: center;
  }
}
</style>
