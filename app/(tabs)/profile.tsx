import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  StyleSheet
} from "react-native"
import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { useAuth, useUser } from "@clerk/clerk-expo"
import { Href, useRouter } from "expo-router"
import Colors from "../../constants/Colors"
import { Menu } from "../../constants/Menu"

export default function Profile() {
  const { user } = useUser()
  const router = useRouter()
  const { signOut } = useAuth()

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
        <Text style={styles.profileName}>{user?.fullName}</Text>
        <Text style={styles.profileEmail}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>
      <FlatList
        data={Menu}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.replace(item.path as Href)}
            key={item?.id}
            style={styles.menuItem}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons
                name={item?.icon as "image"}
                size={30}
                color="#FFFFC5"
              />
            </View>
            <Text style={styles.menuItemText}>{item?.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
      <TouchableOpacity
        onPress={async () => {
          await signOut()
          router.replace("/")
        }}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    flex: 1
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    marginVertical: 25
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 99
  },
  profileName: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginTop: 6
  },
  profileEmail: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY
  },
  menuItem: {
    marginVertical: 6,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10
  },
  menuIconContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY
  },
  menuItemText: {
    fontFamily: "outfit",
    fontSize: 20
  },
  flatListContainer: {
    flexGrow: 1
  },
  logoutButton: {
    paddingVertical: 15,
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: Platform.OS === "android" ? 85 : 100,
    marginTop: "auto"
  },
  logoutButtonText: {
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 20,
    color: "white"
  }
})
