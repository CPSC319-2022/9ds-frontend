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
    FirestoreErrorCode, FirestoreError
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

export const useUserDirectory = (n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<DocumentData[]>();

    useEffect( () => {
        const q = query(collection(db, "users"), where("contributor", "==", true), orderBy("username"), limit(n))

        getDocs(q).then(
            (docs: QuerySnapshot<DocumentData>) => {
                setLoading(false);
                setUsers(userTranslator(docs));
            }).catch((err) => {
                setError(err.code)
            })
    })

    return {error, loading, users};
}

export const useUserArticles = (uid: string, n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<ArticlePreview[]>();

    useEffect( () => {
        const q = query(collection(db, "articles"), where("published", "==", true),
            where("author_uid", "==", uid), orderBy("post_time"), limit(n))

        getDocs(q)
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoading(false)
                setArticles(articlePreviewTranslator(docs))
            }).catch((err: FirestoreError) => {
            setError(err.code)
        })
    },[uid])

    return {error, loading, articles};
}

export const useUserDrafts = (n: number) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<ArticlePreview[]>();

    useEffect( () => {
        const q = query(collection(db, "articles"), where("published", "==", false),
            where("author_uid", "==", auth.currentUser), orderBy("post_time"), limit(n))

        getDocs(q)
            .then((docs: QuerySnapshot<DocumentData>) => {
                setLoading(false)
                setArticles(articlePreviewTranslator(docs))
            }).catch((err: FirestoreError) => {
                setError(err.code)
            })

    },[auth.currentUser])

    return {error, loading, articles};
}

export const useApplyPromotion = () => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);

    const applyContributor = () => {
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

    return {applyContributor, error, loading};
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
