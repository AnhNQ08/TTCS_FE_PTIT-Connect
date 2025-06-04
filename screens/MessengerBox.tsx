import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import HeaderMessengerBox from "../components/MessengerBox/HeaderMessengerBox";
import SentMessengerLine from "../components/MessengerBox/SentMessengerLine";
import MyMessengerLine from "../components/MessengerBox/MyMessenger";
import BottomMessenger from "../components/MessengerBox/BottomMessenger";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getAllMessenger } from "../services/message";
import { getCurrentUser } from "../services/userAPI";

type ParamList = {
    MessengerBox: {
        conversationId: string
    }
}

type SenderType = {
    id: number,
    username: string,
    avatar: string
}

type MessengerType = {
    id: string,
    content: string,
    type: string,
    conversationId: string,
    sender: SenderType,
    sentAt: string | null,
    mediaList: []
}

type userCurrentType = {
    id: number,
    username: string,
    avatar: string
}

export default function MessengerBox() {

    const route = useRoute<RouteProp<{
        MessengerBox: {
            conversationId: string;
            conversationAvatar: string;
            conversationName: string;
            conversationType: string;
        }
    }, 'MessengerBox'>>();

    const flatListRef = useRef<FlatList>(null);

    const { conversationId, conversationAvatar, conversationName, conversationType } = route.params;

    const [messengers, setMessengers] = useState<MessengerType[]>([]);
    const [userCurrent, setUserCurrent] = useState<userCurrentType>();

    useEffect(() => {
        const fetchUserCurrent = async () => {
            try {
                const response: userCurrentType = await getCurrentUser();
                setUserCurrent(response);
            } catch (e) {
                console.log("Loi fetchUserCurrent: ", e);
            }
        }
        fetchUserCurrent();
    }, [])

    //Get All Messenger
    useEffect(() => {
        const fetchAllMessenger = async () => {
            try {
                const response: MessengerType[] = await getAllMessenger(conversationId);
                if (response) {
                    setMessengers(response);
                }
            } catch (e) {
                console.log("Loi fetchAllMessenger: ", e);
            }
        };
        fetchAllMessenger()
    }, [])

    //cuon xuong neu nhu gui tin nhan 
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messengers]);
    //Send Messenger
    const handleSendMessenger = async (messageTmp: string) => {
        if (userCurrent) {
            const newMessenger: MessengerType = {
                id: Math.random().toString(),
                content: messageTmp,
                type: "TEXT", // hoặc tùy logic hệ thống
                conversationId: conversationId,
                sender: {
                    id: userCurrent.id,
                    username: userCurrent.username,
                    avatar: userCurrent.avatar,
                },
                sentAt: new Date().toISOString(),
                mediaList: [],
            };
            setMessengers(prev => [...prev, newMessenger]);

        }
    }

    return (
        <View style={styles.container}>
            <HeaderMessengerBox
                conversationAvatar={conversationAvatar}
                conversationName={conversationName}
            />

            <View style={styles.messageWrapper}>
                <FlatList
                    ref={flatListRef}
                    data={messengers}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.messages}
                    renderItem={({ item }) => {
                        if (!userCurrent) return null;

                        if (item.type === "CONVERSATION_NOTICE") {
                            return (
                                <View style={styles.noticeContainer}>
                                    <Text style={styles.noticeText}>
                                        {item.content}
                                    </Text>
                                </View>
                            );
                        }

                        return item.sender.id === userCurrent.id ? (
                            <MyMessengerLine
                                id={item.id}
                                content={item.content}
                                type={item.type}
                                conversationId={item.conversationId}
                                sender={item.sender}
                                sentAt={item.sentAt}
                                mediaList={item.mediaList}
                            />
                        ) : (
                            <SentMessengerLine
                                id={item.id}
                                content={item.content}
                                type={item.type}
                                conversationId={item.conversationId}
                                sender={item.sender}
                                sentAt={item.sentAt}
                                mediaList={item.mediaList}
                            />
                        );
                    }}
                />
            </View>

            <BottomMessenger handleSendMessenger={handleSendMessenger} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        width: "100%",
    },
    messageWrapper: {
        flex: 1,
    },
    messages: {
        marginTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 60
    },
    noticeContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
    },

    noticeText: {
        width: "70%",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        textAlign: "center",
        fontSize: 12,
        color: "#444",
    }
})