<template>
  <div v-click-outside="() => open = false" class="select">
    <div :class="{ 'select__value--open': open }" class="select__value">
      <input
        ref="input"
        v-model="filterString"
        class="select__selected-value"
        @keydown.down.up.prevent
        @keyup.enter="setValue(filterList[focusedItemIndex] || filterString)"
      >
      <div class="select__icon" @click.stop="selectClick" v-html="require('@/static/icons/arrow.svg?raw')" />
    </div>
    <ul v-if="open" class="select__choose">
      <template v-if="filterList.length">
        <li
          v-for="(item, index) in filterList"
          ref="items"
          :key="index"
          class="select__item"
          :class="{ 'select__item--focused': index === focusedItemIndex }"
          @click="setValue(item)"
          @keyup.down.prevent="switchFocus('increment')"
        >
          {{ item }}
        </li>
      </template>
      <li v-else class="select__404">
        Ничего нет
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SelectSearch',
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    openDefault: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      focusedItemIndex: -1,
      filterString: this.value,
      open: this.openDefault
    }
  },
  computed: {
    filterList () {
      const list = !this.filterString ? this.list : this.list.filter(item => item.includes(this.filterString))
      return list
    }
  },
  watch: {
    filterString (value) {
      if (value !== '' && this.focusedItemIndex === -1) {
        this.open = true
      }
    }
  },
  mounted () {
    window.addEventListener('keydown', (event) => {
      if (this.open && document.activeElement === this.$refs.input) {
        if (event.key === 'ArrowDown' && this.focusedItemIndex < this.filterList.length - 1) {
          event.preventDefault()
          this.switchFocus('increment')
        } else if (event.key === 'ArrowUp' && this.focusedItemIndex !== 0) {
          event.preventDefault()
          this.switchFocus('decrement')
        }
      }
    })
  },
  methods: {
    switchFocus (direction) {
      if (direction === 'increment') {
        this.focusedItemIndex++
      } else if (direction === 'decrement') {
        this.focusedItemIndex--
      }
    },
    selectClick () {
      this.open = !this.open
      this.filterString = ''
    },
    setValue (value) {
      this.filterString = value
      this.$emit('change', value)
      this.$refs.input.blur()

      this.focusedItemIndex = -1
      // eslint-disable-next-line no-return-assign
      setImmediate(() => this.open = false)
    }
  }
}
</script>

<style scoped lang="scss">
.select {
  position: relative;

  &__value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    background-color: var(--text);
    border-radius: 15px;

    &--open {
      border-radius: 15px 15px 0 0;
    }
  }

  &__selected-value {
    @include button;
  }

  &__404 {
    padding: 5px 10px;
  }

  &__item {
    padding: 5px 10px;
    cursor: pointer;

    @include button;

    &--focused {
      background-color: #c9c9c9;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 20px;
    cursor: pointer;
    transform: scale(1.5);

    ::v-deep svg {
      transform: scale(0.5);
    }
  }

  &__choose {
    position: absolute;
    right: 0;
    left: 0;
    max-height: 200px;
    overflow-y: auto;
    background-color: var(--text);
  }
}
</style>
