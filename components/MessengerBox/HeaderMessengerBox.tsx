import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function HeaderMessengerBox() {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <IconAntDesign name="arrowleft" size={26} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inforMesBox}>
                <View>
                    <Image
                        style={styles.avatar}
                        source={require(`../../assets/picture/avatar/avatardefault.jpg`)}
                    />
                </View>
                <View style={styles.inforMesBoxText}>
                    <Text
                        style={styles.nameMesBox}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Hua Duy Anh
                    </Text>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        Hoat dong 50 phut truoc
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.iconMesBox}>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={26} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome name="video-camera" size={26} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="information-circle" size={26} color="#007AFF" />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        paddingLeft: 10,
        paddingBottom: 10,
        borderBottomColor: "black",
        borderBottomWidth: 1
    },
    inforMesBox: {
        display: "flex",
        flexDirection: "row"
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginLeft: 10
    },
    inforMesBoxText: {
        marginLeft: 10,
        width: 150
    },
    nameMesBox: {
        fontSize: 17,
        fontWeight: 600,
    },
    iconMesBox: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        gap: 25,
        right: 20
    }
})