import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native"
import React, { useEffect, useState } from "react"
import { useNavigation, useRouter } from "expo-router"
import Colors from "../../constants/Colors"
import { Dropdown } from "react-native-element-dropdown"
import { collection, doc, getDocs, setDoc } from "firebase/firestore"
import { db, storage } from "../../config/FirebaseConfig"
import * as ImagePicker from "expo-image-picker"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useUser } from "@clerk/clerk-expo"
import { Category, FormData } from "@/constants/Interfaces"

export default function AddNewPet() {
  const navigation = useNavigation()
  const [formData, setFormData] = useState<FormData>({})
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [image, setImage] = useState<string | null>(null)
  const [loader, setLoader] = useState<boolean>(false)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerBackVisible: false
    })
    GetCategories()
  }, [navigation])

  async function GetCategories() {
    setCategoryList([])
    const snapshot = await getDocs(collection(db, "Category"))
    const categories = snapshot.docs.map((doc) => ({
      label: doc.data().name,
      value: doc.data().name
    }))
    setCategoryList(categories)
  }

  async function imagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })
    if (!result.canceled) {
      setImage(result?.assets[0]?.uri)
    }
  }

  function handleInputChange(fieldName: string, fieldValue: string) {
    setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }))
  }

  const genderData = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" }
  ]

  const [value1, setValue1] = useState<string | null>(null)
  const [value2, setValue2] = useState<string | null>(null)

  function onSubmit() {
    if (formData === undefined || Object.keys(formData).length !== 8) {
      Alert.alert("Enter all Field Details", "", [{ text: "OK" }])
      return
    }
    if (!image) {
      Alert.alert("Upload the Image", "", [{ text: "OK" }])
      return
    }
    UploadImage()
  }

  async function UploadImage() {
    setLoader(true)
    const res = await fetch(image ?? "")
    const blobImage = await res.blob()
    const storageRef = ref(storage, "/PetAdoptApp" + Date.now() + ".jpg")
    uploadBytes(storageRef, blobImage)
      .then(() => {
        console.log("File Uploaded")
      })
      .then(() => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          SaveFormData(downloadUrl)
        })
      })
  }

  async function SaveFormData(imageUrl: string) {
    const docId = Date.now().toString()
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUrl: imageUrl,
      userName: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      id: docId
    })
    setLoader(false)
    router.replace("/(tabs)/home")
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Add New Pet</Text>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.imageContainer} onPress={imagePicker}>
          {!image ? (
            <Image
              source={require("../../assets/images/placeholder.png")}
              style={styles.placeholderImage}
            />
          ) : (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          )}
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Name<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => handleInputChange("name", value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Category<Text style={styles.required}>*</Text>
          </Text>
          {categoryList.length > 0 && (
            <Dropdown
              style={styles.input}
              data={categoryList}
              labelField="label"
              valueField="value"
              value={value1}
              onChange={(item) => {
                handleInputChange("category", item.value)
                setValue1(item.value)
              }}
              placeholder="Select Category"
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              itemTextStyle={styles.dropdownItemText}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Breed<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => handleInputChange("breed", value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Age<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={(value) => handleInputChange("age", value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Gender<Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            style={styles.input}
            data={genderData}
            labelField="label"
            valueField="value"
            value={value2}
            onChange={(item) => {
              handleInputChange("gender", item.value)
              setValue2(item.value)
            }}
            placeholder="Select Gender"
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelectedText}
            itemTextStyle={styles.dropdownItemText}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Weight<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={(value) => handleInputChange("weight", value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Address<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => handleInputChange("address", value)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            About<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            numberOfLines={5}
            multiline={true}
            onChangeText={(value) => handleInputChange("about", value)}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={loader}
          onPress={onSubmit}
        >
          {loader ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomSpacing} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30,
    marginLeft: 21
  },
  scrollView: {
    padding: 20
  },
  imageContainer: {
    alignItems: "center"
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 99,
    backgroundColor: Colors.WHITE
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 99
  },
  inputContainer: {
    marginVertical: 5
  },
  input: {
    padding: Platform.OS === "android" ? 10 : 13,
    borderRadius: 7,
    backgroundColor: Colors.WHITE,
    fontFamily: "outfit"
  },
  label: {
    marginVertical: 5,
    fontFamily: "outfit"
  },
  required: {
    color: "red"
  },
  dropdownPlaceholder: {
    fontFamily: "Outfit",
    fontSize: 14
  },
  dropdownSelectedText: {
    fontFamily: "Outfit",
    fontSize: 14
  },
  dropdownItemText: {
    fontFamily: "Outfit",
    fontSize: 14
  },
  textArea: {
    height: 100
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom: 70
  },
  buttonText: {
    fontFamily: "outfit-medium",
    textAlign: "center"
  },
  bottomSpacing: {
    marginBottom: 20
  }
})
