import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Conversation() {
    return (
        <View style={styles.container}>
            <Image
                style={styles.avatar}
                source={require(`../assets/picture/avatar/avatardefault.jpg`)}
            />
            <View style={styles.content}>
                <Text style={styles.groupName}>Tinh hoa cuộc sống</Text>
                <Text
                    style={styles.message}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    Hứa Duy Anh: Thằng nào có tiền thì nạp vào donate cho tao
                </Text>
            </View>
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
