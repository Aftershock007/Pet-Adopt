import { Pressable, View } from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import Ionicons from "@expo/vector-icons/Ionicons"
import Shared from "../../Shared/Shared"
import { useUser } from "@clerk/clerk-expo"
import { PetData } from "@/constants/Interfaces"
import { UserResource } from "@clerk/types"

export default function MarkFavourite({
  pet,
  color = "black"
}: Readonly<{ pet: PetData; color?: string }>) {
  const { user } = useUser()
  const [favouriteList, setFavouriteList] = useState<string[]>([])

  const GetFavourite = useCallback(async () => {
    const result = await Shared.GetFavouriteList(user as UserResource)
    setFavouriteList(result?.favourites ? result.favourites : [])
  }, [user])

  useEffect(() => {
    user && GetFavourite()
  }, [GetFavourite, user])

  async function AddToFavourite() {
    const favouriteResult = favouriteList
    favouriteResult.push(pet?.id)
    await Shared.UpdateFavourite(user as UserResource, favouriteResult)
    GetFavourite()
  }

  async function removeFromFavourite() {
    const favouriteResult = favouriteList.filter((item) => item !== pet.id)
    await Shared.UpdateFavourite(user as UserResource, favouriteResult)
    GetFavourite()
  }

  return (
    <View>
      {favouriteList?.includes(pet?.id) ? (
        <Pressable onPress={removeFromFavourite}>
          <Ionicons name="heart" size={30} color="red" />
        </Pressable>
      ) : (
        <Pressable onPress={() => AddToFavourite()}>
          <Ionicons name="heart-outline" size={30} color={color} />
        </Pressable>
      )}
    </View>
  )
}
