import * as admin from 'firebase-admin'

admin.initializeApp()

export * from './comments/firestore'
export * from './comments/callable'
export * from './threads/firestore'
