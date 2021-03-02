<template>
  <div class="form create-track">
    <div class="form__body">
      <Editor v-model="body" padding-bottom="200" class="form__editor" />
      <div class="form__row form__submit">
        <Button large @click.native="save">
          {{ $t('actions.editComment') }}
        </Button>
        <recaptcha class="form__captcha" @success="onApprove" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Editor from '~/components/uicomponents/Editor'
import form from '~/assets/mixins/form'
import Button from '~/components/uicomponents/Button'

export default {
  name: 'Track',
  components: {
    Button,
    Editor
  },
  mixins: [form],
  computed: {
    ...mapGetters('threads', ['getThread']),
    ...mapGetters('comments', ['comment'])
  },
  created () {
    this.body = this.comment.body
  },
  async fetch ({
    store,
    route
  }) {
    await store.dispatch('comments/fetchComment', {
      commentId: route.params.id,
      tradId: route.params.tradId
    })
  },
  methods: {
    ...mapActions('threads', ['editThread']),
    async save () {
      try {
        this.token = await this.$recaptcha.getResponse()
        const tradRef = this.$fire.firestore.collection('tracks').doc(this.$route.params.tradId)
        const commentRef = tradRef.collection('comments').doc(this.$route.params.id)
        await commentRef.update({
          body: this.body,
          board: this.board,
          title: this.title,
          lastUpdate: Date.now()
        })

        this.$router.back()
        await this.$recaptcha.reset()
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
