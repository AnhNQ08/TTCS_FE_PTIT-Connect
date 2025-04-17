import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

export default function AvatarAndBackground(props: any) {

    function getImageMime(base64String: string): string {
        if (base64String.startsWith('/9j')) return 'image/jpeg';      // JPEG
        if (base64String.startsWith('iVBOR')) return 'image/png';     // PNG
        if (base64String.startsWith('R0lGOD')) return 'image/gif';    // GIF
        return 'image/jpeg'; // fallback nếu không khớp
    }

    return (
        <View>
            <Image
                source={require(`../assets/picture/background/backgroundDefault.jpg`)}
                style={styles.background}
            />
            <Image
                source={{ uri: `data:${getImageMime(props.userAvatar)};base64,${props.userAvatar}` }}
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
