import React from 'react';
import { Image, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons'; // Import icon libraries
import HeaderIcon from '../components/HederIcon'; // Import HeaderIcon
import { useNavigation } from '@react-navigation/native';

export default function Header() {

    const navigation = useNavigation<any>();

    const listIconHeader = [
        {
            id: 0,
            iconName: `homePage`,
            iconTag: <Entypo name="home" size={24} color="black" />,
            countNotification: 4,
            screenName: `Home`
        },
        {
            id: 1,
            iconName: `friend`,
            iconTag: <FontAwesome5 name="user-friends" size={24} color="black" />,
            countNotification: 0,
            screenName: `Friend`
        },
        {
            id: 2,
            iconName: `messenger`,
            iconTag: <Entypo name="message" size={24} color="black" />,
            countNotification: 4,
            screenName: `Messenger`
        },
        {
            id: 3,
            iconName: `notification`,
            iconTag: <Ionicons name="notifications" size={24} color="black" />,
            countNotification: 3,
            screenName: `Notification`
        }
    ];

    const handlePad = (screenName: String) => {
        navigation.navigate(screenName)
    }
    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.facebook}>facebook</Text>
            </View>
            <View style={styles.headerIcon} >
                {
                    listIconHeader.map((item) => {
                        return (
                            <TouchableOpacity key={item.id} onPress={() => handlePad(item.screenName)}>
                                <HeaderIcon
                                    iconTag={item.iconTag}
                                    countNotification={item.countNotification}
                                    style={{
                                        with: '25%'
                                    }}
                                />
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 50
    },
    facebook: {
        marginLeft: 15,
        marginRight: 15,
        top: -15,
        color: "#26b8f1",
        fontSize: 30
    },
    headerIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingBottom: 15,
        width: "100%",
        justifyContent: 'space-around'
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
});
