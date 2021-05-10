<template>
  <div :id="comment.id" class="comment">
    <div class="comment__wrapper">
      <div class="comment__rate" :class="{'comment__rate--disabled': disableVoting}">
        <div
          class="comment__arrow"
          :class="{'comment__arrow--disabled': userVote && userVote.score === 1}"
          @click="editScore('increment')"
          v-html="require('@/static/icons/arrow-accent.svg?raw')"
        />
        <div class="comment__score">
          {{ scoreNumber }}
        </div>
        <div
          class="comment__arrow--rotated comment__arrow"
          :class="{'comment__arrow--disabled': userVote && userVote.score === -1}"
          @click="editScore('decrement')"
          v-html="require('@/static/icons/arrow-accent.svg?raw')"
        />
      </div>
      <Editor :id="'editor-'+comment.id" :data="comment.body" :padding-bottom="0" read class="comment__body" />
      <div v-if="isOwner" class="comment__actions">
        <nuxt-link
          tag="div"
          :to="localePath({name: 'form-edit-threadId-id', params: {id: comment.id, threadId: $route.params.id}})"
          class="comment__pen comment__icon"
          v-html="require('@/static/icons/edit.svg?raw')"
        />
        <div
          class="comment__icon comment__trash"
          @click="deleteCommentMethod"
          v-html="require('@/static/icons/trash.svg?raw')"
        />
      </div>
    </div>
    <nuxt-link
      :to="localePath({name: 'thread-id-comment-commentId', params: {id:$route.params.id, commentId: comment.id}})"
      class="comment__resps"
    >
      <div class="icon comment__res-icon" v-html="require('@/static/icons/res-icon.svg?raw')" />
      {{ comment.responseCount }} {{ $t('elements.response') }}{{ ending(comment.responseCount, $i18n.locale) }}...
    </nuxt-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Editor from '~/components/uicomponents/Editor'
import ending from '~/assets/js/ending.ts'

export default {
  name: 'CommentCard',
  components: { Editor },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    disableVoting: false
  }),
  computed: {
    ...mapGetters('threads', ['getThread']),
    isOwner () {
      return this.comment.creator === this.$user.uid
    },
    scoreNumber () {
      // eslint-disable-next-line no-return-assign
      return this.comment.scores.reduce((acc, item) => acc += item.score, 0)
    },
    userVote () {
      return this.comment.scores.find(vote => vote.user === this.$user.uid)
    }
  },
  methods: {
    ending,
    deleteCommentMethod () {
      this.$fire.firestore.collection('threads').doc(this.getThread.id).collection('comments').doc(this.comment.id).delete()
    },
    async editScore (type) {
      if (
        !this.disableVoting &&
        (
          !this.userVote ||
          (this.userVote?.score === 1 && type !== 'increment') ||
          (this.userVote?.score === -1 && type !== 'decrement')
        )
      ) {
        this.disableVoting = true

        const editScore = this.$fire.functions.httpsCallable('editScore')
        await editScore({
          threadId: this.getThread.id,
          commentId: this.comment.id,
          type
        })
        this.disableVoting = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.comment {
  &__wrapper {
    position: relative;
    display: flex;
    align-items: flex-start;
    padding: 30px 22px 30px 0;
    background-color: var(--bg);
  }

  &__actions {
    display: flex;
    margin-left: auto;
  }

  &__icon {
    width: 15px;
    height: 15px;
    cursor: pointer;

    ::v-deep {
      svg {
        fill: var(--accent);
      }
    }
  }

  &__trash {
    margin-left: 20px;
  }

  &__score {
    color: var(--accent);
  }

  &__rate {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 4%;

    &--disabled {
      .comment__score {
        color: var(--disabled);
      }

      ::v-deep {
        svg,
        path {
          fill: var(--disabled);
        }
      }
    }
  }

  &__resps {
    display: flex;
    align-items: center;
    margin-top: 15px;
    color: var(--label);
    cursor: pointer;
  }

  &__res-icon {
    margin-right: 8px;
  }

  &__body {
    width: 73%;
  }

  &__arrow {
    margin: 0 0 7px 0;
    cursor: pointer;

    &--rotated {
      margin: 7px 0 0 0;
      transform: rotate(180deg);
    }

    &--disabled {
      ::v-deep {
        svg,
        path {
          fill: var(--disabled);
        }
      }
    }
  }
}
</style>
