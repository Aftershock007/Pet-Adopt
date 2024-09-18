import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ToastAndroid
} from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import { useNavigation } from "expo-router"
import { useUser } from "@clerk/clerk-expo"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  where,
  query
} from "firebase/firestore"
import { db } from "../../config/FirebaseConfig"
import Colors from "@/constants/Colors"
import { PetData } from "@/constants/Interfaces"
import { PetListItem, ActivityLoader } from "@/components/index"

export default function UserPost() {
  const navigation = useNavigation()
  const { user } = useUser()
  const [userPostList, setUserPostList] = useState<PetData[]>([])
  const [loader, setLoader] = useState<boolean>(false)

  const GetUserPost = useCallback(async () => {
    setLoader(true)
    setUserPostList([])
    try {
      const q = query(
        collection(db, "Pets"),
        where("email", "==", user?.primaryEmailAddress?.emailAddress)
      )
      const querySnapshot = await getDocs(q)
      const posts: PetData[] = []
      querySnapshot.forEach((doc) => {
        posts.push(doc.data() as PetData)
      })
      setUserPostList(posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoader(false)
    }
  }, [user])

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerBackVisible: false
    })
    user && GetUserPost()
  }, [user, navigation, GetUserPost])

  function OnDeletePost(docId: string) {
    Alert.alert(
      "Do You Want to Delete?",
      "Do you really want to delete the post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            deletePost(docId)
              .then(() => {
                ToastAndroid.show(
                  "Post deleted successfully",
                  ToastAndroid.SHORT
                )
              })
              .catch((error) => {
                console.error("Error deleting post:", error)
                ToastAndroid.show("Error deleting post", ToastAndroid.SHORT)
              })
          }
        }
      ]
    )
  }

  async function deletePost(docId: string) {
    await deleteDoc(doc(db, "Pets", docId))
    GetUserPost()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Posts</Text>
      {loader ? (
        <ActivityLoader />
      ) : (
        <FlatList
          data={userPostList}
          numColumns={2}
          refreshing={loader}
          onRefresh={GetUserPost}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <PetListItem pet={item} />
              <Pressable
                onPress={() => OnDeletePost(item?.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          )}
        />
      )}
      {userPostList?.length === 0 && (
        <Text style={styles.noPostText}>No post found</Text>
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
  itemContainer: {
    marginTop: 10
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 15
  },
  deleteButtonText: {
    fontFamily: "outfit",
    textAlign: "center",
    color: Colors.WHITE
  },
  noPostText: {
    marginTop: Platform.OS === "android" ? 1 : 6
  }
})
