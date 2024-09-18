interface User {
  docId?: string
  email: string
  imageUrl: string
  name: string
}

interface PetData {
  about: string
  address: string
  age: number
  breed: string
  category: string
  email: string
  id: string
  imageUrl: string
  name: string
  gender: string
  userImage: string
  userName: string
  weight: number
}

interface MenuItem {
  id: number
  name: string
  icon: string
  path: string
  color?: string
}

interface ChatRecord {
  id: string
  userIds: string[]
  users: User[]
}

interface FormData {
  name?: string
  category?: string
  breed?: string
  age?: string
  gender?: string
  weight?: string
  address?: string
  about?: string
}

interface Category {
  label: string
  value: string
}

interface CategoryData {
  name: string
  imageUrl: string
}

interface SliderItem {
  id: number
  imageUrl: string
  name: "string"
}

interface FavouriteData {
  email: string
  favourites: string[]
}

export {
  User,
  PetData,
  MenuItem,
  ChatRecord,
  FormData,
  Category,
  CategoryData,
  SliderItem,
  FavouriteData
}
