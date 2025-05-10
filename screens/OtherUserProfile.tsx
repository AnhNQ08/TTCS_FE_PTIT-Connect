import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Pressable, TouchableWithoutFeedback } from "react-native";
import { acceptRequestMakeFriend, checkFriendRequest, checkFriendShip, deleteFriend, deleteFriendRequest, getUserProfile, sendRequestMakeFriend } from "../services/userAPI";
import { RouteProp, useRoute } from "@react-navigation/native";
import AvatarAndBackground from "../components/AvatarAndBackground";
import { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from "react-native-vector-icons/AntDesign";
import { Feather } from "@expo/vector-icons";



export default function OtherUserProfile() {
    const [dataUser, setDataUser] = useState<UserProfile | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [avatar, setAvatar] = useState<Uint8Array>(); // base64
    const [background, setBackground] = useState<Uint8Array>(); // base64
    const [bio, setBio] = useState<string>("");
    const [isFriendShip, setFriendShip] = useState<true | false>();
    const [isFriendRequest, setFriendRequest] = useState<true | false>();
    const [isPersonMakeFriendRequest, setPersonMakeFrindRequsest] = useState<true | false>();
    const [isShowAcceptOrDenyBox, setShowAcceptOrDenyBox] = useState<true | false>(false);
    const [isShowUnFriendBox, setShowUnFriendBox] = useState<true | false>(false);

    type UserProfile = {
        id: number;
        username: string;
        bio: string;
        avatar: Uint8Array;
        backgroundImage: Uint8Array;
    };

    type ParamList = {
        OtherUserProfile: {
            userID: string;
        }
    }

    const route = useRoute<RouteProp<ParamList, 'OtherUserProfile'>>();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { userID } = route.params;
                const dataUserTmp = await getUserProfile(userID);
                setDataUser(dataUserTmp);
                if (dataUserTmp) {
                    setUserName(dataUserTmp.username);
                    setAvatar(dataUserTmp.avatar);
                    setBackground(dataUserTmp.backgroundImage);
                    setBio(dataUserTmp.bio);
                }
            } catch (error) {
                const err = error as AxiosError;
                console.error("Lỗi khi gọi API getUser:", err.response?.data || err.message);
                throw error;
            }
        };

        const fetchCheckFriend = async () => {
            try {
                const { userID } = route.params;
                const isFriendShipTmp = await checkFriendShip(userID);
                console.log("checkFriend: ", isFriendShipTmp);
                setFriendShip(isFriendShipTmp);
            } catch (e) {
                console.log("Sai fetchCheckFriend: ", e);
            }
        }

        const fetchCheckFriendRequest = async () => {
            try {
                const { userID } = route.params;
                const response = await checkFriendRequest(userID);
                console.log("friendRequest: ", response.length);
                if (response.length !== 0) {
                    setFriendRequest(true);
                    if (response.recipientId === userID) {
                        setPersonMakeFrindRequsest(true);
                    } else {
                        setPersonMakeFrindRequsest(false);
                    }
                } else {
                    setFriendRequest(false);
                }
            } catch (e) {
                console.log("Loi fetchFriendRequest: ", e);
            }
        }
        fetchUser();
        fetchCheckFriend();
        fetchCheckFriendRequest();
    }, []);

    const fetchSendRequestMakeFriend = async () => {
        try {
            const { userID } = route.params;
            const response = await sendRequestMakeFriend(userID);
            if (response === "Request sent") {
                setFriendRequest(true);
                setPersonMakeFrindRequsest(true);
            }
        } catch (e) {
            console.log("Loi fetchSendRequestMakeFriend: ", e);
        }
    }

    const handlePadAddFriend = async () => {
        await fetchSendRequestMakeFriend();
    }

    const fetchAcceptRequestMakeFriend = async () => {
        try {
            const { userID } = route.params;
            const response = await acceptRequestMakeFriend(userID);
            if (response === "New friend request accepted") {
                setFriendShip(true);
                setFriendRequest(false);
            }
        } catch (e) {
            console.log("Loi fetchAcceptRequestMakeFriend: ", e);
        }
    }

    const handlePadAcceptRequestMakeFriend = async () => {
        await fetchAcceptRequestMakeFriend();
    }

    const fetchDeleteFriend = async () => {
        try {
            const { userID } = route.params;
            const response = await deleteFriend(userID);
            if (response === "Friend deleted") {
                setFriendShip(false);
                setFriendRequest(false);
            }
        } catch (e) {
            console.log("Loi fetchDeleteFriend: ", e);
        }
    }

    const handlePadDeleteFriend = async () => {
        await fetchDeleteFriend();
    }

    const fetchDeleteRequestFriend1 = async () => {
        try {
            const { userID } = route.params;
            let currentUSerId
            const userJSON = await AsyncStorage.getItem("dataCurrentUser");
            if (userJSON !== null) {
                const currentUser = JSON.parse(userJSON);
                currentUSerId = currentUser.id;
            }
            const response = await deleteFriendRequest(currentUSerId, userID);
            if (response === "Friend request deleted") {
                setFriendShip(false);
                setFriendRequest(false);
            }
        } catch (e) {
            console.log("Loi fetchDeleteRequestFriend: ", e);
        }
    }

    const handlePadDeleteRequestFriend1 = async () => {
        await fetchDeleteRequestFriend1();
    }

    return (
        <>
            {dataUser &&
                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.container}>
                        <>
                            {
                                avatar && background &&
                                <AvatarAndBackground
                                    userAvatar={avatar}
                                    userBackground={background}
                                    onAvatarPress={() => { return }}
                                    onBackgroundPress={() => { return }}
                                />
                            }
                            <View style={styles.content}>
                                <Text style={styles.userName}>{userName}</Text>
                                <View style={styles.action}>
                                    {
                                        isFriendRequest === true && isPersonMakeFriendRequest === true && isFriendShip === false &&
                                        <TouchableOpacity style={styles.friend} onPress={handlePadDeleteRequestFriend1}>
                                            <SimpleLineIcons name="user-unfollow" size={20} color="white" />
                                            <Text style={styles.textAddFriend}>
                                                Hủy lời mời
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                    {
                                        isFriendRequest === true && isPersonMakeFriendRequest === false && isFriendShip === false &&
                                        <TouchableOpacity style={styles.friend} onPress={() => { setShowAcceptOrDenyBox(true) }}>
                                            <AntDesign name="user" size={20} color="white" />
                                            <Text style={styles.textAddFriend}>
                                                Phản hồi
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                    {
                                        isFriendShip === false && isFriendRequest === false &&
                                        <TouchableOpacity style={styles.friend} onPress={handlePadAddFriend}>
                                            <Entypo name="add-user" size={20} color="white" />
                                            <Text style={styles.textAddFriend}>
                                                Thêm bạn bè
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                    {
                                        isFriendShip === true &&
                                        <TouchableOpacity style={styles.friend} onPress={() => { setShowUnFriendBox(true) }}>
                                            <FontAwesome5 name="user-friends" size={20} color="white" />
                                            <Text style={styles.textAddFriend}>
                                                Bạn bè
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity style={styles.messenger}>
                                        <FontAwesome5 name="facebook-messenger" size={20} color="black" />
                                        <Text style={styles.textMessenger}>
                                            Nhắn tin
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    </ScrollView>
                    {isShowAcceptOrDenyBox && (
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={() => setShowAcceptOrDenyBox(false)}
                        >
                            <View style={styles.acceptOrDenyBoxContainer}>
                                <Pressable
                                    onPress={(e) => e.stopPropagation()} // Ngăn sự kiện onPress lan ra ngoài
                                >
                                    <TouchableOpacity style={styles.acceptOrDenyBox} onPress={handlePadAcceptRequestMakeFriend}>
                                        <AntDesign name="check" size={24} color="white" />
                                        <Text style={{ color: "white", fontSize: 20, marginLeft: 5 }}>Chấp nhận</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.acceptOrDenyBox} onPress={() => setShowAcceptOrDenyBox(false)}>
                                        <Feather name="user-x" size={24} color="white" />
                                        <Text style={{ color: "white", fontSize: 20, marginLeft: 5 }}>Từ chối</Text>
                                    </TouchableOpacity>
                                </Pressable>
                            </View>
                        </Pressable>
                    )}
                    {isShowUnFriendBox && (
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={() => setShowUnFriendBox(false)}
                        >
                            <View style={styles.acceptOrDenyBoxContainer}>
                                <Pressable onPress={(e) => e.stopPropagation()}>
                                    <TouchableOpacity style={styles.acceptOrDenyBox} onPress={handlePadDeleteFriend}>
                                        <Feather name="user-x" size={24} color="white" />
                                        <Text style={{ color: "white", fontSize: 20, marginLeft: 5 }}>Hủy kết bạn</Text>
                                    </TouchableOpacity>
                                </Pressable>
                            </View>
                        </Pressable>
                    )}
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50
    },
    content: {
        marginTop: 70,
        marginHorizontal: 15,
    },
    userName: {
        fontSize: 25,
        fontWeight: "600",
    },
    action: {
        marginTop: 30,
        display: "flex",
        flexDirection: "row"
    },
    friend: {
        flexDirection: "row",
        height: 50,
        width: 180,
        backgroundColor: "#1877F2",
        borderRadius: 10,
        gap: 5,
        alignItems: 'center',
        justifyContent: "center",
        marginRight: 10
    },
    textAddFriend: {
        fontSize: 17,
        fontWeight: 500,
        color: "white"
    },
    messenger: {
        flexDirection: "row",
        height: 50,
        width: 180,
        backgroundColor: "#D3D3D3",
        borderRadius: 10,
        gap: 5,
        alignItems: 'center',
        justifyContent: "center"
    },
    textMessenger: {
        fontSize: 17,
        fontWeight: 500,
        color: "black"
    },
    acceptOrDenyBoxContainer: {
        paddingTop: 20,
        backgroundColor: "#D3D3D3",
        position: "absolute",
        bottom: 0,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    acceptOrDenyBox: {
        flexDirection: "row",
        width: 350,
        justifyContent: "center",
        alignContent: "center",
        padding: 10,
        backgroundColor: "#1877F2",
        borderRadius: 10,
        marginBottom: 5
    }
})
