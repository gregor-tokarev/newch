<template>
  <nuxt-link tag="div" :to="localePath({name: 'board', params: {id}})" class="board">
    <div class="board__name">
      {{ name }}
    </div>
    <div class="board__desc">
      {{ desc }}
    </div>
    <div class="board__count">
      {{ threadsCount }}
    </div>
  </nuxt-link>
</template>

<script lang="ts">
export default {
  name: 'BoardCard',
  props: {
    name: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    threadsCount: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.board {
  display: flex;
  align-items: center;
  padding: 15px 30px;

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
    flex-basis: 71%;
  }

  &__count {
    flex-basis: 14%;
    color: var(--label);
  }
}
</style>
