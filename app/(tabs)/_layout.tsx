import React from "react"
import { Tabs } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { Platform } from "react-native"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00008F",
        tabBarStyle:
          Platform.OS === "android"
            ? {
                height: 60,
                paddingTop: 5,
                paddingBottom: 10
              }
            : { height: 80, paddingTop: 5 }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={Platform.OS === "android" ? 22 : 23}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favourite",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="heart"
              size={Platform.OS === "android" ? 22 : 23}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="myposts"
        options={{
          title: "Posts",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="bookmark"
              size={Platform.OS === "android" ? 22 : 23}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble"
              size={Platform.OS === "android" ? 22 : 23}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="user-alt"
              size={Platform.OS === "android" ? 22 : 23}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  )
}
