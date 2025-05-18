import React, { useState, useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, Image, Alert,
    ScrollView, ImageBackground
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import getImageMime from "../services/getImageFromUnit8";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { createNewPost } from "../services/userAPI";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Asset } from "expo-asset";

export default function AddPost() {
    type User = {
        id: number;
        username: string;
        avatar: Uint8Array;
    };

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedImages, setSelectedImages] = useState<ImagePickerAsset[]>([]);
    const [isColor, setColor] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState<number | null>(null); // require(...) trả về number
    const [isSelectedImagesEdit, setSelectedImagesEdit] = useState(false);
    const [content, setContent] = useState<string>("");
    const [privacy, setPrivacy] = useState(false);
    const [isSetPrivacy, setIsPrivacy] = useState(false);

    const colorMap = [
        require('../assets/picture/backgroundColor/color1.jpg'),
        require('../assets/picture/backgroundColor/color2.jpg'),
        require('../assets/picture/backgroundColor/color3.jpg'),
        require('../assets/picture/backgroundColor/color4.jpg'),
        require('../assets/picture/backgroundColor/color5.jpg'),
        require('../assets/picture/backgroundColor/color6.jpg'),
    ];

    const handleColor = () => {
        if (isColor) {
            setColor(false);
            setBackgroundColor(null);
        } else {
            setColor(true);
        }
    };

    const handlePadSelectedImagesEdit = () => {
        setSelectedImagesEdit(!isSelectedImagesEdit);
    };

    const handleRemoveImage = (index: number) => {
        const updated = [...selectedImages];
        updated.splice(index, 1);
        setSelectedImages(updated);
        if (updated.length === 0) {
            setSelectedImagesEdit(false);
        }
    };

    const handlePost = async () => {
        if (content === "" && selectedImages.length === 0) {
            alert("Bạn cần thêm nội dung hoặc ảnh cho bài viết!");
            return;
        }

        const formData = new FormData();

        formData.append("data", JSON.stringify({
            content,
            privacy: privacy ? "PRIVATE" : "PUBLIC"
        }));

        if (selectedImages.length > 0) {
            selectedImages.forEach((image, index) => {
                const uriParts = image.uri.split(".");
                const fileType = uriParts[uriParts.length - 1];
                formData.append("files", {
                    uri: image.uri,
                    name: `photo_${index}.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            });
            formData.append('postBackground', '');
        } else if (backgroundColor !== null) {
            const asset = Asset.fromModule(backgroundColor);
            await asset.downloadAsync();
            formData.append('files', '');
            formData.append("postBackground", {
                uri: asset.localUri || asset.uri,
                name: 'background.jpg',
                type: 'image/jpeg',
            } as any);
        } else {
            formData.append("files", '');
            formData.append("postBackground", '');
        }

        try {
            const response = await createNewPost(formData);
            console.log(response);
            if (response === "Post created successfully") {
                alert("Bạn đã đăng bài thành công!");
            }
        } catch (e) {
            console.error("Lỗi đăng bài viết:", e);
        }
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const tmp = await AsyncStorage.getItem('dataCurrentUser');
                if (tmp != null) setCurrentUser(JSON.parse(tmp));
            } catch (e) {
                console.error(e);
            }
        };
        fetchCurrentUser();
    }, []);

    const handleImagePickerPress = async () => {
        if (isColor) return;
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập thư viện ảnh!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setSelectedImages(result.assets);
        } else {
            console.log("Không có ảnh nào được chọn.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.addPostHeader}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.text1, { marginLeft: 15 }]}>Tạo bài viết</Text>
                <TouchableOpacity onPress={handlePost}>
                    <Text style={styles.postPress}>Đăng</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.currentUser}>
                <Image
                    source={{ uri: `data:${getImageMime(currentUser?.avatar)};base64,${currentUser?.avatar}` }}
                    style={styles.imgAvatar}
                />
                <Text style={styles.userName}>{currentUser?.username}</Text>
            </View>

            <TouchableOpacity style={styles.buttomPrivacy} onPress={() => setIsPrivacy(true)}>
                {privacy ?
                    <FontAwesome5 name="user-friends" size={24} color="black" />
                    :
                    <AntDesign name="earth" size={24} color="black" />
                }
                <Text style={{ marginLeft: 10, fontSize: 15, fontWeight: '600' }}>
                    {privacy ? "Bạn bè" : "Công khai"}
                </Text>
                <MaterialIcons name="expand-more" size={24} color="black" />
            </TouchableOpacity>

            {isSetPrivacy && (
                <View style={styles.sellectedPrivacy}>
                    <TouchableOpacity onPress={() => { setIsPrivacy(false); setPrivacy(false); }}>
                        <AntDesign name="earth" size={24} color="black" />
                        <Text style={{ marginLeft: 10 }}>Công khai</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setIsPrivacy(false); setPrivacy(true); }}>
                        <FontAwesome5 name="user-friends" size={24} color="black" />
                        <Text style={{ marginLeft: 10 }}>Bạn bè</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ImageBackground source={backgroundColor ?? undefined} style={{ padding: 10 }}>
                <TextInput
                    placeholder="Bạn đang nghĩ gì?"
                    style={[styles.textInput, { backgroundColor: 'transparent' }]}
                    multiline
                    placeholderTextColor={backgroundColor ? 'white' : 'black'}
                    textColor={backgroundColor ? 'white' : 'black'}
                    value={content}
                    onChangeText={setContent}
                />
            </ImageBackground>

            {!isColor && selectedImages.length === 0 && (
                <TouchableOpacity onPress={handleColor} style={{ marginTop: 20 }}>
                    <Ionicons name="color-fill-outline" size={30} color="red" />
                </TouchableOpacity>
            )}

            {isColor && (
                <View style={styles.backgroundColorContainer}>
                    <TouchableOpacity onPress={handleColor}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    {colorMap.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => setBackgroundColor(item)}>
                            <Image source={item} style={styles.backgroundColorButton} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <TouchableOpacity onPress={handleImagePickerPress} disabled={isColor}>
                <Text style={[
                    styles.buttonAddMedia,
                    backgroundColor === null ? { backgroundColor: '#1877F2', color: "white" } : { opacity: 0.5 }
                ]}>
                    Thêm Ảnh/ Video
                </Text>
            </TouchableOpacity>

            {selectedImages.length > 0 && (
                <View>
                    <TouchableOpacity onPress={handlePadSelectedImagesEdit}>
                        <Text style={styles.selectedImageEdit}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        {selectedImages.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                                {isSelectedImagesEdit && (
                                    <TouchableOpacity
                                        onPress={() => handleRemoveImage(index)}
                                        style={styles.removeImageButton}
                                    >
                                        <Ionicons name="close-circle" size={20} color="red" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 40,
        paddingHorizontal: 10,
    },
    addPostHeader: {
        padding: 10,
        flexDirection: 'row',
        alignItems: "center"
    },
    text1: {
        fontSize: 20
    },
    postPress: {
        marginLeft: 160,
        fontSize: 16,
        fontWeight: "700",
        paddingVertical: 5,
        paddingHorizontal: 15,
        color: "white",
        backgroundColor: "#1877F2",
        borderRadius: 5
    },
    currentUser: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10
    },
    imgAvatar: {
        width: 60,
        height: 60,
        marginLeft: 5,
        borderRadius: 30
    },
    userName: {
        fontSize: 18,
        fontWeight: "500",
        marginLeft: 10
    },
    textInput: {
        minHeight: 200,
        marginTop: 10,
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    backgroundColorContainer: {
        marginTop: 20,
        width: "100%",
        flexDirection: "row"
    },
    backgroundColorButton: {
        height: 30,
        width: 30,
        borderRadius: 30,
        marginLeft: 20
    },
    buttonAddMedia: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        alignSelf: 'center',
        padding: 10,
        fontSize: 16
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 15,
    },
    selectedImage: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 10,
    },
    selectedImageEdit: {
        color: "#1877F2",
        marginLeft: 300,
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    imageWrapper: {
        position: 'relative',
    },
    removeImageButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    buttomPrivacy: {
        width: 140,
        flexDirection: "row",
        marginLeft: 20,
        marginTop: 20,
        alignItems: "center",
        backgroundColor: "#E0E0E0",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 5
    },
    sellectedPrivacy: {
        width: 140,
        marginLeft: 20,
        marginTop: 5,
        backgroundColor: "#E0E0E0",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 5
    }
});
