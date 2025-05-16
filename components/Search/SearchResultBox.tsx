import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// Kiểu dữ liệu nhận từ prop
type SearchResultType = {
    id: number;
    username: string;
    avatar: string;
};

function getImageMime(base64String: string): string {
    if (base64String.startsWith('/9j')) return 'image/jpeg';      // JPEG
    if (base64String.startsWith('iVBOR')) return 'image/png';     // PNG
    if (base64String.startsWith('R0lGOD')) return 'image/gif';    // GIF
    return 'image/jpeg';
    // fallback nếu không khớp
}

// Nhận prop `user` đúng kiểu
export default function SearchResultBox({ user }: { user: SearchResultType }) {

    const navigation = useNavigation<any>();

    const [userID, setUserId] = useState<string>("");

    useEffect(() => {
        setUserId(user.id.toString());
    })

    const handlePadResult = async () => {
        console.log('ID otherUser: ', userID);
        navigation.navigate('OtherUserProfile', { userID })
    }




    return (
        <View>
            <TouchableOpacity style={styles.container} onPress={handlePadResult}>
                <Image source={{ uri: `data:${getImageMime(user.avatar)};base64,${user.avatar}` }} style={styles.avatar} />
                <Text style={styles.username}>{user.username}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontSize: 16,
    },
});