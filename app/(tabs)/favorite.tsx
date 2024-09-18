import { View, Text, FlatList, Platform, StyleSheet } from "react-native"
import React, { useCallback, useState } from "react"
import Shared from "../../Shared/Shared"
import { useUser } from "@clerk/clerk-expo"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../config/FirebaseConfig"
import { useFocusEffect } from "expo-router"
import { PetData } from "@/constants/Interfaces"
import { UserResource } from "@clerk/types"
import { PetListItem, ActivityLoader } from "@/components/index"

export default function Favorite() {
  const { user } = useUser()
  const [favouritePetList, setFavouritePetList] = useState<PetData[]>([])
  const [loader, setLoader] = useState<boolean>(false)

  const GetFavouritePetIds = useCallback(async () => {
    setLoader(true)
    const result = await Shared.GetFavouriteList(user as UserResource)
    GetFavouritePetList(result?.favourites || [])
  }, [user])

  useFocusEffect(
    useCallback(() => {
      if (user) {
        GetFavouritePetIds()
      }
    }, [user, GetFavouritePetIds])
  )

  async function GetFavouritePetList(favouriteId_: string[]) {
    setFavouritePetList([])
    if (favouriteId_.length === 0) {
      setLoader(false)
      return
    }
    try {
      const q = query(collection(db, "Pets"), where("id", "in", favouriteId_))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const petData = doc.data() as PetData
        if (petData) {
          setFavouritePetList((prev) => [...prev, petData])
        }
      })
    } catch (error) {
      console.error("Error fetching favourite pets:", error)
    } finally {
      setLoader(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favourites</Text>
      {loader ? (
        <ActivityLoader />
      ) : (
        <>
          {favouritePetList?.length === 0 ? (
            <Text style={styles.noPosts}>No favourite post found</Text>
          ) : (
            <FlatList
              data={favouritePetList}
              style={styles.list}
              numColumns={2}
              onRefresh={GetFavouritePetIds}
              refreshing={loader}
              renderItem={({ item }) => (
                <View>
                  <PetListItem pet={item} />
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: Platform.OS === "android" ? 20 : 30
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30
  },
  noPosts: {
    marginTop: Platform.OS === "android" ? 1 : 6
  },
  list: {
    marginTop: 10
  }
})
