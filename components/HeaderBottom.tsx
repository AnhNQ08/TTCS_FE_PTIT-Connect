import React from "react";
import {View, Image, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteStackParamList} from "../routeParams";

type NavigationProp = NativeStackNavigationProp<RouteStackParamList, 'MyProfile'>;

export default function headerBottom(props: any) {
    const navigation = useNavigation<NavigationProp>();

    function getImageMime(base64String: string): string {
        if (base64String.startsWith('/9j')) return 'image/jpeg';      // JPEG
        if (base64String.startsWith('iVBOR')) return 'image/png';     // PNG
        if (base64String.startsWith('R0lGOD')) return 'image/gif';    // GIF
        return 'image/jpeg'; // fallback nếu không khớp
    }

    const padMyProfile = () => {
        navigation.navigate("MyProfile", {userId: props.currentUser.id});
    }

    return (
        <View style={styles.headerBottom}>
            <TouchableOpacity onPress={padMyProfile}>
                <Image
                    source={{uri: `data:${getImageMime(props.currentUser.avatar)};base64,${props.currentUser.avatar}`}}
                    style={styles.imgAvatar}
                />
            </TouchableOpacity>
            <TextInput style={styles.input}
                       placeholder='Bạn đang nghĩ gì?'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerBottom: {
        width: "100%",
        height: 80,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center'
    },
    imgAvatar: {
        width: 50,
        height: 50,
        marginLeft: 10,
        marginTop: 20,
        borderRadius: 50
    },
    input: {
        borderWidth: 1,
        width: 310,
        height: 50,
        paddingTop: 10,
        paddingLeft: 20,
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 20,
        borderRadius: 100
    }
})