const state = () => ({
  boards: null
})

const mutations = {
  SET_BOARDS (state, boards) {
    state.boards = boards
  }
}

const actions = {
  async fetchAndSetBoards ({ commit }) {
    const collectionReference = this.$fire.firestore.collection('boards')
    let boards = await collectionReference.orderBy('threadsCount', 'desc').get()
    boards = boards.docs.map(board => ({
      ...board.data(),
      id: board.id
    }))
    commit('SET_BOARDS', boards)
  },
  async fetchBoardsForIndex ({ commit }) {
    const collectionReference = this.$fire.firestore.collection('boards')
    let boards = await collectionReference.orderBy('threadsCount', 'desc').limit(10).get()
    boards = boards.docs.map(board => ({
      ...board.data(),
      id: board.id
    }))
    commit('SET_BOARDS', boards)
  }
}

const getters = {
  boards (state) {
    return JSON.parse(JSON.stringify(state.boards))
  }
}

export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
}
