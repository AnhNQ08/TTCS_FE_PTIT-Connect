import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AvatarAndBackground from "../components/AvatarAndBackground";
import MyPosts from "../components/MyPosts";
import MyImages from "../components/MyImages";
import MyVideos from "../components/MyVideos";
import { getUserProfile } from "../service/userAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyProFile() {
    const [section, setSection] = useState("post");
    const [showUpdate, setShowUpdate] = useState<"avatar" | "background" | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);

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
                    const userId = currentUser.id;
                    console.log(userId);
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
    }, []);


    const renderSection = () => {
        switch (section) {
            case "post":
                return <MyPosts />;
            case "image":
                return <MyImages />;
            case "video":
                return <MyVideos />;
            default:
                return null;
        }
    };

    const handleTabSelect = (tab: string) => {
        setSection(tab);
    };

    const handleAvatarPress = () => {
        setShowUpdate("avatar");
    };

    const handleBackgroundPress = () => {
        setShowUpdate("background");
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                {user && (
                    <>
                        <AvatarAndBackground
                            userAvatar={user.avatar}
                            userBackground={user.backgroundImage}
                            onAvatarPress={handleAvatarPress}  // Thêm onPress cho avatar
                            onBackgroundPress={handleBackgroundPress}  // Thêm onPress cho background
                        />

                        <View style={styles.content}>
                            <Text style={styles.userName}>{user.username}</Text>
                            <Text>{user.bio}</Text>

                            <TouchableOpacity style={styles.buttonAddPost}>
                                <Text style={styles.textButtonAddPost}>+ Thêm bài viết</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonEditProfile}>
                                <Text style={styles.textButtonEditProfile}>Chỉnh sửa trang cá nhân</Text>
                            </TouchableOpacity>

                            <View style={styles.section}>
                                <TouchableOpacity
                                    onPress={() => handleTabSelect("post")}
                                    style={[styles.nameSection, section === "post" && styles.activeTab]}
                                >
                                    <Text style={styles.textSection}>Bài viết</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleTabSelect("image")}
                                    style={[styles.nameSection, section === "image" && styles.activeTab]}
                                >
                                    <Text style={styles.textSection}>Ảnh</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleTabSelect("video")}
                                    style={[styles.nameSection, section === "video" && styles.activeTab]}
                                >
                                    <Text style={styles.textSection}>Video</Text>
                                </TouchableOpacity>
                            </View>

                            {renderSection()}
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Hiển thị các nút khi người dùng nhấn vào avatar hoặc background */}
            {showUpdate && (
                <View style={styles.fixedBottom}>
                    {showUpdate === "avatar" && (
                        <TouchableOpacity style={[styles.updateButton, styles.updateAvatar]}>
                            <Text style={styles.updateText}>Thay đổi ảnh đại diện</Text>
                        </TouchableOpacity>
                    )}

                    {showUpdate === "background" && (
                        <TouchableOpacity style={[styles.updateButton, styles.updateBackground]}>
                            <Text style={styles.updateText}>Thay đổi ảnh nền</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
    updateText: {
        fontSize: 16,
        color: "#1877F2",
        fontWeight: "500",
    },
    updateAvatar: {},
    updateBackground: {},
});
