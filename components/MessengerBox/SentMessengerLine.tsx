import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function SentMessengerLine() {
    return (
        <View style={styles.container}>
            <View>
                <Image
                    source={require(`../../assets/picture/avatar/avatardefault.jpg`)}
                    style={styles.avatar}
                />
            </View>
            <View style={styles.containerContent}>
                <Text style={styles.content}>E Bien</Text>
                <Text style={styles.content}>M co tien khong cho t vay mot it adfadfadfadf adfadfadfads</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        height: "auto",
        alignItems: "flex-end",
    },
    avatar: {
        height: 35,
        width: 35,
        borderRadius: 50,
        marginLeft: 10,
    },
    containerContent: {
        marginLeft: 10
    },
    content: {
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