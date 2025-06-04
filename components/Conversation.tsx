import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from "react-native";

type LastMessageType = {
    content?: string | null;
    senderName?: string | null;
};

type ConversationType = {
    id: string,
    name?: string | null,
    avatar: string,
    type: string,
    lastMessage?: LastMessageType | null,
    displayName?: string | null
};

type Props = {
    conversation: ConversationType;
};


export default function Conversation({ conversation }: Props) {


    function getImageMime(base64String: string): string {
        if (base64String.startsWith('/9j')) return 'image/jpeg';      // JPEG
        if (base64String.startsWith('iVBOR')) return 'image/png';     // PNG
        if (base64String.startsWith('R0lGOD')) return 'image/gif';    // GIF
        return 'image/jpeg'; // fallback nếu không khớp
    }

    const navigation = useNavigation<any>()


    const [conversationId, setConversationId] = useState<string>();
    const [conversationAvatar, setConversationAvatar] = useState<string>();
    const [conversationName, setConversationName] = useState<string>();
    const [conversationType, setConversationType] = useState<String>();
    const [conversationLastMessnger, setConversationLastMessenger] = useState<string>();


    useEffect(() => {
        if (conversation.id) {
            setConversationId(conversation.id);
        }
        if (conversation.avatar) {
            setConversationAvatar(conversation.avatar);
        }
        if (conversation.type === "GROUP") {
            if (conversation.name) {
                setConversationName(conversation.name);
            }
        } else {
            if (conversation.displayName) {
                setConversationName(conversation.displayName);
            }
        }
        if (conversation.lastMessage !== null) {
            setConversationLastMessenger(conversation.lastMessage?.senderName + ": " + conversation.lastMessage?.content)
        } else {
            setConversationLastMessenger("Chưa có tin nhắn")
        }
        if (conversation.type) {
            setConversationType(conversation.type);
        }
    }, [])

    const handlePadConversation = () => {
        console.log("----------------------conversationId: ", conversationId, "conversationName: ", conversationName)
        navigation.navigate("MessengerBox", {
            conversationId: conversationId,
            conversationAvatar: conversationAvatar,
            conversationName: conversationName,
            conversationType: conversationType
        });
    }

    return (
        <View>
            <TouchableOpacity onPress={handlePadConversation}>
                {conversation &&
                    <View style={styles.container}>
                        {
                            conversationAvatar &&
                            <Image
                                style={styles.avatar}
                                source={{ uri: `data:${getImageMime(conversationAvatar)};base64,${conversationAvatar}` }}
                            />
                        }
                        <View style={styles.content}>
                            <Text style={styles.groupName}>{conversationName}</Text>
                            <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
                                {conversationLastMessnger}
                            </Text>
                        </View>
                    </View>
                }
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    groupName: {
        fontWeight: "bold",
        fontSize: 16,
    },
    message: {
        color: "#555",
    },
});
