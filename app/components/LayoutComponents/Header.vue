<template>
  <div class="header">
    <div class="header__wrapper">
      <nuxt-link :to="localePath({ name: 'index' })">
        <Logo></Logo>
      </nuxt-link>
      <SearchBar class="header__search"></SearchBar>
      <nuxt-link prefetch :to="localePath({ name: 'form-create-track' })">
        <Button>{{ $t('layout.createTread') }}</Button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import SearchBar from '~/components/LayoutComponents/SearchBar'
import Button from '~/components/uicomponents/Button'
import Logo from '~/components/LayoutComponents/Logo'

export default {
  name: 'Header',
  components: {
    Logo,
    Button,
    SearchBar
  }
}
</script>

<style scoped lang="scss">
.header {
  padding: 30px 0 10px;
  background-color: var(--bg-dark);

  &__search {
    flex-basis: 50%;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @extend %container;
  }
}
</style>
