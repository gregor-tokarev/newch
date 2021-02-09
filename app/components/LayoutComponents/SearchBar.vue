<template>
  <div class="search-bar">
    <div v-html="require('@/static/icons/search.svg?raw')" class="search-bar__icon"></div>
    <input
      ref="input"
      placeholder="Поиск"
      type="text"
      v-model="query"
      class="search-bar__input"
      @blur="blur"
      @focus="open = true"
    />
    <div class="search-bar__results" v-if="results && open">
      <SearchItem
        @click.native.stop="goToRes(item.objectID)"
        v-for="item in results"
        :key="item.objectID"
        :item="item._highlightResult"
      ></SearchItem>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite'
import SearchItem from '~/components/LayoutComponents/SearchItem'

const algoliaClient = algoliasearch('R40L3PVYP5', '0798b7c27b0d2db05ff96e12a6724485').initIndex('tracks')

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
      open: false
    }
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
    focus (event) {
      if (event.which === 191) {
        console.log(this.$refs.input)
        this.$refs.input.focus()
      }
    },
    goToRes (id) {
      this.$router.push(this.localePath({
        name: 'track-id',
        params: { id }
      }))
      this.open = false
      this.query = ''
    },
    blur () {
      setTimeout(() => {
        this.open = false
      }, 400)
    }
  },
  watch: {
    query: 'search'
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

  &__icon {
    margin-right: 5px;

    ::v-deep svg {
      fill: var(--bg-dark);
    }
  }

  &__results {
    position: absolute;
    top: 100%;
    right: 0;
    bottom: 0;
    left: 0;
    //display: none;
  }

  &__input {
    display: block;
    width: 100%;
    font-size: 14px;
    color: var(--bg-dark);
    background-color: transparent;
    border: none;
    outline: none;

    //&:focus + .search-bar__results {
    //  display: block;
    //}
  }
}
</style>
