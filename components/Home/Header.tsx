import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import React from "react"
import { useUser } from "@clerk/clerk-expo"
import { router } from "expo-router"

export default function Header() {
  const { user } = useUser()

  const handleImageTap = () => {
    router.push("/(tabs)/profile")
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userNameText}>{user?.fullName}</Text>
      </View>
      <TouchableOpacity onPress={handleImageTap}>
        <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  welcomeText: {
    fontFamily: "outfit",
    fontSize: 18
  },
  userNameText: {
    fontFamily: "outfit-medium",
    fontSize: 25
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 99
  }
})
