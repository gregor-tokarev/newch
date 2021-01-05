<template>
  <div class="header">
    <div class="header__wrapper">
      <Logo></Logo>
      <SearchBar class="header__search"></SearchBar>
      <Button>Создать тред</Button>
    </div>
  </div>
</template>

<script>
import SearchBar from '~/components/uicomponents/SearchBar'
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
  background-color: $bg-dark;

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
