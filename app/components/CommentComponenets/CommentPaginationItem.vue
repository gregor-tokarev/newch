<template>
  <nuxt-link :to="localePath({name: 'thread-id-comment-commentId', params: {commentId: comment.id, id: $route.params.id}})" class="comment">
    <div class="comment__name">
      {{ title }}
    </div>
    <div class="comment__arrow icon" v-html="require('@/static/icons/comment-arrow.svg?raw')" />
  </nuxt-link>
</template>

<script>
export default {
  name: 'CommentPaginationItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    title () {
      const paragraphs = this.comment.body.blocks.filter(block => block.type === 'paragraph')
      const title = paragraphs.reduce((acc, paragraph) => (acc += paragraph.data.text), '')
      return title || 'Без текста'
    }
  }
}
</script>

<style scoped lang="scss">
.comment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  cursor: pointer;
  background-color: var(--bg);

  &__name {
    overflow: hidden;
    color: var(--accent);
    text-overflow: ellipsis;

    @include title-light;
  }
}
</style>
