import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from '@firebase/storage'

let firebaseConfig

switch (process.env.REACT_APP_ENV) {
  case 'PROD':
    firebaseConfig = {
      apiKey: 'AIzaSyCcgzkgm7DJkNLTrBk-vDQgeTZw7bTwdn8',
      authDomain: 'ds-blog-376905.firebaseapp.com',
      projectId: 'ds-blog-376905',
      storageBucket: 'ds-blog-376905.appspot.com',
      messagingSenderId: '1046661353798',
      appId: '1:1046661353798:web:e6771cdb184606a1861547',
      measurementId: 'G-V1G11MYNRB',
    }
    break

  case 'QA':
    firebaseConfig = {
      apiKey: 'AIzaSyCG-Lvza6UMVVSW_gZ_oHQFMQa3sssDgdk',
      authDomain: 'ds-blog-qa.firebaseapp.com',
      projectId: 'ds-blog-qa',
      storageBucket: 'ds-blog-qa.appspot.com',
      messagingSenderId: '631919673252',
      appId: '1:631919673252:web:3b5bd30368a67c23ba4b31',
      measurementId: 'G-59FZFJ0980',
    }
    break

  default:
    firebaseConfig = {
      apiKey: 'AIzaSyCHfU9yLnEnLeKKokIQ9sUGI8Cr9mLYXgE',
      authDomain: 'ds-blog-dev.firebaseapp.com',
      projectId: 'ds-blog-dev',
      storageBucket: 'ds-blog-dev.appspot.com',
      messagingSenderId: '545518666660',
      appId: '1:545518666660:web:85badd3f2024480bc07731',
      measurementId: 'G-BB9M09710P',
    }
    break
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)


// if (!process.env.REACT_APP_ENV) {
//   connectFirestoreEmulator(db, 'localhost', 8080)
//   connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
//   connectStorageEmulator(storage, 'localhost', 9199)
// }

export { db, auth, storage }
