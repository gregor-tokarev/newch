<template>
  <div>
    <Header></Header>
    <div class="wrapper">
      <nuxt/>
    </div>
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
  @extend %container;
}
</style>
