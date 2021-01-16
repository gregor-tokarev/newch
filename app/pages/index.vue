<template>
  <div class="index">
    <LoadTracks v-if="getNewTracks.length" class="index__load"></LoadTracks>
    <TrackCard
      class="index__item"
      v-for="(track, index) in getTracks"
      :key="index"
      :id="track.id"
      :created="track.lastUpdate"
      :max-desc-length="50000"
      :desc="track.body"
      :img-url="track.imgUrl"
      :title="track.title"
      :board="track.board"
    ></TrackCard>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TrackCard from '~/components/Tracks/TrackCard'
import LoadTracks from '~/components/Tracks/LoadTracks'

export default {
  name: 'index',
  components: {
    LoadTracks,
    TrackCard
  },
  async fetch ({ store }) {
    store.commit('tracks/TOGGLE_LOAD_STATE', true)
    await store.dispatch('tracks/fetchAndSetTracks')
  },
  beforeDestroy () {
    this.unsubscribeTracks()
  },
  computed: {
    ...mapGetters('tracks', ['getTracks', 'getNewTracks'])
  },
  methods: {
    ...mapActions('tracks', ['unsubscribeTracks'])
  }
}
</script>

<style scoped lang="scss">
.index {
  &__load {
    margin-bottom: 140px;
  }

  &__item {
    margin-bottom: 60px;
  }
}
</style>
