<template>
  <div class="form create-thread">
    <input v-model="title" placeholder="Заголовок" type="text" class="form__title">
    <div class="form__body">
      <div class="form__row">
        <div class="form__label form__board">
          {{ $t('form.board') }}:
        </div>
        <SelectSearch v-model="board" class="form__select" :list="boardsList" />
      </div>
      <Editor v-model="body" class="form__editor" />
      <div class="form__row form__submit">
        <Button large @click.native="save">
          Редактировать
        </Button>
        <recaptcha class="form__captcha" @success="onApprove" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Editor from '~/components/uicomponents/Editor'
import SelectSearch from '~/components/uicomponents/SelectSearch'
import form from '~/assets/mixins/form'
import Button from '~/components/uicomponents/Button'

export default {
  name: 'Thread',
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
      store.dispatch('threads/fetchAndSetThread', route.params.id)
    ])
  },
  created () {
    this.body = this.getThread.body
    this.title = this.getThread.title
    this.board = this.getThread.board
  },
  computed: {
    ...mapGetters('threads', ['getThread'])
  },
  methods: {
    async save () {
      try {
        this.token = await this.$recaptcha.getResponse()
        await this.$fire.firestore.collection('threads').doc(this.$route.params.id).update({
          body: this.body,
          board: this.board,
          title: this.title,
          lastUpdate: Date.now()
        })

        this.$router.push(this.localePath({
          name: 'thread-id',
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
