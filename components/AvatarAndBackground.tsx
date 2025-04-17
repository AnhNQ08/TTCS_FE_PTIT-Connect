import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import getImageMime from "../service/getImageFromUnit8";

type AvatarAndBackgroundProps = {
    userAvatar: Uint8Array;
    userBackground: Uint8Array;
    onAvatarPress: () => void;
    onBackgroundPress: () => void;
};
const AvatarAndBackground = (
    {userAvatar,
    userBackground,
    onAvatarPress,
    onBackgroundPress} : AvatarAndBackgroundProps) => {
    return (
        <View>
            <TouchableOpacity>
                <Image
                    source={{ uri: `data:${getImageMime(userBackground)};base64,${userBackground}` }}
                    style={styles.background}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image
                    source={{ uri: `data:${getImageMime(userAvatar)};base64,${userAvatar}` }}
                    style={styles.avatar}
                />
            </TouchableOpacity>
        </View>
    )
}

export default AvatarAndBackground;

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
