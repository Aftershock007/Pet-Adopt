import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from "react-native"
import React, { useEffect } from "react"
import Colors from "../constants/Colors"
import * as WebBrowser from "expo-web-browser"
import { useAuth, useOAuth, useUser } from "@clerk/clerk-expo"
import * as Linking from "expo-linking"
import { router } from "expo-router"

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function SignInWithOAuth() {
  useWarmUpBrowser()
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" })

  async function onPress() {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL(
          "https://clerk.pet-adoption.in/v1/oauth_callback",
          { scheme: "petadopt" }
        )
      })
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      }
    } catch (error) {
      console.error("OAuth error:", error)
    }
  }

  const { isSignedIn } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    if (isSignedIn && user) {
      router.replace("/(tabs)/home")
    }
  }, [isSignedIn, user])

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/login.png")}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>Ready to make new friends?</Text>
        <Text style={styles.subText}>
          Let’s give a pet a loving home and make their life joyful once again
        </Text>
        <View style={styles.gifContainer}>
          <Image
            source={require("../assets/images/dog.gif")}
            style={styles.gif}
          />
          <Image
            source={require("../assets/images/cat.gif")}
            style={styles.gif}
          />
          <Image
            source={require("../assets/images/bird.gif")}
            style={styles.gif}
          />
        </View>
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    height: "100%"
  },
  image: {
    width: "100%",
    height: Dimensions.get("window").height * 0.6
  },
  textContainer: {
    padding: 20,
    alignItems: "center"
  },
  mainText: {
    fontFamily: "outfit-bold",
    fontSize: 25,
    textAlign: "center",
    marginTop: -40
  },
  subText: {
    fontFamily: "outfit",
    fontSize: 18,
    textAlign: "center",
    color: Colors.GRAY,
    marginTop: 10
  },
  gifContainer: {
    flexDirection: "row",
    marginBottom: 40
  },
  gif: {
    width: 100,
    height: 100,
    marginTop: 30,
    marginHorizontal: 10
  },
  button: {
    padding: 14,
    backgroundColor: Colors.PRIMARY,
    width: "100%",
    borderRadius: 12
  },
  buttonText: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    textAlign: "center"
  }
})
