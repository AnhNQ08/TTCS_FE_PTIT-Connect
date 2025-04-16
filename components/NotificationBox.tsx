import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function NotificationBox() {
    return (
        <View style={styles.container}>
            <Image
                style={styles.avatar}
                source={require(`../assets/picture/avatar/avatardefault.jpg`)}
            />
            <Text style={styles.content}>
                <Text style={styles.userName}>Hua Duy Anh </Text>
                <Text style={styles.notification}>da nhac den ban trong mot binh luan</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginLeft: 10,
        marginRight: 10,
        flexShrink: 1
    },
    userName: {
        fontSize: 16,
        fontWeight: 500
    },
    notification: {
        fontSize: 16
    }
})