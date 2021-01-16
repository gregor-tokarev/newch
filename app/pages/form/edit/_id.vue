<template>
  <div class="form create-track">
    <input v-model="title" placeholder="Заголовок" type="text" class="form__title">
    <div class="form__body">
      <div class="form__row">
        <div class="form__label form__board">Доска:</div>
        <SelectSearch v-model="board" class="form__select" :list="boardsList"></SelectSearch>
      </div>
      <Editor v-model="body" class="form__editor"></Editor>
      <div class="form__row form__submit">
        <Button large @click.native="save">{{ $t('actions.edit') }}</Button>
        <recaptcha class="form__captcha" @success="onApprove"></recaptcha>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Editor from '~/components/uicomponents/Editor'
import SelectSearch from '~/components/uicomponents/SelectSearch'
import form from '~/assets/mixins/form'
import Button from '~/components/uicomponents/Button'

export default {
  name: 'Track',
  components: {
    Button,
    SelectSearch,
    Editor
  },
  mixins: [form],
  async fetch ({
    store,
    route
  }) {
    await Promise.all([
      store.dispatch('boards/fetchAndSetBoards'),
      store.dispatch('tracks/fetchAndSetTrack', route.params.id)
    ])
  },
  created () {
    this.body = this.getTrack.body
    this.title = this.getTrack.title
    this.board = this.getTrack.board
  },
  computed: {
    ...mapGetters('tracks', ['getTrack'])
  },
  methods: {
    ...mapActions('tracks', ['editTrack']),
    async save () {
      try {
        this.token = await this.$recaptcha.getResponse()
        await this.$fire.firestore.collection('tracks').doc(this.$route.params.id).update({
          body: this.body,
          board: this.board,
          title: this.title,
          lastUpdate: Date.now()
        })

        this.$router.push(this.localePath({
          name: 'track-id',
          params: { id: this.$route.params.id }
        }))
        await this.$recaptcha.reset()
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
