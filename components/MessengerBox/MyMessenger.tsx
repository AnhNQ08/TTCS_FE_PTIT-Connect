import React from "react";
import { View, Text, StyleSheet } from "react-native";

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

export default function MyMessengerLine(
    { id, content, type, conversationId, sender, sentAt, mediaList }: PropsType
) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>{content}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    text: {
        maxWidth: 300,
        backgroundColor: "#007AFF",
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
        color: "white",
        fontSize: 16,
        marginBottom: 2,
        borderRadius: 15,
    }
})
