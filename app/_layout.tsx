import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { ClerkProvider } from "@clerk/clerk-expo"
import * as SecureStore from "expo-secure-store"
import * as SplashScreen from "expo-splash-screen"
import React, { useEffect } from "react"

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key)
    } catch (error) {
      console.error("SecureStore get item error: ", error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value)
    } catch (error) {
      console.log(error)
      return
    }
  }
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error("Missing Publishable Key")
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    outfit: require("@/assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("@/assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("@/assets/fonts/Outfit-Medium.ttf")
  })

  useEffect(() => {
    async function prepare() {
      if (!fontsLoaded) {
        await SplashScreen.preventAutoHideAsync()
      } else {
        await SplashScreen.hideAsync()
      }
    }
    prepare()
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <Stack screenOptions={{}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  )
}
