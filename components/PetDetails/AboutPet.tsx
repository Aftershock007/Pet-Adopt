import { View, Text, Pressable, StyleSheet } from "react-native"
import React, { useState } from "react"
import Colors from "../../constants/Colors"
import { PetData } from "@/constants/Interfaces"

export default function AboutPet({ pet }: Readonly<{ pet: PetData }>) {
  const [readMore, setReadMore] = useState(true)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About {pet?.name}</Text>
      <Text numberOfLines={readMore ? 3 : 20} style={styles.description}>
        {pet?.about}
      </Text>
      {readMore && (
        <Pressable onPress={() => setReadMore(false)}>
          <Text style={styles.readMoreText}>Read More</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 20
  },
  description: {
    fontFamily: "outfit",
    fontSize: 14
  },
  readMoreText: {
    fontFamily: "outfit-medium",
    fontSize: 14,
    color: Colors.SECONDARY
  }
})
