import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import getImageMime from "../service/getImageFromUnit8";

type AvatarAndBackgroundProps = {
    userAvatar: string;
    userBackground: string;
    onAvatarPress: () => void;
    onBackgroundPress: () => void;
};
const AvatarAndBackground: React.FC<AvatarAndBackgroundProps> = ({
    userAvatar,
    userBackground,
    onAvatarPress,
    onBackgroundPress,
}) => {

    return (
        <View>
            <TouchableOpacity>
                <Image
                    source={{ uri: `data:${getImageMime(backgroundImage)};base64,${backgroundImage}` }}
                    style={styles.background}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image
                    source={{ uri: `data:${getImageMime(avatar)};base64,${avatar}` }}
                    style={styles.avatar}
                />
            </TouchableOpacity>
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
