import { User } from 'firebase/auth'
import {
  doc,
  DocumentData,
  getDoc,
  QuerySnapshot,
  setDoc,
} from 'firebase/firestore'
import { db } from 'firebaseApp'
import { AdminUserData, UserData } from 'types/UserData'

export const userTranslator = (
  docs: QuerySnapshot<DocumentData>,
): UserData[] => {
  const userData: AdminUserData[] = []
  docs.forEach((doc) => {
    userData.push({
      role: doc.data().role,
      profile_image: doc.data().profile_image,
      username: doc.data().username,
      uid: doc.id,
      promotion_request: doc.data().promotion_request,
    })
  })

  return userData
}

export const getUser = async (uid: string | null): Promise<UserData> => {
  if (uid === null) {
    return Promise.reject('unauthenticated')
  }
  const document = await getDoc(doc(db, 'users', uid))
  if (document.exists()) {
    return {
      role: document.data().role,
      profile_image: document.data().profile_image,
      username: document.data().username,
      uid: document.id,
      promotion_request: document.data().promotion_request,
    }
  } else {
    return Promise.reject('not-found')
  }
}

export const createNewUser = (
  currentUser: User | null,
  username: string,
  profile_image: string,
): Promise<void> => {
  if (!currentUser) {
    return Promise.reject('failed_precondition')
  }
  return setDoc(doc(db, 'users', currentUser.uid), {
    role: 'reader',
    username: username,
    profile_image: profile_image,
  })
}
