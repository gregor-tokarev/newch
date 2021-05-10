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
      <Editor v-model="body" class="form__editor" @addImage="addImage" />
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
import Editor from '~/components/uicomponents/Editor'
import SelectSearch from '~/components/uicomponents/SelectSearch'
import form from '~/assets/mixins/form'
import Button from '~/components/uicomponents/Button'

const images = []

export default {
  name: 'CreateThread',
  components: {
    Button,
    SelectSearch,
    Editor
  },
  mixins: [form],
  methods: {
    addImage (ref) {
      images.push(ref)
    },
    async save () {
      try {
        this.token = await this.$recaptcha.getResponse()
        const resp = await this.$fire.firestore.collection('threads').add({
          body: this.body,
          board: this.board,
          title: this.title,
          creator: this.$user.uid,
          created: Date.now()
        })

        this.$router.push(this.localePath({
          name: 'thread-id',
          params: { id: resp.id }
        }))
        await this.$recaptcha.reset()
      } catch (err) {
        console.error(err)
      }
    }
  },
  head () {
    return {
      title: this.title || 'newch'
    }
  },
  beforeRouteLeave (to, _, next) {
    const name = to.name.replace(/__.{3}/, '')
    if (name !== 'thread-id') {
      images.forEach(ref => ref.delete())
    }
    next()
  }
}
</script>
