<template>
  <div class="comments">
    <div class="comments__overlay" />
    <div class="comments__main">
      <nuxt-link
        :to="localePath({
          name: 'track-id',
          params: {id: $route.params.id}
        })"
        class="comments__close icon"
        v-html="require('@/static/icons/cross-icon.svg?raw')"
      />
      <div class="comments__body">
        <div class="comments__path">
          <CommentPaginationItem
            v-for="(comment, index) in getPath"
            :key="'path'+index"
            :comment="comment"
          />
        </div>
        <div class="comments__responses">
          <div class="comments__list">
            <Button
              large
              class="comments__button"
              @click.native="$router.push(localePath({name: 'form-create-trad-comment', params: {trad: $route.params.id}, query: {parent: $route.params.commentId}}))"
            >
              {{ $t('actions.respondHere') }}
            </Button>
            <CommentCard
              v-for="(comment, index) in getChildComments"
              :key="index"
              class="comments__item"
              :comment="comment"
            />

            <Button
              v-if="getChildComments.length"
              large
              class="comments__button"
              @click.native="$router.push(localePath({name: 'form-create-trad-comment', params: {trad: $route.params.id}, query: {parent: $route.params.commentId}}))"
            >
              {{ $t('actions.respondHere') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Button from '~/components/uicomponents/Button'
import CommentCard from '~/components/CommentComponenets/CommentCard'
import CommentPaginationItem from '~/components/CommentComponenets/CommentPaginationItem'

export default {
  name: 'CommentId',
  components: {
    CommentPaginationItem,
    CommentCard,
    Button
  },
  async fetch ({
    store,
    route
  }) {
    const pathPromise = store.dispatch('comments/fetchParentsPath', {
      tradId: route.params.id,
      commentId: route.params.commentId
    })
    const childPromise = store.dispatch('comments/fetchChildComments', {
      tradId: route.params.id,
      commentId: route.params.commentId
    })
    await Promise.all([pathPromise, childPromise])
  },
  computed: {
    ...mapGetters('comments', ['getChildComments', 'getPath']),
    ...mapGetters('threads', ['getCommentById']),
    isFirstLevel () {
      return this.getPath.length === 0
    }
  },
  mounted () {
    document.body.style.overflowY = 'hidden'
  },
  beforeDestroy () {
    document.body.style.overflowY = 'initial'
  }
}
</script>

<style scoped lang="scss">
.comments {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;

  &__main {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: flex-end;
    width: 78%;
    height: 100%;
    margin-left: auto;
  }

  &__body {
    width: 93%;
    height: 100%;
    overflow-y: auto;
    background-color: var(--bg-dark);
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65px;
    height: 65px;
    margin: 20px 35px 0 0;
    cursor: pointer;
    background-color: var(--bg-dark);
    border-radius: 50%;
  }

  &__overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    background-color: var(--modal-overlay);
  }

  &__item {
    &:not(:last-child) {
      margin-bottom: 60px;
    }
  }

  &__button {
    margin: 0 auto 70px;
  }

  &__responses {
    padding: 170px 50px 50px;
  }
}
</style>
