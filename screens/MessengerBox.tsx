import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HeaderMessengerBox from "../components/MessengerBox/HeaderMessengerBox";
import SentMessengerLine from "../components/MessengerBox/SentMessengerLine";
import MyMessengerLine from "../components/MessengerBox/MyMessenger";
import BottomMessenger from "../components/MessengerBox/BottomMessenger";
import { RouteProp, useRoute } from "@react-navigation/native";

type ParamList = {
    MessengerBox: {
        conversationId: string
    }
}

export default function MessengerBox() {

    const route = useRoute<RouteProp<{
        MessengerBox: {
            conversationId: string;
            conversationAvatar: string;
            conversationName: string;
        }
    }, 'MessengerBox'>>();

    const { conversationId, conversationAvatar, conversationName } = route.params;

    const [conversationID, setConversationID] = useState<string>();
    const [conversationMessengers, setConversationLastMessengers] = useState<[]>([]);

    useEffect(() => {
        const { conversationId } = route.params;
        setConversationID(conversationId);
        console.log("------------------conversationId: ", conversationID);

    }, [])

    return (
        <View style={styles.container}>
            <HeaderMessengerBox
                conversationAvatar={conversationAvatar}
                conversationName={conversationName}
            />
            <ScrollView contentContainerStyle={styles.messages}>
                <SentMessengerLine />
                <MyMessengerLine />
            </ScrollView>
            <BottomMessenger />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    messages: {
        marginTop: 5,
        height: 715,
        paddingHorizontal: 10,
        paddingBottom: 60,
    },
})