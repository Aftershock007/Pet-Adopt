import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native"
import React from "react"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import Colors from "../../constants/Colors"
import { router } from "expo-router"

export default function NewPetOptions() {
  return (
    <TouchableOpacity
      onPress={() => router.push("/add-new-pet")}
      style={styles.addNewPetContainer}
    >
      <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
      <Text style={styles.addNewPetContainerText}>Add New Pet</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  addNewPetContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: Platform.OS === "android" ? 17 : 20,
    marginTop: Platform.OS === "android" ? 16 : 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 12,
    borderStyle: "dashed",
    justifyContent: "center",
    marginBottom: 25
  },
  addNewPetContainerText: {
    fontFamily: "outfit-medium",
    color: Colors.PRIMARY,
    fontSize: 18
  }
})
