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
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  async fetch ({ store }) {
    await store.dispatch('tracks/fetchAndSetTracks')
  },
  beforeDestroy () {
    this.unsubscribeTracks()
  },
  computed: {
    ...mapGetters('tracks', ['getTracks', 'getNewTracks'])
  }
}
</script>
