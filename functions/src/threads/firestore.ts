import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import {Body, Block} from "../types/collections";
import refFromUrl from "../assets/refFromUrl";
// @ts-ignore
import algoliasearch from 'algoliasearch'

const ALGOLIA_APP_ID: string = 'R40L3PVYP5'
const ALGOLIA_APP_KEY: string = '2fc9926bcefec00b47cf5382b544f600'

const algoliaClient: any = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_APP_KEY)
const index = algoliaClient.initIndex('threads')

export const addTrad = functions.firestore.document('threads/{threadId}')
    .onCreate(async snapshot => {
        const data: FirebaseFirestore.DocumentData = snapshot.data()
        const objectID = snapshot.id
        await updateBoardStats(data.board, 'increment')
        return [
            index.saveObject({
                ...data,
                objectID,
            }),
        ]
    })

export const updateTrad = functions.firestore.document('threads/{threadId}')
    .onUpdate(change => {
        const newValue: Body = change.after.data().body
        const oldValue: Body = change.before.data().body

        // @ts-ignore
        const newImages: string[] = newValue.blocks.filter(el => el.type === 'image' && el.data.file.url).map(el => el.data.file.url)
        // @ts-ignore
        const oldImages: string[] = oldValue.blocks.filter(el => el.type === 'image' && el.data.file.url).map(el => el.data.file.url)


        const unusedImages = oldImages.filter(el => !newImages.includes(el))
        const promises = unusedImages.map(el => refFromUrl(el).delete())

        const data = change.after.data()
        const objectID = change.after.id
        const updateAlgoliaIndex = index.saveObject({
            ...data,
            objectID,
        })

        // @ts-ignore
        return Promise.all([updateAlgoliaIndex, ...promises])
    })

export const deleteTrad = functions.firestore.document('threads/{threadId}')
    .onDelete(async snapshot => {
        const documentData = snapshot.data();
        let promises: Promise<any>[] = []
        let deleteFromAlgolia: Promise<any> = new Promise<number>((resolve => resolve(1)))

        if (documentData.body) {
            const blocks: Block[] = documentData.body.blocks
            // @ts-ignore
            const images = blocks.filter(el => el.type === 'image' && el.data.file.url)
            // @ts-ignore
            const imagesRefs = images.map(url => refFromUrl(url?.data?.file?.url))
            promises = imagesRefs.map(ref => ref.delete())

            deleteFromAlgolia = index.deleteObject(snapshot.id)
        }

        await updateBoardStats(documentData.board, 'decrement')
        return Promise.all([deleteFromAlgolia, ...promises])
    })


async function updateBoardStats(boardLink: string, type: 'increment' | 'decrement'): Promise<any> {
    const boards = await admin.firestore().collection('boards').where('link', '==', boardLink).get()
    const board = boards.docs[0]
    const data = board.data()
    const tradsCount = type === 'increment' ? ++data.tradsCount : --data.tradsCount
    return board.ref.update({
        tradsCount,
    })
}
