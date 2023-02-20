import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './pages/App'
import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

const app = initializeApp({
  projectId: 'dev-emulator',
  apiKey: 'dev-emulator-placeholder-key',
})

export const db = getFirestore(app)
connectFirestoreEmulator(db, 'localhost', 8080)

export const auth = getAuth(app)
connectAuthEmulator(auth, 'https://localhost:9099', { disableWarnings: true })

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
