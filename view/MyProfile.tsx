import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AvatarAndBackground from "../components/AvatarAndBackground";
import MyPosts from "../components/MyPosts";
import MyImages from "../components/MyImages";
import MyVideos from "../components/MyVideos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RouteStackParamList} from "../routeParams";
import { getUserProfile } from "../service/userAPI";

type MyProfileRouteProp = RouteProp<RouteStackParamList, 'MyProfile'>;

export default function MyProFile({}) {
    type UserProfile = {
        id: number;
        username: string;
        bio: string;
        avatar: Uint8Array;
        backgroundImage: Uint8Array;
    }

    const [section, setSection] = useState("post");
    const route = useRoute<MyProfileRouteProp>();
    const { userId } = route.params;
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getUserProfile(userId);
                setUser(response);
            } catch (e) {
                console.error(e);
            }
        }
        fetchCurrentUser();
    }, [])

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

    return (
        <ScrollView style={styles.container}>
            {user && (
                <>
                    <AvatarAndBackground userAvatar={user.avatar} />
                    <View style={styles.content}>
                        <Text style={styles.userName}>{user?.username}</Text>
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
});
