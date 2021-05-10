import { mapGetters } from 'vuex'

export default {
  data: () => ({
    title: null,
    body: '',
    board: null,
    token: null
  }),
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
