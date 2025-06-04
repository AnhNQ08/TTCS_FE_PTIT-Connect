import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type SenderType = {
    id: number,
    username: string,
    avatar: string
}


type PropsType = {
    id: string,
    content: string,
    type: string,
    conversationId: string,
    sender: SenderType,
    sentAt: string | null,
    mediaList: []
}

export default function SentMessengerLine(
    { id, content, type, conversationId, sender, sentAt, mediaList }: PropsType
) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={{ marginLeft: 60, marginBottom: 3 }}>
                    {sender.username}
                </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={require(`../../assets/picture/avatar/avatardefault.jpg`)}
                    style={styles.avatar}
                />
                <Text style={styles.content}>{content}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10
    },
    avatar: {
        height: 35,
        width: 35,
        borderRadius: 50,
        marginLeft: 10,
    },
    content: {
        marginLeft: 10,
        alignSelf: "flex-start",
        maxWidth: 300,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#c0c0c0",
        color: "white",
        fontSize: 16,
        marginBottom: 3,
        borderRadius: 15
    }
})