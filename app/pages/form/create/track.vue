<template>
  <div class="form create-track">
    <input v-model="title" placeholder="Заголовок" type="text" class="form__title">
    <div class="form__body">
      <div class="form__row">
        <div class="form__label form__board">Доска:</div>
        <SelectSearch class="form__select" v-model="board" :list="boardsList"></SelectSearch>
      </div>
      <Editor @addImage="addImage" class="form__editor" v-model="body"></Editor>
      <div class="form__row form__submit">
        <Button large @click.native="save">Создать</Button>
        <recaptcha class="create-track__captcha" @success="onApprove"></recaptcha>
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
  name: 'createTrack',
  mixins: [form],
  data: () => ({
    token: null
  }),
  head () {
    return {
      title: this.title || 'newch'
    }
  },
  components: {
    Button,
    SelectSearch,
    Editor
  },
  beforeRouteLeave (to, from, next) {
    const name = to.name.replace(/__.{3}/, '')
    if (name !== 'track-id') {
      images.forEach(ref => ref.delete())
    }
    next()
  },
  methods: {
    addImage (ref) {
      images.push(ref)
    },
    async save () {
      try {
        this.token = await this.$recaptcha.getResponse()
        const resp = await this.$fire.firestore.collection('tracks').add({
          body: this.body,
          board: this.board,
          title: this.title,
          creator: this.$user.uid,
          created: Date.now()
        })

        this.$router.push(this.localePath({
          name: 'track-id',
          params: { id: resp.id }
        }))
        await this.$recaptcha.reset()
      } catch (err) {
        console.error(err)
      }
    },
    onApprove (token) {
      this.token = token
    }
  }
}
</script>

<style scoped lang="scss">
.create-track {
  &__captcha {
    ::v-deep {
      iframe {
        //border-radius: 15px;
        transform: scale(0.77);
        //transform-origin: 0 0;
      }
    }
  }
}
</style>
