import { View, Text, FlatList, Platform, StyleSheet } from "react-native"
import React, { useCallback, useState } from "react"
import { query, collection, where, getDocs } from "firebase/firestore"
import { db } from "../../config/FirebaseConfig"
import { useUser } from "@clerk/clerk-expo"
import { useFocusEffect } from "expo-router"
import { ChatRecord, User } from "@/constants/Interfaces"
import { UserItem, ActivityLoader } from "@/components/index"

export default function Inbox() {
  const { user } = useUser()
  const [userList, setUserList] = useState<ChatRecord[]>([])
  const [loader, setLoader] = useState<boolean>(false)

  const GetUserList = useCallback(async () => {
    setLoader(true)
    setUserList([])
    try {
      const q = query(
        collection(db, "Chat"),
        where(
          "userIds",
          "array-contains",
          user?.primaryEmailAddress?.emailAddress
        )
      )
      const querySnapshot = await getDocs(q)
      const chatData: ChatRecord[] = []
      querySnapshot.forEach((doc) => {
        chatData.push({
          id: doc.id,
          ...doc.data()
        } as ChatRecord)
      })
      setUserList(chatData)
    } catch (error) {
      console.error("Error fetching chat records: ", error)
    } finally {
      setLoader(false)
    }
  }, [user])

  useFocusEffect(
    useCallback(() => {
      if (user) {
        GetUserList()
      }
    }, [GetUserList, user])
  )

  function MapOtherUserList() {
    const list = userList.map((record) => {
      const otherUser = record?.users?.filter(
        (USER: User) => USER.email !== user?.primaryEmailAddress?.emailAddress
      )
      if (otherUser && otherUser.length > 0) {
        return {
          ...otherUser[0],
          docId: record.id
        }
      }
      return {
        docId: record?.id,
        email: "",
        imageUrl: "",
        name: ""
      }
    })
    return list
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>
      {(() => {
        if (loader) {
          return <ActivityLoader />
        }
        const userList = MapOtherUserList()
        if (userList.length === 0) {
          return <Text style={styles.noUserText}>No user found</Text>
        }
        return (
          <FlatList
            data={userList}
            refreshing={loader}
            onRefresh={GetUserList}
            style={styles.list}
            renderItem={({ item, index }) => (
              <UserItem userInfo={item} key={index} />
            )}
          />
        )
      })()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: Platform.OS === "android" ? 20 : 30,
    height: 500
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30
  },
  list: {
    marginTop: Platform.OS === "android" ? 7 : 15
  },
  noUserText: {
    marginTop: 5
  }
})
