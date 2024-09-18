import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native"
import React, { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../config/FirebaseConfig"
import Colors from "../../constants/Colors"
import { CategoryData } from "@/constants/Interfaces"

export default function Category({
  category
}: Readonly<{ category: (name: string) => void }>) {
  const [categoryList, setCategoryList] = useState<CategoryData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("Dogs")

  useEffect(() => {
    GetCategories()
  }, [])

  async function GetCategories() {
    setCategoryList([])
    const snapshot = await getDocs(collection(db, "Category"))
    const categories: CategoryData[] = snapshot.docs.map(
      (doc) => doc.data() as CategoryData
    )
    setCategoryList(categories)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item.name)
              category(item.name)
            }}
            style={styles.touchable}
          >
            <View
              style={[
                styles.categoryContainer,
                selectedCategory === item.name &&
                  styles.selectedCategoryContainer
              ]}
            >
              <Image source={{ uri: item?.imageUrl }} style={styles.image} />
            </View>
            <Text style={styles.categoryName}>{item?.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 25
  },
  touchable: {
    flex: 1
  },
  categoryContainer: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    alignItems: "center",
    borderRadius: 11,
    margin: 7,
    marginTop: 10
  },
  selectedCategoryContainer: {
    backgroundColor: Colors.SECONDARY,
    borderColor: Colors.SECONDARY
  },
  image: {
    width: 40,
    height: 40
  },
  categoryName: {
    textAlign: "center",
    fontFamily: "outfit"
  }
})
