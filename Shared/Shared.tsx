import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../config/FirebaseConfig"
import { FavouriteData } from "@/constants/Interfaces"
import { UserResource } from "@clerk/types"

async function GetFavouriteList(
  user: UserResource
): Promise<FavouriteData | undefined> {
  const email = user.primaryEmailAddress?.emailAddress
  if (!email) {
    console.error("User does not have a primary email address.")
    return
  }
  const docRef = doc(db, "UserFavouritePet", email)
  const docSnap = await getDoc(docRef)
  if (docSnap?.exists()) {
    return docSnap.data() as FavouriteData
  } else {
    const newData: FavouriteData = {
      email,
      favourites: []
    }
    await setDoc(docRef, newData)
    return newData
  }
}

async function UpdateFavourite(
  user: UserResource,
  favourites: string[]
): Promise<void> {
  const email = user.primaryEmailAddress?.emailAddress
  if (!email) {
    console.error("User does not have a primary email address.")
    return
  }
  const docRef = doc(db, "UserFavouritePet", email)
  try {
    await updateDoc(docRef, { favourites })
  } catch (error) {
    console.error("Error updating favourites:", error)
  }
}

export default { GetFavouriteList, UpdateFavourite }
