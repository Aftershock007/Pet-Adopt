import { View, ScrollView } from "react-native"
import React, { useEffect } from "react"
import { useLocalSearchParams, useNavigation } from "expo-router"
import {
  PetInfo,
  PetSubInfo,
  AboutPet,
  OwnerInfo,
  AdoptMe
} from "@/components/index"
import { PetData } from "@/constants/Interfaces"

export default function PageDetails() {
  const pet = useLocalSearchParams() as unknown as PetData
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: " ",
      headerBackVisible: false
    })
  }, [navigation])

  return (
    <View>
      <ScrollView>
        <PetInfo pet={pet} />
        <PetSubInfo pet={pet} />
        <AboutPet pet={pet} />
        <OwnerInfo pet={pet} />
        <AdoptMe pet={pet} />
      </ScrollView>
    </View>
  )
}
