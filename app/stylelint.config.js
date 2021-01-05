module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order'
  ],
  plugins: [
    'stylelint-scss'
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: ['v-deep']
    }],
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true
  }
}
