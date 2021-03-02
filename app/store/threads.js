import Vue from 'vue'

const state = () => ({
  threads: [],
  newThreads: [],
  comments: [],
  thread: {},
  firstLoad: true,
  unsubscribeIndexPage: null,
  unsubscribeThread: null
})

const mutations = {
  SET_UNSUBSCRIBE_INDEX (state, fn) {
    state.unsubscribeIndexPage = fn
  },
  UNSUBSCRIBE_INDEX (state) {
    state.unsubscribeIndexPage && state.unsubscribeIndexPage()
    state.threads = []
    state.newThreads = []
  },
  SET_UNSUBSCRIBE_THREAD (state, fn) {
    state.unsubscribeThread = fn
  },
  UNSUBSCRIBE_THREAD (state) {
    state.unsubscribeThread && state.unsubscribeThread()
  },

  SET_THREADS (state, threads) {
    state.threads = threads
  },
  ADD_THREAD (state, thread) {
    state.threads.push(thread)
  },
  EDIT_THREAD (state, {
    threadId,
    thread
  }) {
    const threadNewIndex = state.threads.findIndex(thread => thread.id === threadId)
    if (threadNewIndex !== -1) {
      Vue.set(state.threads, threadNewIndex, thread)
    } else {
      const threadIndexNew = state.newThreads.findIndex(thread => thread.id === threadId)
      Vue.set(state.newThreads, threadIndexNew, thread)
    }
  },
  REMOVE_THREAD (state, threadId) {
    const threadIndex = state.threads.findIndex(thread => thread.id === threadId)
    if (threadIndex !== -1) {
      state.threads.splice(threadIndex, 1)
    } else {
      const threadNewIndex = state.newThreads.findIndex(thread => thread.id === threadId)
      state.newThreads.splice(threadNewIndex, 1)
    }
  },
  SET_NEW_THREADS (state, thread) {
    const threadId = thread.id
    const cond = !state.threads.some(thread => thread.id === threadId)
    if (cond) {
      state.newThreads.push(thread)
    }
  },
  LOAD_THREADS (state) {
    state.threads = state.threads.concat(state.threads)
    state.newThreads = []
  },
  SET_THREAD (state, thread) {
    state.thread = thread
  },
  ADD_COMMENTS (state, comments) {
    state.comments = comments
  },
  CLEAR_THREAD (state) {
    state.thread = {}
  },

  TOGGLE_LOAD_STATE (state, value) {
    state.firstLoad = value ?? !state.firstLoad
  }
}

const actions = {
  fetchAndSetThreads ({
    commit,
    state
  }) {
    const unsubscribe = this.$fire.firestore
      .collection('threads')
      .orderBy('created', 'desc')
      .limit(2)
      .onSnapshot((snapshot) => {
        if (!state.firstLoad) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'modified') {
              commit('EDIT_THREAD', {
                threadId: change.doc.id,
                thread: {
                  id: change.doc.id,
                  ...change.doc.data()
                }
              })
            } else if (change.type === 'removed') {
              commit('REMOVE_THREAD', change.doc.id)
            } else if (change.type === 'added') {
              const newThread = {
                ...change.doc.data(),
                id: change.doc.id
              }
              commit('SET_NEW_THREADS', newThread)
            }
          })
        }
      })
    commit('SET_UNSUBSCRIBE_INDEX', unsubscribe)
    return new Promise((resolve) => {
      const promise = this.$fire.firestore
        .collection('threads')
        .orderBy('created', 'desc')
        .get()
      resolve(promise)
    })
      .then((threads) => {
        const addThreads = threads.docs.map(thread => ({
          id: thread.id,
          ...thread.data()
        }))
        commit('SET_THREADS', addThreads)
        commit('TOGGLE_LOAD_STATE', false)
      })
  },
  unsubscribeThreads ({ commit }) {
    commit('UNSUBSCRIBE_INDEX')
  },
  unsubscribeThread ({ commit }) {
    commit('UNSUBSCRIBE_THREAD')
  },
  fetchAndSetThread ({
    commit
  }, id) {
    return new Promise((resolve) => {
      const documentReference = this.$fire.firestore.collection('threads').doc(id)
      const unsubscribeThread = documentReference.onSnapshot((query) => {
        const thread = {
          ...query.data(),
          id: query.id
        }
        if (Object.keys(thread).length < 2) {
          commit('SET_THREAD', null)
        } else {
          commit('SET_THREAD', thread)
        }
        resolve()
      })
      documentReference.collection('comments').where('isNested', '==', false).onSnapshot((query) => {
        const comments = query.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        commit('ADD_COMMENTS', comments)
      })
      commit('SET_UNSUBSCRIBE_THREAD', unsubscribeThread)
    })
  },
  async deleteThread ({
    commit,
    getters
  }) {
    const id = getters.getThread.id

    const threadRef = this.$fire.firestore.collection('threads').doc(id)
    await threadRef.delete()
    commit('CLEAR_THREAD')
  },
  loadThreads ({ commit }) {
    commit('LOAD_THREADS')
  }
}

const getters = {
  getThreads (state) {
    let threads = JSON.parse(JSON.stringify(state.threads))
    threads = threads.map((thread) => {
      if (thread.body && thread.body.blocks.length) {
        const imgUrl = thread.body.blocks.find(block => block.type === 'image')
        return {
          ...thread,
          imgUrl: imgUrl?.data?.file?.url
        }
      }
      return thread
    })
    return threads
  },
  getNewThreads (state) {
    return JSON.parse(JSON.stringify(state.newThreads))
  },
  getThread (state) {
    return JSON.parse(JSON.stringify(state.thread || 'die'))
  },
  getComments (state) {
    return JSON.parse(JSON.stringify(state.comments))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
