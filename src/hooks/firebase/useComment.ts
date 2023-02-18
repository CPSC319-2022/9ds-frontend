import {addDoc, deleteDoc, doc, collection, updateDoc, serverTimestamp, Timestamp, FirestoreErrorCode} from "firebase/firestore";
import {db} from "../../index";
import {useEffect, useState} from "react";
import {useUser} from "./useUser";

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface comment {
    commenter_uid: string,
    profile_image: string,
    commenter_username: string,
    content: string,
    post_time: Timestamp
}

export const useCommentCreate = (articleID: string, comment: unknown)  => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [commentId, setCommentId] = useState<string>();

    useEffect(() => {
        const {error, loading, queriedUser } = useUser()
        if (error === null && !loading) {
            addDoc(collection(db, `article/${articleID}/comments`), {
                commenter_uid: queriedUser.uid,
                profile_image: queriedUser.profile_image,
                commenter_username: queriedUser.username,
                content: comment,
                post_time: serverTimestamp()
            }).then(
                (doc) => {
                    setLoading(false);
                    setCommentId(doc.id)
                }).catch((err) => {
                    setError(err.code)
                })
        }
    }, [articleID, comment])

    return {error, loading, commentId};
}

export const useCommentEdit = (articleID: string, commentID: string, comment: unknown) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const {error, loading, queriedUser } = useUser()
        if (error === null && !loading) {
            updateDoc(doc(db, `article/${articleID}/comments`, commentID),{
                content: comment,
            }).then(
                () => {
                    setLoading(false);
                }).catch((err) => {
                    setError(err.code)
                })
        }
    }, [articleID, commentID, comment])

    return {error, loading};
}

export const useCommentDelete = (articleID: string, commentID: string) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const {error, loading, queriedUser } = useUser()
        if (error === null && !loading) {
            deleteDoc(doc(db, `article/${articleID}/comments`, commentID)).then(
                () => {
                    setLoading(false);
                }).catch((err) => {
                    setError(err.code)
                })
        }
    }, [articleID, commentID])

    return {error, loading};
}