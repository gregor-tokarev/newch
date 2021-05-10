export const state = () => ({
  threadComments: [],
  comment: {},
  childComments: [],
  parentsPath: []
})

export const mutations = {
  SET_COMMENT (state, comment) {
    state.comment = comment
  },
  SET_CHILD_COMMENTS (state, comments) {
    state.childComments = comments
  },
  SET_PARENT_PATH (state, comments) {
    state.parentsPath = comments
  }
}

export const actions = {
  async fetchComment ({ commit }, {
    threadId,
    commentId
  }) {
    const tradRef = this.$fire.firestore.collection('threads').doc(threadId)
    const commentRef = tradRef.collection('comments').doc(commentId)
    const comment = await commentRef.get()
    const commentData = { id: comment.id, ...comment.data() }
    commit('SET_COMMENT', commentData)
  },
  fetchChildComments ({ commit }, {
    threadId,
    commentId
  }) {
    const tradRef = this.$fire.firestore.collection('threads').doc(threadId)
    const commentsRef = tradRef.collection('comments').where('parent', '==', commentId)
    return new Promise((resolve) => {
      commentsRef.onSnapshot((snapshot) => {
        const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        commit('SET_CHILD_COMMENTS', comments)
        resolve()
      })
    })
  },
  async fetchParentsPath ({ commit }, {
    threadId,
    commentId
  }) {
    const tradRef = this.$fire.firestore.collection('threads').doc(threadId)
    const path = await getParentPathCont(tradRef, commentId)
    commit('SET_PARENT_PATH', path)
  }
}

export const getters = {
  comment (state) {
    return JSON.parse(JSON.stringify(state.comment))
  },
  getChildComments (state) {
    return JSON.parse(JSON.stringify(state.childComments))
  },
  getPath (state) {
    return JSON.parse(JSON.stringify(state.parentsPath))
  }
}

function getParentPathCont (tradRef, commentId) {
  const arr = []

  async function getParentPath (tradRef, commentId) {
    const comment = await tradRef.collection('comments').doc(commentId).get()
    const commentData = comment.data()
    if (!('parent' in commentData)) {
      arr.unshift({ id: comment.id, ...commentData })
      return arr
    }
    arr.unshift({ id: comment.id, ...commentData })
    return getParentPath(tradRef, commentData.parent)
  }

  return getParentPath(tradRef, commentId)
}
