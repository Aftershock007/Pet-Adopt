import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native"
import React from "react"
import Colors from "../../constants/Colors"
import { useUser } from "@clerk/clerk-expo"
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore"
import { db } from "../../config/FirebaseConfig"
import { useRouter } from "expo-router"
import { PetData } from "@/constants/Interfaces"

export default function AdoptMe({ pet }: Readonly<{ pet: PetData }>) {
  const { user } = useUser()
  const router = useRouter()

  async function InitiateChat() {
    const docId1 = user?.primaryEmailAddress?.emailAddress + "_" + pet?.email
    const docId2 = pet?.email + "_" + user?.primaryEmailAddress?.emailAddress
    const q = query(collection(db, "Chat"), where("id", "in", [docId1, docId2]))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      router.push({
        pathname: "/chat",
        params: { id: doc.id }
      })
    })
    if (querySnapshot.docs?.length === 0) {
      await setDoc(doc(db, "Chat", docId1), {
        id: docId1,
        users: [
          {
            email: user?.primaryEmailAddress?.emailAddress,
            imageUrl: user?.imageUrl,
            name: user?.fullName
          },
          {
            email: pet?.email,
            imageUrl: pet?.userImage,
            name: pet?.userName
          }
        ],
        userIds: [user?.primaryEmailAddress?.emailAddress, pet?.email]
      })
      router.push({ pathname: "/chat", params: { id: docId1 } })
    }
  }

  const isOwner = user?.primaryEmailAddress?.emailAddress === pet?.email

  return (
    <View style={styles.bottomContainer}>
      {!isOwner && (
        <TouchableOpacity onPress={InitiateChat} style={styles.adoptBtn}>
          <Text style={styles.adoptBtnText}>Chat with Owner</Text>
        </TouchableOpacity>
      )}
      <View style={styles.marginBottom} />
    </View>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    width: "100%",
    bottom: 20,
    paddingTop: 35,
    alignItems: "center"
  },
  adoptBtn: {
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    paddingHorizontal: Platform.OS === "android" ? 85 : 100
  },
  adoptBtnText: {
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 20
  },
  marginBottom: {
    marginBottom: Platform.OS === "android" ? 15 : 25
  }
})
