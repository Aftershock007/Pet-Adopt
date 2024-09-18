import { Platform } from "react-native"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/config/FirebaseConfig"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

async function registerForPushNotificationsAsync() {
  let token
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C"
    })
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!")
    return
  }
  token = (await Notifications.getExpoPushTokenAsync()).data
  return token
}

async function registerAndStorePushToken(email: string) {
  let token
  if (Device.isDevice) {
    try {
      token = await registerForPushNotificationsAsync()
      if (token) {
        const userRef = doc(db, "Users", email)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          await setDoc(userRef, { pushToken: token }, { merge: true })
        } else {
          await setDoc(userRef, { email: email, pushToken: token })
        }
      }
    } catch (error) {
      console.error("Error storing push token:", error)
    }
  } else {
    console.log("Must use a physical device for Push Notifications")
  }
}

async function sendPushNotification(email: string, message: string, user: any) {
  try {
    const userSnap = await getDoc(doc(db, "Users", email))
    if (userSnap.exists()) {
      const userData = userSnap.data()
      if (userData?.pushToken) {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: userData.pushToken,
            sound: "default",
            title: `${user?.fullName || "Unknown"}`,
            body: message
          })
        })
        await response.json()
      } else {
        console.log("Push token not found for the user")
      }
    } else {
      console.log(`User not found with email ${email}`)
    }
  } catch (error) {
    console.error("Error fetching user document:", error)
  }
}

export { registerAndStorePushToken, sendPushNotification }
