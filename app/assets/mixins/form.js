import { mapGetters } from 'vuex'

export default {
  data: () => ({
    title: null,
    body: null,
    board: null,
    token: null
  }),
  watch: {
    body (newValue, oldValue) {
      if (oldValue !== null) {
        const newImages = newValue.blocks.filter(el => el.type === 'image' && el.data.file.url).map(el => el.data.file.url)
        const oldImages = oldValue.blocks.filter(el => el.type === 'image' && el.data.file.url).map(el => el.data.file.url)
        const unusedImages = oldImages.filter(el => !newImages.includes(el))
        unusedImages.map(el => this.$fire.storage.refFromURL(el)).forEach(ref => ref.delete())
      }
    }
  },
  computed: {
    ...mapGetters('boards', ['boards']),
    boardsList () {
      return this.boards.map(board => board.link)
    }
  },
  methods: {
    onApprove (token) {
      this.token = token
    }
  },
  async fetch ({ store }) {
    await store.dispatch('boards/fetchAndSetBoards')
  }
}
