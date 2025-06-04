import React, { useEffect, useState } from "react";
import {
    View, StyleSheet, Text, TouchableOpacity,
    Pressable, FlatList
} from "react-native";
import {
    acceptRequestMakeFriend, checkFriendRequest, checkFriendShip,
    deleteFriend, deleteFriendRequest, getPostUserId, getUserProfile,
    sendRequestMakeFriend
} from "../services/userAPI";
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
import Post from "../components/Post";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OtherUserProfile() {
    const [dataUser, setDataUser] = useState<any>();
    const [userName, setUserName] = useState<string>("");
    const [avatar, setAvatar] = useState<Uint8Array>();
    const [background, setBackground] = useState<Uint8Array>();
    const [bio, setBio] = useState<string>("");
    const [numberOfFriends, setNumberOfFriends] = useState<number>();
    const [isFriendShip, setFriendShip] = useState<true | false | null>(null);
    const [isFriendRequest, setFriendRequest] = useState<true | false | null>(null);
    const [isPersonMakeFriendRequest, setPersonMakeFrindRequsest] = useState<true | false | null>(null);
    const [isShowAcceptOrDenyBox, setShowAcceptOrDenyBox] = useState(false);
    const [isShowUnFriendBox, setShowUnFriendBox] = useState(false);
    const [postList, setPostList] = useState<any>([]);
    const [isShowCommentContainer, setShowCommentContainer] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number>();
    const [isfetchAll, setFetchAll] = useState<true | false>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isFetching, setIsFetching] = useState(false);

    type ParamList = {
        OtherUserProfile: {
            userID: string;
        }
    }

    const route = useRoute<RouteProp<ParamList, 'OtherUserProfile'>>();

    useEffect(() => {
        const fetchAll = async () => {
            console.log("----------------------------------------");
            const myId = await AsyncStorage.getItem("myID");
            const myIdNumber = Number(myId);
            if (myId !== null) {
                console.log("myId, ", myIdNumber);
            }
            try {
                const { userID } = route.params;
                try {
                    console.log("abc");
                    const user = await getUserProfile(userID);
                    if (user) {
                        setDataUser(user);
                        setUserName(user.username);
                        setAvatar(user.avatar);
                        setBackground(user.backgroundImage);
                        setBio(user.bio);
                        setNumberOfFriends(user.numberOfFriends);
                    }
                    console.log("Run getUserProfile");
                } catch (error) {
                    const err = error as AxiosError;
                    if (err.response) {
                        console.error("Lỗi FetchAll: ", err.response.data);
                    } else {
                        console.error("Lỗi FetchAll (no response): ", err.message);
                    }
                }

                let isFriendTmp;
                try {
                    isFriendTmp = await checkFriendShip(userID);
                    setFriendShip(isFriendTmp);
                } catch (e) {
                    console.log("Loi checkFriendShip");
                }
                if (isFriendTmp !== true) {
                    const resCheckFriendRequest = await checkFriendRequest(userID);
                    console.log("resCheckFriendRequest: ", resCheckFriendRequest);
                    if (resCheckFriendRequest.length !== 0) {
                        setFriendRequest(true);
                        console.log("senderId: ", resCheckFriendRequest.senderId);
                        console.log("recipientId: ", resCheckFriendRequest.recipientId);
                        if (resCheckFriendRequest.senderId === myIdNumber) {
                            setPersonMakeFrindRequsest(true);
                            console.log("isPersonMakeFriendRequest: ", true);
                        } else {
                            setPersonMakeFrindRequsest(false);
                            console.log("isPersonMakeFriendRequest: ", false);
                        }
                    } else setFriendRequest(false);
                }
            } catch (error) {
                const err = error as AxiosError;

                if (err.response) {
                    console.error("Lỗi FetchAll (có phản hồi):", err.response.data);
                } else if (err.request) {
                    console.error("Lỗi FetchAll (request gửi đi nhưng không có phản hồi):", err.request);
                } else {
                    console.error("Lỗi FetchAll (lỗi khác):", err.message);
                }

                throw err; // hoặc return null, hoặc xử lý tuỳ trường hợp
            }
            setFetchAll(true);
        };
        fetchAll();
    }, []);

    useEffect(() => {
        const fetchNewestPost = async () => {
            if (isFetching) return;
            setIsFetching(true);
            try {
                if (dataUser) {
                    const postTmp = await getPostUserId(dataUser.id, pageNumber);
                    setPostList((prev: any) => [...prev, ...postTmp]);
                }
            } catch (e) {
                console.log("Lỗi lấy bài viết mới nhất: ", e);
            } finally {
                setIsFetching(false);
            }
        };
        fetchNewestPost();
    }, [pageNumber, dataUser?.id]);

    const handlePadSendAddFriend = async () => {
        const { userID } = route.params;
        try {
            const res = await sendRequestMakeFriend(userID);
            console.log("Response sendRequestMakeFriend: ", res);
            if (res === "Request sent") {
                setFriendRequest(true);
                setPersonMakeFrindRequsest(true);
            }
        } catch (e) {
            console.log("Loi AddFriend: ", e);
        }
    };

    const handlePadAcceptRequestMakeFriend = async () => {
        const { userID } = route.params;
        try {
            const res = await acceptRequestMakeFriend(userID);
            console.log("response AcceptRequestMakeFiend: ", res);
            if (res === "New friend request accepted") {
                setFriendShip(true);
                setFriendRequest(false);
            }
        } catch (e) {
            console.log("Loi AcceptRequestMakeFriend: ", e);
        }
    };

    const handlePadDeleteFriend = async () => {
        const { userID } = route.params;
        try {
            const res = await deleteFriend(userID);
            console.log("response DeleteFriend: ", res);
            if (res === "Friend deleted") {
                setFriendShip(false);
                setFriendRequest(false);
            }
        } catch (e) {
            console.log("Loi DeleteFriend: ", e);
        }
    };

    const handlePadDeleteRequestFriend = async (reverse = false) => {
        const { userID } = route.params;
        const myId = await AsyncStorage.getItem("myID");
        const fromId = isPersonMakeFriendRequest ? myId : userID;
        const toId = isPersonMakeFriendRequest ? userID : myId;

        console.log("fromId, toId", fromId, toId);

        try {
            const res = await deleteFriendRequest(fromId, toId);
            console.log("response deleteFriendRequest: ", res);
            if (res === "Friend request deleted") {
                setFriendShip(false);
                setFriendRequest(false);
            }
        } catch (e) {
            console.log("Loi deleteFriendRequest: ", e);
        }
    };

    const padComment = (postId: number) => {
        setShowCommentContainer(true);
        setSelectedPostId(postId);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {dataUser && isfetchAll &&
                <>
                    <FlatList
                        ListHeaderComponent={
                            <>
                                {avatar && background &&
                                    <AvatarAndBackground
                                        userAvatar={avatar}
                                        userBackground={background}
                                        onAvatarPress={() => { }}
                                        onBackgroundPress={() => { }}
                                    />
                                }
                                <View style={styles.content}>
                                    <Text style={styles.userName}>{userName}</Text>
                                    <TouchableOpacity>
                                        <Text style={{ fontSize: 17, fontWeight: 500 }}>{numberOfFriends} người bạn</Text>
                                    </TouchableOpacity>
                                    <View style={styles.action}>
                                        {isPersonMakeFriendRequest && isFriendRequest &&
                                            <TouchableOpacity style={styles.friend} onPress={() => handlePadDeleteRequestFriend(false)}>
                                                <SimpleLineIcons name="user-unfollow" size={20} color="white" />
                                                <Text style={styles.textAddFriend}>Hủy lời mời</Text>
                                            </TouchableOpacity>
                                        }
                                        {isFriendRequest && !isPersonMakeFriendRequest && !isFriendShip &&
                                            <TouchableOpacity style={styles.friend} onPress={() => setShowAcceptOrDenyBox(true)}>
                                                <AntDesign name="user" size={20} color="white" />
                                                <Text style={styles.textAddFriend}>Phản hồi</Text>
                                            </TouchableOpacity>
                                        }
                                        {!isFriendShip && !isFriendRequest &&
                                            <TouchableOpacity style={styles.friend} onPress={handlePadSendAddFriend}>
                                                <Entypo name="add-user" size={20} color="white" />
                                                <Text style={styles.textAddFriend}>Thêm bạn bè</Text>
                                            </TouchableOpacity>
                                        }
                                        {isFriendShip &&
                                            <TouchableOpacity style={styles.friend} onPress={() => setShowUnFriendBox(true)}>
                                                <FontAwesome5 name="user-friends" size={20} color="white" />
                                                <Text style={styles.textAddFriend}>Bạn bè</Text>
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity style={styles.messenger}>
                                            <FontAwesome5 name="facebook-messenger" size={20} color="black" />
                                            <Text style={styles.textMessenger}>Nhắn tin</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        }
                        data={postList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Post post={item} padComment={() => padComment(item.id)} />
                        )}
                        onEndReached={() => {
                            console.log("Reached end of list. Load more...");
                            setPageNumber(prev => prev + 1);
                        }}
                        onEndReachedThreshold={0.5}
                    />

                    {/* Modal Accept / Deny */}
                    {isShowAcceptOrDenyBox && (
                        <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowAcceptOrDenyBox(false)}>
                            <View style={styles.acceptOrDenyBoxContainer}>
                                <Pressable onPress={(e) => e.stopPropagation()}>
                                    <TouchableOpacity style={styles.acceptOrDenyBox} onPress={() => {
                                        handlePadAcceptRequestMakeFriend();
                                        setShowAcceptOrDenyBox(false);
                                    }}>
                                        <AntDesign name="check" size={24} color="white" />
                                        <Text style={{ color: "white", fontSize: 20, marginLeft: 5 }}>Chấp nhận</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.acceptOrDenyBox} onPress={() => {
                                        setShowAcceptOrDenyBox(false);
                                        handlePadDeleteRequestFriend(true);
                                    }}>
                                        <Feather name="user-x" size={24} color="white" />
                                        <Text style={{ color: "white", fontSize: 20, marginLeft: 5 }}>Từ chối</Text>
                                    </TouchableOpacity>
                                </Pressable>
                            </View>
                        </Pressable>
                    )}

                    {/* Modal Unfriend */}
                    {isShowUnFriendBox && (
                        <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowUnFriendBox(false)}>
                            <View style={styles.acceptOrDenyBoxContainer}>
                                <Pressable onPress={(e) => e.stopPropagation()}>
                                    <TouchableOpacity style={styles.acceptOrDenyBox} onPress={() => {
                                        setShowUnFriendBox(false);
                                        handlePadDeleteFriend();
                                    }}>
                                        <Feather name="user-x" size={24} color="white" />
                                        <Text style={{ color: "white", fontSize: 20, marginLeft: 5 }}>Hủy kết bạn</Text>
                                    </TouchableOpacity>
                                </Pressable>
                            </View>
                        </Pressable>
                    )}
                </>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        flexDirection: "row",
        marginBottom: 50
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
        fontWeight: "500",
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
        fontWeight: "500",
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
});
