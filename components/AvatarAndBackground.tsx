import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

export default function AvatarAndBackground() {
    return (
        <View>
            <Image
                source={require(`../assets/picture/background/backgroundDefault.jpg`)}
                style={styles.background}
            />
            <Image
                source={require(`../assets/picture/avatar/avatardefault.jpg`)}
                style={styles.avatar}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: 200
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        position: "absolute",
        bottom: -50,
        left: 15,
        borderWidth: 3,
        borderColor: "#fff"
    }
});
