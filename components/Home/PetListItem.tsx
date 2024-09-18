import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet
} from "react-native"
import React from "react"
import Colors from "../../constants/Colors"
import { router } from "expo-router"
import MarkFavourite from "../PetDetails/MarkFavourite"
import { PetData } from "@/constants/Interfaces"

export default function PetListItem({ pet }: Readonly<{ pet: PetData }>) {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/pet-details",
          params: pet as any
        })
      }
      style={styles.card}
    >
      <View style={styles.favouriteIconContainer}>
        <MarkFavourite pet={pet} color={Colors.WHITE} />
      </View>
      <Image source={{ uri: pet?.imageUrl }} style={styles.petImage} />
      <Text style={styles.petName}>
        {pet?.name?.length > 20 ? `${pet.name.substring(0, 20)}...` : pet.name}
      </Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.breedText}>
          {pet?.breed?.length > 12
            ? `${pet.breed.substring(0, 12)}...`
            : pet.breed}
        </Text>
        <Text style={styles.ageBadge}>{pet?.age} YRS</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginRight: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 12
  },
  favouriteIconContainer: {
    position: "absolute",
    zIndex: 10,
    right: 10,
    top: 10
  },
  petImage: {
    width: Platform.OS === "android" ? 140 : 150,
    height: 135,
    objectFit: "cover",
    borderRadius: 10
  },
  petName: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    marginTop: 3
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  breedText: {
    color: Colors.GRAY,
    fontFamily: "outfit"
  },
  ageBadge: {
    fontFamily: "outfit",
    color: Colors.PRIMARY,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    backgroundColor: Colors.LIGHT_PRIMARY,
    overflow: "hidden"
  }
})
