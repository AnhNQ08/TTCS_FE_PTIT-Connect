import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function NotificationBox(props: any) {

    const navigation = useNavigation<any>()

    const [id, setId] = useState();
    const [type, setType] = useState();
    const [read, setRead] = useState();
    const [authorId, setAuthorId] = useState<string>();

    useEffect(() => {
        setId(props.id);
        setType(props.type);
        setRead(props.read);
        setAuthorId(props.author.id);
    }, [])

    const handlePadNotificationBox = async () => {
        if (type === "FRIEND_REQUEST") {
            navigation.navigate("OtherUserProfile", { userID: authorId });
        }
        
    }


    function getImageMime(base64String: string): string {
        if (base64String.startsWith('/9j')) return 'image/jpeg';      // JPEG
        if (base64String.startsWith('iVBOR')) return 'image/png';     // PNG
        if (base64String.startsWith('R0lGOD')) return 'image/gif';    // GIF
        return 'image/jpeg'; // fallback nếu không khớp
    }

    return (
        <TouchableOpacity
            style={[
                styles.container,
                read === false && styles.unreadContainer
            ]}
            onPress={handlePadNotificationBox}
        >
            <Image
                style={styles.avatar}
                source={{ uri: `data:${getImageMime(props.author.avatar)};base64,${props.author.avatar}` }}
            />
            <Text style={styles.content}>
                <Text style={styles.userName}>{props.author.username} </Text>
                <Text style={styles.notification}>{props.content}</Text>
            </Text>
        </TouchableOpacity>
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
    unreadContainer: {
        backgroundColor: '#e0e0e0',
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