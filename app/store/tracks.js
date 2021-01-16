import Vue from 'vue'

const state = () => ({
  tracks: [],
  newTracks: [],
  track: {},
  firstLoad: true,
  unsubscribeIndexPage: null,
  unsubscribeTrack: null
})

const mutations = {
  SET_UNSUBSCRIBE_INDEX (state, fn) {
    state.unsubscribeIndexPage = fn
  },
  UNSUBSCRIBE_INDEX (state) {
    state.unsubscribeIndexPage && state.unsubscribeIndexPage()
    state.tracks = []
    state.newTracks = []
  },
  SET_UNSUBSCRIBE_TRACK (state, fn) {
    state.unsubscribeTrack = fn
  },
  UNSUBSCRIBE_TRACK (state) {
    state.unsubscribeTrack && state.unsubscribeTrack()
  },

  SET_TRACKS (state, tracks) {
    state.tracks = tracks
  },
  ADD_TRACK (state, track) {
    state.tracks.push(track)
  },
  EDIT_TRACK (state, {
    trackId,
    track
  }) {
    const trackIndex = state.tracks.findIndex(track => track.id === trackId)
    if (trackIndex !== -1) {
      Vue.set(state.tracks, trackIndex, track)
    } else {
      const trackIndexNew = state.newTracks.findIndex(track => track.id === trackId)
      Vue.set(state.newTracks, trackIndexNew, track)
    }
  },
  REMOVE_TRACK (state, trackId) {
    const trackIndex = state.tracks.findIndex(track => track.id === trackId)
    if (trackIndex !== -1) {
      state.tracks.splice(trackIndex, 1)
    } else {
      const trackIndexNew = state.newTracks.findIndex(track => track.id === trackId)
      state.newTracks.splice(trackIndexNew, 1)
    }
  },
  SET_NEW_TRACKS (state, track) {
    const trackId = track.id
    const cond = !state.tracks.some(track => track.id === trackId)
    if (cond) {
      state.newTracks.push(track)
    }
  },
  LOAD_TRACKS (state) {
    state.tracks = state.tracks.concat(state.newTracks)
    state.newTracks = []
  },
  SET_TRACK (state, track) {
    state.track = track
  },
  CLEAR_TRACK (state) {
    state.track = {}
  },

  TOGGLE_LOAD_STATE (state, value) {
    state.firstLoad = value ?? !state.firstLoad
  }
}

const actions = {
  fetchAndSetTracks ({
    commit,
    state
  }) {
    const unsubscribe = this.$fire.firestore
      .collection('tracks')
      .orderBy('created', 'desc')
      .onSnapshot((snapshot) => {
        if (!state.firstLoad) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'modified') {
              commit('EDIT_TRACK', {
                trackId: change.doc.id,
                track: {
                  id: change.doc.id,
                  ...change.doc.data()
                }
              })
            } else if (change.type === 'removed') {
              commit('REMOVE_TRACK', change.doc.id)
            } else if (change.type === 'added') {
              const newTrack = {
                ...change.doc.data(),
                id: change.doc.id
              }
              commit('SET_NEW_TRACKS', newTrack)
            }
          })
        }
      })
    commit('SET_UNSUBSCRIBE_INDEX', unsubscribe)
    return new Promise((resolve) => {
      const promise = this.$fire.firestore
        .collection('tracks')
        .orderBy('created', 'desc')
        .get()
      resolve(promise)
    })
      .then((tracks) => {
        const addTracks = tracks.docs.map(track => ({
          id: track.id,
          ...track.data()
        }))
        commit('SET_TRACKS', addTracks)
        commit('TOGGLE_LOAD_STATE', false)
      })
  },
  unsubscribeTracks ({ commit }) {
    commit('UNSUBSCRIBE_INDEX')
  },
  unsubscribeTrack ({ commit }) {
    commit('UNSUBSCRIBE_TRACK')
  },
  fetchAndSetTrack ({ commit }, id) {
    return new Promise((resolve) => {
      const documentReference = this.$fire.firestore.collection('tracks').doc(id)
      const unsubscribeTrack = documentReference.onSnapshot((query) => {
        const track = {
          ...query.data(),
          id: query.id
        }
        commit('SET_TRACK', track)
        resolve()
      })
      commit('SET_UNSUBSCRIBE_TRACK', unsubscribeTrack)
    })
  },
  async deleteTrack ({
    commit,
    getters
  }) {
    const id = getters.getTrack.id
    const imagesUrls = getters.getTrack.body.blocks.filter(el => el.type === 'image' && el.data.file.url).map(el => el.data.file.url)
    const imagesRefs = imagesUrls.map(url => this.$fire.storage.refFromURL(url))
    const promises = imagesRefs.map(ref => ref.delete())
    await Promise.all(promises)
    const trackRef = this.$fire.firestore.collection('tracks').doc(id)
    await trackRef.delete()
    commit('CLEAR_TRACK')
  },
  loadTracks ({ commit }) {
    commit('LOAD_TRACKS')
  }
}

const getters = {
  getTracks (state) {
    let tracks = JSON.parse(JSON.stringify(state.tracks))
    tracks = tracks.map((track) => {
      if (track.body && track.body.blocks.length) {
        const imgUrl = track.body.blocks.find(block => block.type === 'image')
        return {
          ...track,
          imgUrl: imgUrl?.data?.file?.url
        }
      }
      return track
    })
    return tracks
  },
  getNewTracks (state) {
    return JSON.parse(JSON.stringify(state.newTracks))
  },
  getTrack (state) {
    return JSON.parse(JSON.stringify(state.track || 'die'))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
