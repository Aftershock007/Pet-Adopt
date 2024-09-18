import React, { useEffect, useState, useRef } from "react"
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent
} from "react-native"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../config/FirebaseConfig"
import Colors from "@/constants/Colors"
import { SliderItem } from "@/constants/Interfaces"

export default function Slider() {
  const [sliderList, setSliderList] = useState<SliderItem[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    async function GetSliders() {
      try {
        setSliderList([])
        const q = query(collection(db, "Sliders"), orderBy("id"))
        const snapshot = await getDocs(q)
        const sliders: SliderItem[] = snapshot.docs.map(
          (doc) => doc.data() as SliderItem
        )
        setSliderList(sliders)
      } catch (error) {
        console.error("Error fetching sliders:", error)
      }
    }
    GetSliders()
  }, [])

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const slideWidth = Dimensions.get("screen").width * 0.9 + 10
    const offsetX = event.nativeEvent.contentOffset.x
    const currentSlide = Math.round(offsetX / slideWidth)
    setCurrentIndex(currentSlide)
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item?.imageUrl }} style={styles.image} />
          </View>
        )}
      />
      <View style={styles.dotContainer}>
        {sliderList.map((item) => (
          <View
            key={item.id}
            style={[
              styles.dot,
              currentIndex ===
              sliderList.findIndex((slide) => slide.id === item.id)
                ? styles.activeDot
                : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15
  },
  image: {
    width: Dimensions.get("screen").width * 0.882,
    height: 170,
    borderRadius: 10,
    marginRight: 10
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5
  },
  activeDot: {
    backgroundColor: Colors.SECONDARY
  },
  inactiveDot: {
    backgroundColor: "#ccc"
  }
})
