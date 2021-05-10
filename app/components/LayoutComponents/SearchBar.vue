<template>
  <div class="search-bar" :class="{ 'search-bar--active': shown }">
    <div class="search-bar__icon" v-html="require('@/static/icons/search.svg?raw')" />
    <input
      ref="input"
      v-model="query"
      :placeholder="$t('layout.searchPlaceholder')"
      type="text"
      class="search-bar__input"
      @keyup.up.prevent="changeSelectedIndex('up')"
      @keyup.down.prevent="changeSelectedIndex('down')"
      @keyup.enter="results.length && goToRes(results[selectedIndex === -1 ? 0 : selectedIndex].objectID)"
      @blur="blur"
      @focus="open = true"
    >
    <div v-if="shown" class="search-bar__results">
      <SearchItem
        v-for="(item, index) in results"
        :key="item.objectID"
        :class="{ 'search-bar__item--active': index === selectedIndex }"
        :item="item"
        @click.native.stop="goToRes(item.objectID)"
      />
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite'
import SearchItem from '~/components/LayoutComponents/SearchItem'

const algoliaClient = algoliasearch('R40L3PVYP5', '0798b7c27b0d2db05ff96e12a6724485').initIndex('threads')

const searchClient = {
  search (query) {
    if (query === '') {
      return
    }
    return algoliaClient.search(query)
  }
}

export default {
  name: 'SearchBar',
  components: { SearchItem },
  data () {
    return {
      query: '',
      searchClient,
      results: [],
      open: false,
      selectedIndex: -1
    }
  },
  computed: {
    shown () {
      return this.results &&
        this.results.length
      // this.open
    }
  },
  watch: {
    query: 'search'
  },
  mounted () {
    window.addEventListener('keyup', this.focus)
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.focus)
  },
  methods: {
    async search () {
      const results = await this.searchClient.search(this.query)
      this.results = results?.hits ?? []
      this.open = true
    },
    changeSelectedIndex (direction) {
      if (direction === 'up' && this.selectedIndex > 0) {
        this.selectedIndex--
      } else if (direction === 'down' && this.results.length - 1 > this.selectedIndex) {
        this.selectedIndex++
      }
    },
    focus (event) {
      if (event.which === 191) {
        this.$refs.input.focus()
      }
    },
    goToRes (id) {
      if (!id) { return }
      this.$router.push(this.localePath({
        name: 'thread-id',
        params: { id }
      }))
      this.open = false
      this.query = ''
      this.selectedIndex = -1
    },
    blur () {
      setTimeout(() => {
        this.open = false
      }, 400)
    }
  }
}
</script>

<style scoped lang="scss">
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: var(--bg-dark);
  background-color: var(--text);
  border-radius: 10px;

  &__results {
    position: absolute;
    top: 100%;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &--active {
    border-radius: 10px 10px 0 0;

    .search-bar__results {
      border-top: 1px solid var(--bg-dark);
    }
  }

  &__icon {
    margin-right: 10px;

    ::v-deep svg {
      fill: var(--bg-dark);
    }
  }

  &__item {
    &--active {
      background-color: var(--bg);
    }
  }

  &__input {
    display: block;
    width: 100%;
    color: var(--bg-dark);
    background-color: transparent;
    border: none;
    outline: none;

    @include button;
    //&:focus + .search-bar__results {
    //  display: block;
    //}
  }
}
</style>
