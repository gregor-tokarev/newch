<template>
  <div class="load" @click="loadThreads">
    <div class="load__icon" v-html="require('@/static/icons/loaderArrow.svg?raw')" />
    {{ $t('indexPage.loadThreads') }}
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoadThreads',
  methods: {
    ...mapActions('threads', ['loadThreads'])
  }
}
</script>

<style scoped lang="scss">
.load {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 14px;
  color: var(--accent);
  cursor: pointer;
  background-color: var(--bg);
  transition: all 0.4s;

  &__icon {
    margin-right: 10px;

    ::v-deep * {
      transition: fill 0.4s;
    }
  }

  &:hover {
    color: var(--accent-hover);

    .load__icon {
      ::v-deep * {
        fill: var(--accent-hover);
      }
    }
  }
}
</style>
