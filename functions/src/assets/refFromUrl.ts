import * as admin from "firebase-admin";

export default function refFromUrl(url: string) {
    const sanUrl = url
        .replace('https://firebasestorage.googleapis.com/v0/b/newch-1f863.appspot.com/o/', '')
        .replace(/%2F/g, '/')
        .split('?')[0]
    return admin.storage().bucket().file(sanUrl)
}
