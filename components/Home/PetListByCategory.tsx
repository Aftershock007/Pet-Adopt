import { FlatList, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import Category from "./Category"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../config/FirebaseConfig"
import PetListItem from "./PetListItem"
import { PetData } from "@/constants/Interfaces"
import ActivityLoader from "../ActivityLoader"

export default function PetListByCategory() {
  const [petList, setPetList] = useState<PetData[]>([])
  const [loader, setLoader] = useState<boolean>(false)

  useEffect(() => {
    GetPetList("Dogs")
  }, [])

  async function GetPetList(category: string) {
    setLoader(true)
    setPetList([])
    const q = query(collection(db, "Pets"), where("category", "==", category))
    const querySnapshot = await getDocs(q)
    const pets: PetData[] = []
    querySnapshot.forEach((doc) => {
      pets.push(doc.data() as PetData)
    })
    setPetList(pets)
    setLoader(false)
  }

  return (
    <View>
      <Category category={(value) => GetPetList(value)} />
      {loader ? (
        <ActivityLoader />
      ) : (
        <FlatList
          data={petList}
          style={styles.list}
          horizontal
          contentContainerStyle={{ height: "100%" }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <PetListItem pet={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    marginTop: 16
  }
})
