import React, { useCallback, useEffect, useState } from "react"
import { useLocalSearchParams, useNavigation } from "expo-router"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp
} from "firebase/firestore"
import { db } from "../../config/FirebaseConfig"
import { useUser } from "@clerk/clerk-expo"
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat"
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import Colors from "@/constants/Colors"
import Ionicons from "@expo/vector-icons/Ionicons"
import Feather from "@expo/vector-icons/Feather"
import { launchCameraAsync } from "expo-image-picker"
import * as ImagePicker from "expo-image-picker"
import { storage } from "@/config/FirebaseConfig"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import Entypo from "@expo/vector-icons/Entypo"
import { User } from "@/constants/Interfaces"
import {
  registerAndStorePushToken,
  sendPushNotification
} from "@/notification/SendNotification"

export default function ChatScreen() {
  const params = useLocalSearchParams()
  const navigation = useNavigation()
  const { user } = useUser()
  const [messages, setMessages] = useState<any>([])
  const [imageUrl, setImageUrl] = useState("")
  const [imageData, setImageData] = useState<any>(null)
  const [otherUserEmail, setOtherUserEmail] = useState<string>("")

  const GetUserDetails = useCallback(
    async (chatId: string) => {
      const docRef = doc(db, "Chat", chatId)
      const docSnap = await getDoc(docRef)
      const result = docSnap.data()
      const otherUser = result?.users.filter(
        (item: User) => item.email !== user?.primaryEmailAddress?.emailAddress
      )
      setOtherUserEmail(otherUser[0].email)
      navigation.setOptions({
        headerTitle: otherUser[0].name,
        headerBackVisible: false
      })
    },
    [user?.primaryEmailAddress?.emailAddress, navigation]
  )

  useEffect(() => {
    GetUserDetails(params.id as string)
    const unsubscribe = onSnapshot(
      query(
        collection(db, "Chat", params.id as string, "Messages"),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt instanceof Timestamp
              ? doc.data().createdAt.toDate()
              : null
        }))
        setMessages(messageData as any)
      }
    )
    return () => unsubscribe()
  }, [GetUserDetails, params.id])

  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress
      if (email) {
        registerAndStorePushToken(email)
      }
    }
  }, [user])

  async function onSend(newMessage: any) {
    const myMessage = {
      ...newMessage[0],
      createdAt: serverTimestamp(),
      text: newMessage[0].text || "",
      image: imageUrl || ""
    }
    if (myMessage.text.trim() !== "" || imageUrl !== "") {
      setMessages((previousMessages: any) =>
        GiftedChat.append(previousMessages, myMessage)
      )
      await addDoc(
        collection(db, "Chat", params.id as string, "Messages"),
        myMessage
      )
      const currentMessage = myMessage?.image
        ? "Sent an Image"
        : myMessage?.text.length > 30
        ? `${myMessage?.text.substring(0, 30)}...`
        : myMessage?.text
      await sendPushNotification(otherUserEmail, currentMessage, user)
    }
    setImageUrl("")
    setImageData(null)
  }

  async function openCamera() {
    try {
      const result = await launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1
      })
      if (!result.canceled) {
        setImageData(result)
        await cameraImagePicker(result)
      }
    } catch (error) {
      console.log("Error opening camera:", error)
    }
  }

  async function cameraImagePicker(ImageData: any) {
    try {
      if (ImageData.assets && ImageData.assets.length > 0) {
        const storageRef = ref(storage, ImageData.assets[0].fileName)
        const imgBlob = await fetch(ImageData.assets[0].uri).then((res) =>
          res.blob()
        )
        await uploadBytes(storageRef, imgBlob)
        const url = await getDownloadURL(storageRef)
        setImageUrl(url)
      } else {
        console.log("No image assets found.")
      }
    } catch (error) {
      console.log("Error uploading photo:", error)
    }
  }

  async function imagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1
      })
      if (!result.canceled) {
        setImageData(result)
        await handleImageUpload(result)
      }
    } catch (error) {
      console.log("Error picking image:", error)
    }
  }

  async function handleImageUpload(ImageData: any) {
    try {
      const storageRef = ref(storage, ImageData.assets[0].fileName)
      const imgBlob = await fetch(ImageData.assets[0].uri).then((res) =>
        res.blob()
      )
      await uploadBytes(storageRef, imgBlob)
      const url = await getDownloadURL(storageRef)
      setImageUrl(url)
    } catch (error) {
      console.log("Error uploading photo:", error)
    }
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        alwaysShowSend
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user?.primaryEmailAddress?.emailAddress ?? "",
          name: user?.fullName ?? "",
          avatar: user?.imageUrl ?? ""
        }}
        textInputStyle={styles.textInput}
        renderSend={(props) => {
          const { text = "", onSend = () => {} } = props
          const currentUser = {
            _id: user?.primaryEmailAddress?.emailAddress ?? "",
            name: user?.fullName ?? "",
            avatar: user?.imageUrl ?? ""
          }
          function handleSend() {
            if (onSend) {
              if (text.trim().length === 0 && imageUrl !== "") {
                onSend([{ text: "", user: currentUser }], true)
              } else {
                onSend([{ text: text.trim(), user: currentUser }], true)
              }
            }
          }
          const canSend = text.trim().length > 0 || imageUrl !== ""
          return (
            <View style={styles.sendContainer}>
              {imageUrl !== "" ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageData.assets[0].uri }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      position: "absolute"
                    }}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImageUrl("")}
                  >
                    <Entypo name="circle-with-cross" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={() => imagePicker()}
              >
                <Feather name="paperclip" size={21} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => openCamera()}
              >
                <Feather name="camera" size={24} color="black" />
              </TouchableOpacity>
              {canSend && (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color="black"
                    style={styles.sendIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          )
        }}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar {...props} containerStyle={styles.inputToolbar} />
          )
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.PRIMARY
                }
              }}
            />
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "android" ? 10 : 17,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  textInput: {
    marginBottom: Platform.OS === "android" ? 6 : 8
  },
  sendContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 10,
    position: "relative"
  },
  removeImageButton: {
    position: "absolute",
    top: -7,
    right: -7,
    alignItems: "center",
    justifyContent: "center"
  },
  attachmentButton: {
    marginRight: 12
  },
  cameraButton: {
    marginRight: 12
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    paddingLeft: 5,
    width: 35,
    height: 35,
    marginRight: 8
  },
  sendIcon: {
    marginRight: 0
  },
  inputToolbar: {
    borderRadius: 99,
    backgroundColor: "#E0E0E0",
    paddingLeft: 5,
    alignItems: "center",
    maxWidth: Dimensions.get("window").width * 0.95,
    marginLeft: 10
  }
})
