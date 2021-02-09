<script>
export default {
  name: 'CommentCard',
  props: {
    score: {
      type: [Number, Boolean],
      default: false
    },
    body: {
      type: [String, Object],
      require: true
    },
    id: {
      type: [String],
      require: true
    }
  }
}
</script>
