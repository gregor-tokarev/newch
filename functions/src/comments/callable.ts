import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export const editScore = functions.https.onCall(async (data, context) => {
    const {type, commentId, tradId}: { type: 'increment' | 'decrement', commentId: string, tradId: string } = data
    const commentRef = admin.firestore().collection('tracks').doc(tradId).collection('comments').doc(commentId)
    const comment = await commentRef.get()
    // @ts-ignore
    const commentData = comment.data()!;
    const commentScore = commentData.scores
    const userId = context.auth?.uid
    const votedUsers = commentScore.map((vote: { user: string, score: 1 | -1 }) => vote.user)
    if (votedUsers.includes(userId)) {
        const userVoteObject = commentScore.find((vote: { user: string, score: 1 | -1 }) => vote.user === userId)
        if (type === 'increment') {
            userVoteObject.score = 1
        } else if (type === 'decrement') {
            userVoteObject.score = -1
        }
        return commentRef.update({
            scores: commentScore,
        })
    }

    let promise
    if (type === 'increment') {
        const newScores = [...commentScore, {user: context.auth?.uid, score: 1}]
        promise = commentRef.update({
            scores: newScores,
        })
    } else if (type === 'decrement') {
        const newScores = [...commentScore, {user: context.auth?.uid, score: -1}]
        promise = commentRef.update({
            scores: newScores,
        })
    }

    return promise
})
