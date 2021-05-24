<template>
  <div class="modal">
    <div v-click-outside="() => $emit('click:outside')" class="modal__body">
      <h1 class="modal__title">
        {{ $t('actions.areYouSure') }}
      </h1>
      <div class="modal__buttons">
        <Button @click.native="deleteThreadMethod">
          {{ $t('actions.ofCourse') }}
        </Button>
        <Button @click.native="$emit('close')">
          {{ $t('actions.no') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/uicomponents/Button'
import { mapActions } from 'vuex'

export default {
  name: 'DeleteThread',
  components: {
    Button
  },
  methods: {
    ...mapActions('threads', ['deleteThread']),
    async deleteThreadMethod () {
      this.$emit('close')
      await this.deleteThread()
      this.$router.replace(this.localePath({ name: 'form-create-thread' }))
    }
  }
}
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--modal-overlay);

  &__body {
    width: 400px;
    padding: 30px;
    background: var(--bg);
  }

  &__title {
    margin-bottom: 40px;
    color: var(--text);
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
  }
}
</style>
