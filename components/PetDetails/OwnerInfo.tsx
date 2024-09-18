import { View, Text, Image, StyleSheet } from "react-native"
import React from "react"
import Colors from "../../constants/Colors"
import { PetData } from "@/constants/Interfaces"

export default function OwnerInfo({ pet }: Readonly<{ pet: PetData }>) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image source={{ uri: pet?.userImage }} style={styles.userImage} />
        <View>
          <Text style={styles.userName}>{pet?.userName}</Text>
          <Text style={styles.userRole}>Pet Owner</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingHorizontal: 18,
    borderRadius: 12,
    padding: 15,
    backgroundColor: Colors.WHITE,
    justifyContent: "space-between"
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 99
  },
  userName: {
    fontFamily: "outfit-medium",
    fontSize: 17
  },
  userRole: {
    fontFamily: "outfit",
    color: Colors.GRAY
  }
})
