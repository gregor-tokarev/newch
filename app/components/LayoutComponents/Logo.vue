<template>
  <div class="logo">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'Logo',
  data () {
    return {
      text: null
    }
  },
  async created () {
    this.$fire.remoteConfig.settings.minimumFetchIntervalMillis = 1000 * 6
    await this.$fire.remoteConfig.activate()
    const { _value: value } = this.$fire.remoteConfig.getValue('logoText')
    this.text = value || 'Logo'
  }
}
</script>

<style scoped lang="scss">
.logo {
  font-size: 36px;
  color: var(--accent);
}
</style>
