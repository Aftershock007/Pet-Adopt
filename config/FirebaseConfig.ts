import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adoption-application-48f82.firebaseapp.com",
  projectId: "pet-adoption-application-48f82",
  storageBucket: "pet-adoption-application-48f82.appspot.com",
  messagingSenderId: "669222813735",
  appId: "1:669222813735:web:f02f9436b47363a0c80e02",
  measurementId: "G-1K7GQE9P57"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
