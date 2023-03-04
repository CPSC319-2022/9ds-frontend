import {
    collection,
    doc,
    query,
    where,
    orderBy,
    limit,
    updateDoc,
    getDoc,
    getDocs,
    QuerySnapshot,
    DocumentData,
    FirestoreErrorCode, FirestoreError, QueryDocumentSnapshot, startAfter
} from "firebase/firestore";
import {db, auth} from '../../index'
import {useState, useEffect} from "react";
import {ArticlePreview, articlePreviewTranslator} from "./useArticle";

export interface UserData {
    role: string,
    profile_image: string,
    username: string,
    uid: string
}

export const userTranslator = (docs: QuerySnapshot<DocumentData>): UserData[] => {
    const userData: UserData[] = []
    docs.forEach((doc) => {
        userData.push({
            role: doc.data().role,
            profile_image: doc.data().profile_image,
            username: doc.data().username,
            uid: doc.id
        })
    })

    return userData;
}

export const useUserContributorDirectory = (n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [loadingNext, setLoadingNext] = useState(true)
    const [users, setUsers] = useState<DocumentData[]>([]);
    const q = query(collection(db, "users"), where("role", "==", "contributor"), orderBy("username"))

    let lastUser: QueryDocumentSnapshot<DocumentData>;
    let endOfCollection = false;

    useEffect( () => {
        getDocs(query(q, limit(n))).then(
            (docs: QuerySnapshot<DocumentData>) => {
                setLoading(false);
                setUsers(userTranslator(docs));
                lastUser = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err) => {
                setError(err.code)
            })
    },[])

    const getNext = (n: number) => {
        setLoadingNext(true)
        getDocs(query(q, startAfter(lastUser), limit(n)))
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoadingNext(false)
                setUsers(users.concat(userTranslator(docs)))
                lastUser = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err: FirestoreError) => {
            setError(err.code)
        })
    }

    return { getNext, error, loading, loadingNext, users, endOfCollection }
}

export const useUserReaderDirectory = (n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [loadingNext, setLoadingNext] = useState(true)
    const [users, setUsers] = useState<DocumentData[]>([]);
    const q = query(collection(db, "users"), where("role", "==", "reader"), orderBy("username"))

    let lastUser: QueryDocumentSnapshot<DocumentData>;
    let endOfCollection = false;

    useEffect( () => {
        getDocs(query(q, limit(n))).then(
            (docs: QuerySnapshot<DocumentData>) => {
                setLoading(false);
                setUsers(userTranslator(docs));
                lastUser = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err) => {
            setError(err.code)
        })
    },[])

    const getNext = (n: number) => {
        setLoadingNext(true)
        getDocs(query(q, startAfter(lastUser), limit(n)))
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoadingNext(false)
                setUsers(users.concat(userTranslator(docs)))
                lastUser = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err: FirestoreError) => {
            setError(err.code)
        })
    }

    return { getNext, error, loading, loadingNext, users, endOfCollection }
}

export const useUserAdminDirectory = (n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [loadingNext, setLoadingNext] = useState(true)
    const [users, setUsers] = useState<DocumentData[]>([]);
    const q = query(collection(db, "users"), where("role", "==", "admin"), orderBy("username"))

    let lastUser: QueryDocumentSnapshot<DocumentData>;
    let endOfCollection = false;

    useEffect( () => {
        getDocs(query(q, limit(n))).then(
            (docs: QuerySnapshot<DocumentData>) => {
                setLoading(false);
                setUsers(userTranslator(docs));
                lastUser = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err) => {
            setError(err.code)
        })
    },[])

    const getNext = (n: number) => {
        setLoadingNext(true)
        getDocs(query(q, startAfter(lastUser), limit(n)))
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoadingNext(false)
                setUsers(users.concat(userTranslator(docs)))
                lastUser = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err: FirestoreError) => {
            setError(err.code)
        })
    }

    return { getNext, error, loading, loadingNext, users, endOfCollection }
}

export const useUserArticles = (uid: string, n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [loadingNext, setLoadingNext] = useState(true)
    const [articles, setArticles] = useState<ArticlePreview[]>([]);

    const q = query(collection(db, "articles"), where("published", "==", true),
        where("author_uid", "==", uid), orderBy("post_time"))

    let lastArticle: QueryDocumentSnapshot<DocumentData>;
    let endOfCollection = false;

    useEffect( () => {
        getDocs(query(q, limit(n)))
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoading(false);
                setArticles(articlePreviewTranslator(docs))
                lastArticle = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err: FirestoreError) => {
            setError(err.code)
        })
    },[uid])

    const getNext = (n: number) => {
        setLoadingNext(true)
        getDocs(query(q, startAfter(lastArticle), limit(n)))
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoadingNext(false)
                setArticles(articles.concat(articlePreviewTranslator(docs)))
                lastArticle = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err: FirestoreError) => {
            setError(err.code)
        })
    }

    return { getNext, error, loading, loadingNext, articles, endOfCollection }
}

export const useUserDrafts = (n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [loadingNext, setLoadingNext] = useState(true)
    const [articles, setArticles] = useState<ArticlePreview[]>([]);

    const q = query(collection(db, "articles"), where("published", "==", false),
        where("author_uid", "==", auth.currentUser), orderBy("post_time"));

    let lastArticle: QueryDocumentSnapshot<DocumentData>;
    let endOfCollection = false;

    useEffect( () => {
        getDocs(query(q, limit(n)))
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoading(false);
                setArticles(articlePreviewTranslator(docs))
                lastArticle = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err: FirestoreError) => {
            setError(err.code)
        })
    },[auth.currentUser])

    const getNext = (n: number) => {
        setLoadingNext(true)
        getDocs(query(q, startAfter(lastArticle), limit(n)))
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoadingNext(false)
                setArticles(articles.concat(articlePreviewTranslator(docs)))
                lastArticle = docs.docs[docs.docs.length - 1]
                endOfCollection = docs.docs.length < n
            }).catch((err: FirestoreError) => {
            setError(err.code)
        })
    }

    return { getNext, error, loading, loadingNext, articles, endOfCollection }
}

export const useApplyPromotion = () => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);

    const applyPromotion = () => {
        if (auth.currentUser !== null) {
            updateDoc(doc(db, "users", auth.currentUser.uid), "promotion_request", "requested").then(
                () => {
                    setLoading(false);
                }, (err) => {
                    setError(err.code)
                })
        } else {
            setError("unauthenticated")
        }
    };

    return {applyPromotion, error, loading};
}

export const useUser = () => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [queriedUser, setQueriedUser] = useState<UserData>({
        role: "",
        profile_image: "",
        username: "",
        uid: ""
    });

    useEffect(() => {
        getUser((auth.currentUser !== null)? auth.currentUser.uid : "").then((user) => {
            setQueriedUser(user)
            setLoading(false)
            }
        ).catch((err: FirestoreErrorCode) => {
            setError(err)
        })
    }, [auth.currentUser])

    return {error, loading, queriedUser};
}

export const getUser = async (uid: string | null): Promise<UserData> => {
    if (uid === null) {
        return Promise.reject("unauthenticated");
    }
    const document = await getDoc(doc(db, "users", uid));
    if(document.exists()) {
        return {
            role: document.data().role,
            profile_image: document.data().profile_image,
            username: document.data().username,
            uid: document.id
        }
    } else {
        return Promise.reject("not-found");
    }
}
