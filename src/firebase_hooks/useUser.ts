import {collection, doc, query, where, orderBy, limit, onSnapshot, setDoc, updateDoc, deleteDoc} from "firebase/firestore";
import {db, auth} from '../index'
import {useState, useEffect} from "react";
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;
import FirestoreErrorCode = firebase.firestore.FirestoreErrorCode;

function useUserDirectory(n: number) {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<DocumentData[]>();

    useEffect( () => {
        const q = query(collection(db, "users"), where("contributor", "==", true), orderBy("username"), limit(n))

        const unsubscribe = onSnapshot(q,
            (docs) => {
                const usersData: DocumentData[] = []
                docs.forEach(doc => {
                    usersData.push(doc.data)
                })
                setLoading(false),
                    setUsers(usersData);
            }, (err) => {
                setError(err.code)
            })

        return () => unsubscribe()
    })

    return {error, loading, users};
}

function useUserArticles(uid: string, n: number) {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<DocumentData[]>();

    useEffect( () => {
        const q = query(collection(db, "articles"), where("published", "==", true),
            where("author_uid", "==", uid), orderBy("post_time"), limit(n))

        const unsubscribe = onSnapshot(q,
            (docs) => {
                const articlesData: DocumentData[] = []
                docs.forEach(doc => {
                    articlesData.push(doc.data)
                })
                setLoading(false),
                    setArticles(articlesData);
            }, (err) => {
                setError(err.code)
            })

        return () => unsubscribe()
    },[uid])

    return {error, loading, articles};
}

//TODO: use auth hook instead of passing uid
function useUserDrafts(uid:string, n: number) {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<DocumentData[]>();

    useEffect( () => {
        const q = query(collection(db, "articles"), where("published", "==", false),
            where("author_uid", "==", uid), orderBy("post_time"), limit(n))

        const unsubscribe = onSnapshot(q,
            (docs) => {
                const articlesData: DocumentData[] = []
                docs.forEach(doc => {
                    articlesData.push(doc.data)
                })
                setLoading(false),
                    setArticles(articlesData);
            }, (err) => {
                setError(err.code)
            })

        return () => unsubscribe()
    },[uid])

    return {error, loading, articles};
}

//TODO: use auth hook instead of passing uid
async function handleApplyContrtibutor(uid: string) {
    await updateDoc(doc(db, "users", uid), "contributor_request", "requested");
}

//TODO: use auth instead of passing uid
async function handleNewUser(uid: string, username: string) {
    await setDoc(doc(db, "users", uid), {
        contributor: false,
        username: username
    });
}

//TODO: use self auth provider
function useUserContributor() {
}

function useUser(uid: string) {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [queriedUser, setQueriedUser] = useState<DocumentData>();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "users", uid),
            (doc) => {
                setLoading(false);
                setQueriedUser(doc.data)
            }, (err) => {
                setError(err.code)
            })

        return () => unsubscribe()
    }, [uid])

    return {error, loading, queriedUser};
}

export {useUser, handleNewUser, useUserContributor, useUserArticles, useUserDirectory, useUserDrafts, handleApplyContrtibutor}
