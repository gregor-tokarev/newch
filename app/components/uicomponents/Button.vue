<template>
  <div :class="{ 'button--large': large }" class="button" v-on="$listeners">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    large: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.button {
  display: inline-block;
  padding: 5px 35px;
  color: var(--text);
  cursor: pointer;
  user-select: none;
  background-color: var(--accent);
  border-radius: 3px;
  transition: background-color 0.4s;

  @include button;

  &:hover {
    background-color: var(--accent-hover);
  }

  &--large {
    padding: 15px 85px;

    @include title-light;
  }
}
</style>
