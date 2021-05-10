<template>
  <div>
    <Header class="header" />
    <div class="wrapper">
      <nuxt />
    </div>
    <portal-target class="modal" name="modal" />
  </div>
</template>
<script>
import Header from '~/components/LayoutComponents/Header'

export default {
  components: { Header }
}
</script>

<style scoped lang="scss">
.wrapper {
  margin-top: 180px;

  @extend %container;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 3;
}
</style>
