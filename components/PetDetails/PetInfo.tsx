import { View, Text, Image, StyleSheet } from "react-native"
import React from "react"
import Colors from "../../constants/Colors"
import MarkFavourite from "./MarkFavourite"
import { PetData } from "@/constants/Interfaces"

export default function PetInfo({ pet }: Readonly<{ pet: PetData }>) {
  return (
    <View>
      <Image source={{ uri: pet?.imageUrl }} style={styles.petImage} />
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.petName}>{pet?.name}</Text>
          <Text style={styles.petAddress}>{pet.address}</Text>
        </View>
        <MarkFavourite pet={pet} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  petImage: {
    width: "100%",
    height: 400,
    objectFit: "cover"
  },
  infoContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  petName: {
    fontFamily: "outfit-bold",
    fontSize: 27
  },
  petAddress: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY
  }
})
