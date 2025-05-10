import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";

import AvatarAndBackground from "../components/AvatarAndBackground";
import MyImages from "../components/MyImages";
import MyVideos from "../components/MyVideos";
import { getUserProfile, updateUserAvatar, updateUserBackground } from "../services/userAPI";
import { useNavigation } from "@react-navigation/native";

export default function MyProFile() {
    const [userId, setUserId] = useState<number | null>(null)
    const [section, setSection] = useState("post");
    const [showUpdate, setShowUpdate] = useState<"avatar" | "background" | null>(null);
    const [showUpdateTmp, setShowUpdateTmp] = useState<"avatar" | "background" | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [imageSelected, setImageSelected] = useState<ImagePickerAsset | null>(null);

    const navigation = useNavigation<any>();

    type UserProfile = {
        id: number;
        username: string;
        bio: string;
        avatar: Uint8Array;
        backgroundImage: Uint8Array;
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userJSON = await AsyncStorage.getItem("dataCurrentUser");
                if (userJSON !== null) {
                    const currentUser = JSON.parse(userJSON);
                    setUserId(currentUser.id);
                    const profile = await getUserProfile(currentUser.id);
                    setUser(profile);
                }
            } catch (e) {
                console.error("Lỗi khi fetch user profile:", e);
            }
        };
        fetchUserProfile();
    }, []);


    const renderSection = () => {
        switch (section) {
            case "post":
                return <Text>My post</Text>;
            case "image":
                return <MyImages />;
            case "video":
                return <MyVideos />;
            default:
                return null;
        }
    };

    const handleTabSelect = (tab: string) => setSection(tab);
    const handleAvatarPress = () => {
        setShowUpdate("avatar");
        setShowUpdateTmp("avatar")
    }
    const handleBackgroundPress = () => {
        setShowUpdate("background");
        setShowUpdateTmp("background");
    }

    const padAddPost = () => {
        navigation.navigate("AddPost");
    }

    const handleImagePickerPress = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập thư viện ảnh!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const selected = result.assets[0];
            console.log("selected: ", selected);
            setImageSelected(selected);
            setShowUpdate(null)
        } else {
            console.log("Không có ảnh nào được chọn.");
        }
    };

    const handleUpdateAvatar = async () => {
        if (!imageSelected) {
            Alert.alert("Thông báo", "Vui lòng chọn ảnh trước!");
            return;
        }
        const localUri = imageSelected.uri;
        const fileName = localUri.split("/").pop() || "avatar.jpg";
        const fileType = imageSelected.type || "image";

        const formData = new FormData();
        formData.append('file', {
            uri: localUri,
            name: fileName,
            type: `${fileType}/${fileName.split(".").pop()}`,
        } as any);


        try {
            const response = await updateUserAvatar(formData);
            if (response === "Change Avatar Successfully!") {
                const fetchUserProfile = async () => {
                    try {
                        const userJSON = await AsyncStorage.getItem("dataCurrentUser");
                        if (userJSON !== null) {
                            const currentUser = JSON.parse(userJSON);
                            setUserId(currentUser.id);
                            if (userId) {
                                const profile = await getUserProfile(userId);
                                setUser(profile);
                            }
                        }
                    } catch (e) {
                        console.error("Lỗi khi fetch user profile:", e);
                    }
                };
                fetchUserProfile();
                alert("Thay đổi ảnh đại diện thành công!");
                setImageSelected(null);
            }
        } catch (e) {
            console.log("Loi updateAvatar", e);
        }

    }

    const handleUpdateBackground = async () => {
        if (!imageSelected) {
            Alert.alert("Thông báo", "Vui lòng chọn ảnh trước!");
            return;
        }

        const localUri = imageSelected.uri;
        const fileName = localUri.split("/").pop() || "avatar.jpg";
        const fileType = imageSelected.type || "image";

        const formData = new FormData();
        formData.append('file', {
            uri: localUri,
            name: fileName,
            type: `${fileType}/${fileName.split(".").pop()}`,
        } as any);


        try {
            const response = await updateUserBackground(formData);
            if (response === "Change Background Image Successfully!") {
                const fetchUserProfile = async () => {
                    try {
                        const userJSON = await AsyncStorage.getItem("dataCurrentUser");
                        if (userJSON !== null) {
                            const currentUser = JSON.parse(userJSON);
                            setUserId(currentUser.id);
                            if (userId) {
                                const profile = await getUserProfile(userId);
                                setUser(profile);
                            }
                        }
                    } catch (e) {
                        console.error("Lỗi khi fetch user profile:", e);
                    }
                };
                fetchUserProfile();
                alert("Thay đổi ảnh nền thành công!");
                setImageSelected(null);
            }
        } catch (e) {
            console.log("Loi updateBackground", e);
        }

    }

    return (
        <View style={{ flex: 1 }} >
            <ScrollView style={styles.container}>
                {user && (
                    <>
                        <AvatarAndBackground
                            userAvatar={user.avatar}
                            userBackground={user.backgroundImage}
                            onAvatarPress={handleAvatarPress}
                            onBackgroundPress={handleBackgroundPress}
                        />
                        <View style={styles.content}>
                            <Text style={styles.userName}>{user.username}</Text>
                            <Text>{user.bio}</Text>

                            <TouchableOpacity style={styles.buttonAddPost} onPress={padAddPost}>
                                <Text style={styles.textButtonAddPost}>+ Thêm bài viết</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonEditProfile}>
                                <Text style={styles.textButtonEditProfile}>Chỉnh sửa trang cá nhân</Text>
                            </TouchableOpacity>

                            <View style={styles.section}>
                                <TouchableOpacity
                                    onPress={() => handleTabSelect("post")}
                                    style={[
                                        styles.nameSection,
                                        section === "post" && styles.activeTab,
                                    ]}
                                >
                                    <Text style={styles.textSection}>Bài viết</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleTabSelect("image")}
                                    style={[
                                        styles.nameSection,
                                        section === "image" && styles.activeTab,
                                    ]}
                                >
                                    <Text style={styles.textSection}>Ảnh</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleTabSelect("video")}
                                    style={[
                                        styles.nameSection,
                                        section === "video" && styles.activeTab,
                                    ]}
                                >
                                    <Text style={styles.textSection}>Video</Text>
                                </TouchableOpacity>
                            </View>

                            {renderSection()}
                        </View>
                    </>
                )}
            </ScrollView>
            {imageSelected && (
                <View style={styles.previewContainer}>
                    <TouchableOpacity style={styles.exitButton} onPress={() => setImageSelected(null)}>
                        <Text style={styles.exitButtonText}>X</Text>
                    </TouchableOpacity>

                    <Text style={styles.previewText}>
                        {showUpdateTmp === "avatar" ? "Thay đổi ảnh đại diện" : "Thay đổi ảnh nền"}
                    </Text>
                    <Image source={{ uri: imageSelected.uri }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.uploadButton} onPress={showUpdateTmp === "avatar" ? handleUpdateAvatar : handleUpdateBackground}>
                        <Text style={styles.uploadButtonText}>Đăng</Text>
                    </TouchableOpacity>
                </View>
            )}

            {showUpdate && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => {
                        setShowUpdate(null);
                    }
                    }
                >
                    <View style={styles.fixedBottom}>
                        <TouchableOpacity
                            style={[
                                styles.updateButton,
                                showUpdateTmp === "avatar" ? styles.updateAvatar : styles.updateBackground,
                            ]}
                            onPress={handleImagePickerPress}
                        >
                            <Text style={styles.updateText}>
                                {showUpdateTmp === "avatar" ? "Thay đổi ảnh đại diện" : "Thay đổi ảnh nền"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
    },
    content: {
        marginTop: 70,
        marginHorizontal: 15,
    },
    userName: {
        fontSize: 25,
        fontWeight: "600",
    },
    buttonAddPost: {
        width: "100%",
        height: 35,
        backgroundColor: "#1877F2",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    textButtonAddPost: {
        fontSize: 17,
        color: "white",
        fontWeight: "700",
    },
    buttonEditProfile: {
        width: "100%",
        height: 35,
        backgroundColor: "#D3D3D3",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    textButtonEditProfile: {
        fontSize: 17,
        fontWeight: "700",
    },
    section: {
        flexDirection: "row",
        height: 50,
        alignItems: "center",
        marginTop: 20,
        borderTopWidth: 5,
        borderTopColor: "#ccc",
        paddingTop: 20,
        marginHorizontal: -15,
        paddingHorizontal: 15,
    },
    nameSection: {
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 30,
        marginLeft: 10,
    },
    textSection: {
        fontSize: 16,
        fontWeight: "500",
    },
    activeTab: {
        backgroundColor: "#D0E6FF",
        borderRadius: 5,
    },
    fixedBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        alignItems: "center",
    },
    updateButton: {
        marginVertical: 5,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#E6F0FF",
        width: "100%",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
    },
    updateText: {
        fontSize: 16,
        color: "#1877F2",
        fontWeight: "500",
    },
    updateAvatar: {},
    updateBackground: {},
    previewContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        paddingHorizontal: 20,
    },
    previewText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 15,
        borderWidth: 3,
        borderColor: "#fff",
        marginBottom: 30,
    },
    uploadButton: {
        backgroundColor: "#1877F2",
        borderRadius: 25,
        paddingHorizontal: 40,
        paddingVertical: 12,
        justifyContent: "center",
        alignItems: "center",
        width: "60%",
        marginTop: 20,
    },
    uploadButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    exitButton: {
        position: "absolute",
        top: 50,
        right: 20,
        padding: 10,
        zIndex: 1000,
    },
    exitButtonText: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
    },
});

