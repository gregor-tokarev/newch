import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {Body, Block} from "../types/collections"
import refFromUrl from "../assets/refFromUrl"
import {firestore} from "firebase-admin/lib/firestore";
import DocumentSnapshot = firestore.DocumentSnapshot;


export const addComment = functions.firestore.document('threads/{threadId}/comments/{commentId}')
    .onCreate(async (snapshot, context) => {
        return updateParentFn(snapshot, context, 'increment')
    })

export const deleteComment = functions.firestore.document('threads/{threadId}/comments/{commentId}')
    .onDelete(async (snapshot, context) => {
        const documentData = snapshot.data();
        const threadRef = admin.firestore().collection('threads').doc(context.params.threadId);
        const commentsRef = threadRef.collection('comments');

        let promises: Promise<any>[] = []
        if (documentData.body) {
            const blocks: Block[] = documentData.body.blocks
            // @ts-ignore
            const images = blocks.filter(el => el.type === 'image' && el.data.file.url)
            // @ts-ignore
            const imagesRefs = images.map(url => refFromUrl(url?.data?.file?.url))
            promises = imagesRefs.map(ref => ref.delete())
        }

        let deleteAllChild: Promise<any>[] = []
        const comments = await commentsRef.where('parent', '==', snapshot.id).get()
        deleteAllChild = comments.docs.map(doc => commentsRef.doc(doc.id).delete())

        // @ts-ignore
        return Promise.all([...promises, ...deleteAllChild, updateParentFn(snapshot, context, 'decrement')])
    })


export const updateComment = functions.firestore.document('threads/{threadId}/comments/{commentId}')
    .onUpdate((change, context) => {
        const after = change.after.data();
        const before = change.before.data();
        const newValue: Body = after.body
        const oldValue: Body = before.body

        // @ts-ignore
        const newImages: string[] = newValue.blocks.filter(el => el.type === 'image' && el.data.file.url).map(el => el.data.file.url)
        // @ts-ignore
        const oldImages: string[] = oldValue.blocks.filter(el => el.type === 'image' && el.data.file.url).map(el => el.data.file.url)


        const unusedImages = oldImages.filter(el => !newImages.includes(el))
        const promises = unusedImages.map(el => refFromUrl(el).delete())

        let updateParent: Promise<any>
        if ('parent' in after) {
            const diff = after.responseCount - before.responseCount
            if (diff > 0) {
                updateParent = updateParentFn(change.after, context, 'increment')
                return Promise.all([updateParent, ...promises])
            } else if (diff < 0) {
                updateParent = updateParentFn(change.after, context, 'decrement')
                return Promise.all([updateParent, ...promises])
            }
        }

        // @ts-ignore
        return Promise.all(promises)
    })


async function updateParentFn(snapshot: DocumentSnapshot, context: functions.EventContext, type: 'increment' | 'decrement') {
    const documentData = snapshot.data()!;
    const threadRef = admin.firestore().collection('threads').doc(context.params.threadId);
    const commentsRef = threadRef.collection('comments');
    let updateParent: Promise<any>
    if ('parent' in documentData) {
        const parentComment = commentsRef.doc(documentData.parent)
        const parentCommentData = await parentComment.get()
        if ('responseCount' in parentCommentData.data()!) {
            let newValue
            if (type === 'increment') {
                newValue = ++parentCommentData.data()!.responseCount
            } else if (type === 'decrement') {
                newValue = --parentCommentData.data()!.responseCount
            }
            updateParent = parentComment.update({
                responseCount: newValue,
            })
            return updateParent
        }
    }
    return Promise.resolve(undefined)
}
