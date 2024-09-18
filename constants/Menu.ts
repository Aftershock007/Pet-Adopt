import { MenuItem } from "./Interfaces"

export const Menu: MenuItem[] = [
  {
    id: 1,
    name: "Favourite",
    icon: "heart",
    path: "/(tabs)/favorite"
  },
  {
    id: 2,
    name: "Posts",
    icon: "bookmark",
    path: "/(tabs)/myposts"
  },
  {
    id: 3,
    name: "Inbox",
    icon: "chatbubble",
    path: "/(tabs)/inbox"
  },
  {
    id: 4,
    name: "Add New Pet",
    icon: "add-circle",
    path: "/add-new-pet"
  }
]
