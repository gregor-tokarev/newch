<template>
  <div class="search-bar">
    <div v-html="require('~/static/icons/search.svg')" class="search-bar__icon"></div>
    <input placeholder="Поиск" type="text" v-on="$listeners" v-bind="$attrs" class="search-bar__input"/>
  </div>
</template>

<script>
export default {
  name: 'SearchBar'
}
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: $bg-dark;
  background-color: $text;
  border-radius: 10px;

  &__icon {
    margin-right: 5px;

    ::v-deep svg {
      fill: $bg-dark;
    }
  }

  &__input {
    display: block;
    width: 100%;
    font-size: 14px;
    color: $bg-dark;
    background-color: transparent;
    border: none;
    outline: none;
  }
}
</style>
