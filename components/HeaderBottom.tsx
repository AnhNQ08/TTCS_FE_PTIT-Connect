import React from "react";
import { View, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function headerBottom() {

    const navigation = useNavigation<any>();

    const padMyProfile = () => {
        navigation.navigate("MyProfile");
    }

    return (
        <View style={styles.headerBottom}>
            <TouchableOpacity onPress={padMyProfile}>
                <Image
                    source={require('../assets/picture/avatar/avatardefault.jpg')}
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