import { View, Text, Image, StyleSheet } from "react-native"
import React from "react"
import { Link } from "expo-router"
import { User } from "@/constants/Interfaces"

export default function UserItem({ userInfo }: Readonly<{ userInfo: User }>) {
  return (
    <Link href={`/chat?id=${userInfo?.docId}`}>
      <View style={styles.container}>
        {userInfo?.imageUrl ? (
          <Image source={{ uri: userInfo?.imageUrl }} style={styles.image} />
        ) : null}
        <Text style={styles.userName}>{userInfo?.name}</Text>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingTop: 5
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 99
  },
  userName: {
    fontFamily: "outfit",
    fontSize: 20
  }
})
