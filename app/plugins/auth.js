import firebase from 'firebase'

export default async function ({ app }, inject) {
  await app.$fire.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  await app.$fire.auth.signInAnonymously()
  const uid = app.$cookies.get('uid')
  app.$fire.auth.onAuthStateChanged((user) => {
    uid && app.$cookies.setAll([
      {
        name: 'refreshToken',
        value: user.refreshToken
      },
      {
        name: 'userId',
        value: user.uid
      }
    ])
    inject('user', user)
  })
}
