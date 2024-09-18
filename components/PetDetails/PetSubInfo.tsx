import { StyleSheet, View } from "react-native"
import React from "react"
import PetSubInfoCard from "./PetSubInfoCard"
import { PetData } from "@/constants/Interfaces"

export default function PetSubInfo({ pet }: Readonly<{ pet: PetData }>) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <PetSubInfoCard
          icon={require("../../assets/images/calendar.png")}
          title={"Age"}
          value={`${pet?.age} Years`}
        />
        <PetSubInfoCard
          icon={require("../../assets/images/bone.png")}
          title={"Breed"}
          value={pet?.breed}
        />
      </View>
      <View style={styles.row}>
        <PetSubInfoCard
          icon={require("../../assets/images/sex.png")}
          title={"Gender"}
          value={pet?.gender}
        />
        <PetSubInfoCard
          icon={require("../../assets/images/weight.png")}
          title={"Weight"}
          value={`${pet?.weight} Kg`}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  row: {
    flexDirection: "row"
  }
})
