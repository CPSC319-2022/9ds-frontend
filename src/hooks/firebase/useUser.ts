import {
    collection,
    doc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    updateDoc,
    QuerySnapshot,
    DocumentData,
    FirestoreErrorCode
} from "firebase/firestore";
import {db, auth} from '../../index'
import {useState, useEffect} from "react";

export interface UserData {
    contributor: boolean,
    profile_image: string,
    username: string,
    uid: string
}

export const useUserDirectory = (n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<DocumentData[]>();

    useEffect( () => {
        const q = query(collection(db, "users"), where("contributor", "==", true), orderBy("username"), limit(n))

        const unsubscribe = onSnapshot(q,
            (docs: QuerySnapshot<DocumentData>) => {
                const usersData: UserData[] = []
                docs.forEach(doc => {
                    usersData.push(doc.data() as UserData)
                })
                setLoading(false);
                setUsers(usersData);
            }, (err) => {
                setError(err.code)
            })

        return () => unsubscribe()
    })

    return {error, loading, users};
}

export const useUserArticles = (uid: string, n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<DocumentData[]>();

    useEffect( () => {
        const q = query(collection(db, "articles"), where("published", "==", true),
            where("author_uid", "==", uid), orderBy("post_time"), limit(n))

        const unsubscribe = onSnapshot(q,
            (docs: QuerySnapshot<DocumentData>) => {
                const articlesData: DocumentData[] = []
                docs.forEach(doc => {
                    articlesData.push({
                        title: doc.data().title,
                        content: doc.data().content,
                        header_image: doc.data().header_image,
                        author_image: doc.data().author_image,
                        author_username: doc.data().author_username,
                        post_time: doc.data().post_time
                    })
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

export const useUserDrafts = (n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<DocumentData[]>();

    useEffect( () => {
        const q = query(collection(db, "articles"), where("published", "==", false),
            where("author_uid", "==", auth.currentUser), orderBy("post_time"), limit(n))

        const unsubscribe = onSnapshot(q,
            (docs: QuerySnapshot<DocumentData>) => {
                const articlesData: DocumentData[] = []
                docs.forEach(doc => {
                    articlesData.push({
                        title: doc.data().title,
                        content: doc.data().content,
                        header_image: doc.data().header_image,
                        author_image: doc.data().author_image,
                        author_username: doc.data().author_username,
                        post_time: doc.data().post_time
                    })
                })
                setLoading(false),
                    setArticles(articlesData);
            }, (err) => {
                setError(err.code)
            })

        return () => unsubscribe()
    },[auth.currentUser])

    return {error, loading, articles};
}

export const useApplyContrtibutor = () => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth.currentUser !== null) {
            updateDoc(doc(db, "users", auth.currentUser.uid), "contributor_request", "requested").then(
                () => {
                    setLoading(false);
                }, (err) => {
                    setError(err.code)
                })
        }
    }, [auth.currentUser])

    return {error, loading};
}

export const useNewUser = (username: string, profile_image: string) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData>();

    useEffect(() => {
        if (auth.currentUser !== null) {
            setDoc(doc(db, "users", auth.currentUser.uid), {
                contributor: false,
                username: username,
                profile_image: profile_image
            }).then(
                () => {
                    setLoading(false);
                    setUser({
                        contributor: false,
                        username: username,
                        profile_image: profile_image,
                        uid: (auth.currentUser !== null)? auth.currentUser.uid : "Error"
                    })
                })
            .catch((err) => {
                setError(err.code)
            })
        }
    }, [])

    return {error, loading, user};
}

export const useUser = () => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [queriedUser, setQueriedUser] = useState<UserData>({
        contributor: false,
        profile_image: "",
        username: "",
        uid: ""
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "users", (auth.currentUser !== null)? auth.currentUser.uid : ""),
            (doc) => {
            const data = doc.data();
                if (data === undefined) {
                    setError("not-found")
                } else {
                    setLoading(false);
                    setQueriedUser({
                        contributor: data.contributor,
                        profile_image: data.profile_image,
                        username: data.username,
                        uid: doc.id
                    })
                }
            }, (err) => {
                setError(err.code)
            })

        return () => unsubscribe()
    }, [auth.currentUser])

    return {error, loading, queriedUser};
}
