const admin = require('firebase-admin')
const functions = require('firebase-functions')
const algolia = require('algoliasearch')

const ALGOLIA_APP_ID = 'R40L3PVYP5'
const ALGOLIA_APP_KEY = '2fc9926bcefec00b47cf5382b544f600'

const algoliaClient = algolia(ALGOLIA_APP_ID, ALGOLIA_APP_KEY)
const index = algoliaClient.initIndex('tracks')

exports.addToIndex = functions.firestore.document('tracks/{trackId}')
  .onCreate(snapshot => {
    const data = snapshot.data()
    const objectID = snapshot.id
    return index.saveObject({ ...data, objectID })
  })

exports.updateInIndex = functions.firestore.document('tracks/{trackId}')
  .onUpdate(change => {
    const data = change.after.data()
    const objectID = change.after.id
    return index.saveObject({ ...data, objectID })
  })

exports.deleteFromIndex = functions.firestore.document('tracks/{trackId}')
  .onDelete(snapshot => index.deleteObject(snapshot.id))
