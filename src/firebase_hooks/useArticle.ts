import {collection, doc, query, where, orderBy, limit, onSnapshot, addDoc, updateDoc, deleteDoc} from "firebase/firestore";
import {db, auth} from '../index'
import {useState, useEffect} from "react";
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;
import FirestoreErrorCode = firebase.firestore.FirestoreErrorCode;

const articleRef = collection(db, "article");

function useArticleRecents(n: number) {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<DocumentData[]>();

    useEffect( () => {
        const q = query(articleRef, where("published", "==", true), orderBy("post_time"), limit(n))

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
    })

    return {error, loading, articles};
}

function useArticleRead(articleID: string) {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<DocumentData>();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "article", articleID),
            (doc) => {
            setLoading(false);
            setArticle(doc.data)
        }, (err) => {
            setError(err.code)
        })

        return () => unsubscribe()
    }, [articleID])

    return {error, loading, article};
}

function useArticleComments(articleID: string, n: number) {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<DocumentData[]>([]);

    useEffect( () => {
        const unsubscribe = onSnapshot(query(collection(db, `article/${articleID}/comments`), limit(n)),
            (docs) => {
            const commentsData: DocumentData[] = []
                docs.forEach(doc => {
                    commentsData.push(doc.data)
                })
            setLoading(false),
            setComments(commentsData);
        }, (err) => {
            setError(err.code)
            })

        return () => unsubscribe()
    }, [articleID])

    return {error, loading, comments};
}

//TODO: agree with FE team about article parameters, add firestore article converter
async function handleArticleCreate(article: any): Promise<string | boolean> {
    const docRef = await addDoc(articleRef, article);
    return docRef.id;
}

async function handleArticleEdit(articleID: string, article: any) {
    await updateDoc(doc(db, "article", articleID), article);
}

async function handleArticlePost(articleID: string, article: any) {
    await updateDoc(doc(db, "article", articleID), "published", true);
}

async function handleArticleDelete(articleID: string) {
    await deleteDoc(doc(db, "article", articleID))
}

export {useArticleRecents, handleArticleEdit, handleArticleDelete, useArticleRead, handleArticlePost, handleArticleCreate, useArticleComments};