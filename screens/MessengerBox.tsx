import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HeaderMessengerBox from "../components/MessengerBox/HeaderMessengerBox";
import SentMessengerLine from "../components/MessengerBox/SentMessengerLine";
import MyMessengerLine from "../components/MessengerBox/MyMessenger";
import BottomMessenger from "../components/MessengerBox/BottomMessenger";

export default function MessengerBox() {
    return (
        <View style={styles.container}>
            <HeaderMessengerBox />
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