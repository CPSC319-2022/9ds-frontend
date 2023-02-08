import {useState, useEffect} from "react";
import {User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo} from "firebase/auth";
import {auth} from "../../index";
import {useNewUser, useUser, UserData} from "./useUser";
import firebase from "firebase/compat";
import FirestoreErrorCode = firebase.firestore.FirestoreErrorCode;

export const useAuth = () => {
    const[state, setState] = useState(() => {
        const user = auth.currentUser;
        return {
            initializing: !user,
            user,
        }
    })

    const onChange = (user: User | null) => {
        setState({initializing: false, user})
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(onChange)
        return () => unsubscribe()
    }, [])

    return state
}

export const useCreateUserEmailPassword = (email: string, password: string, username: string, profile_image: string) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData>();

    useEffect( () => {
        createUserWithEmailAndPassword(auth, email, password).then(() => {
            const {error, loading, user} = useNewUser(username, profile_image)
            setError(error);
            setLoading(loading);
            setUser(user);
        }).catch((err) => {
            setError(err.code)
        })
    }, [email, password])

    return {error, loading, user};
}

export const useSignInUserEmailPassword = (email:string, password: string) => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData>();

    useEffect( () => {
        signInWithEmailAndPassword(auth, email, password).then(() => {
            const {error, loading, queriedUser} = useUser()
            setError(error);
            setLoading(loading);
            setUser(queriedUser);
        }).catch((err) => {
            setError(err.code)
        })
    }, [email, password])

    return {error, loading, user};
}

export const useSignInWithGoogle = () => {
    const [error, setError] = useState<FirestoreErrorCode>();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData>();

    const provider = new GoogleAuthProvider();

    useEffect( () => {
        signInWithPopup(auth, provider).then((result) => {
            const additionalInfo = getAdditionalUserInfo(result)
            if (additionalInfo?.isNewUser) {
                const profile = additionalInfo.profile;
                if (profile === null) {
                    setError("unknown");
                } else {
                    const {error, loading, user} = useNewUser(profile.displayName as string, profile.photoURL as string)
                    setError(error);
                    setLoading(loading);
                    setUser(user);
                }
            } else {
                const {error, loading, queriedUser} = useUser()
                setError(error);
                setLoading(loading);
                setUser(queriedUser);
            }
        }).catch((err) => {
            setError(err.code)
        })
    }, [auth.currentUser])

    return {error, loading, user};
}

export const useSignOut = () => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [signedOut, setSignedOut] = useState<boolean>();

    useEffect(() => {
        signOut(auth).then(() => {
            setLoading(false);
            setSignedOut(true)
        }).catch((err) => {
            setError(err)
        })
    })

    return [error, loading, signedOut];
}
