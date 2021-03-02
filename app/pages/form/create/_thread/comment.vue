<template>
  <div class="form create-comment">
    <div class="form__body">
      <Editor v-model="body" class="form__editor" />
      <div class="form__row form__submit">
        <Button large @click.native="save">
          {{ $t('actions.create') }}
        </Button>
        <recaptcha class="form__captcha" @success="onApprove" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import form from '~/assets/mixins/form'
import Button from '~/components/uicomponents/Button'
import Editor from '~/components/uicomponents/Editor'

export default {
  name: 'Comment',
  components: {
    Editor,
    Button
  },
  mixins: [form],
  async fetch ({
    store,
    route
  }) {
    await store.dispatch('threads/fetchAndSetThread', route.params.thread)
  },
  computed: {
    ...mapGetters('threads', ['getThread'])
  },
  methods: {
    async save () {
      const parentId = this.$route.query.parent
      try {
        this.token = await this.$recaptcha.getResponse()
        const thread = this.$fire.firestore.collection('threads').doc(this.$route.params.thread)
        const obj = {
          body: this.body,
          board: this.board,
          creator: this.$user.uid,
          isNested: !!parentId,
          scores: [],
          responseCount: 0,
          created: Date.now()
        }
        if (parentId) {
          obj.parent = parentId
        }
        await thread.collection('comments').add(obj)

        await this.$recaptcha.reset()

        if (parentId) {
          this.$router.push(this.localePath({
            name: 'thread-id-comment-commentId',
            params: { id: this.$route.params.threadId, commentId: parentId }
          }))
        } else {
          this.$router.push(this.localePath({
            name: 'thread-id',
            params: { id: this.$route.params.thread }
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
