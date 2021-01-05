<template functional>
  <div class="button">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'Button'
}
</script>

<style scoped lang="scss">
.button {
  padding: 5px 35px;
  font-size: 14px;
  color: $text;
  cursor: pointer;
  background-color: $accent;
  border-radius: 3px;
  transition: background-color 0.4s;

  &:hover {
    background-color: $accent-hover;
  }
}
</style>
