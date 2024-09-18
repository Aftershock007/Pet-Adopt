import { RefreshControl, ScrollView, StyleSheet } from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import { router, useFocusEffect } from "expo-router"
import { useUser } from "@clerk/clerk-expo"
import { SignIn } from "@clerk/clerk-react"
import {
  Header,
  Slider,
  PetListByCategory,
  NewPetOptions
} from "@/components/index"

export default function Home() {
  const [refreshing, setRefreshing] = useState(false)
  const [loadPetList, setLoadPetList] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    if (!user || !SignIn) {
      router.replace("/")
    }
  }, [user])

  useFocusEffect(
    useCallback(() => {
      setLoadPetList(true)
      return () => setLoadPetList(false)
    }, [])
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setLoadPetList(false)
    setTimeout(() => {
      setLoadPetList(true)
      setRefreshing(false)
    }, 1000)
  }, [])

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header />
      <Slider />
      {loadPetList && <PetListByCategory />}
      <NewPetOptions />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 18,
    marginTop: 20
  }
})
