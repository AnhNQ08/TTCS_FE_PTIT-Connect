import React from 'react';
import { Image, View, StyleSheet, Text, TextInput } from 'react-native';
import { FontAwesome5, AntDesign, Ionicons, Entypo } from '@expo/vector-icons'; // Import icon libraries
import HeaderIcon from '../components/HederIcon'; // Import HeaderIcon

export default function Header() {
    const listIconHeader = [
        {
            id: 0,
            iconName: `homePage`,
            iconTag: <Entypo name="home" size={24} color="black" />,
            countNotification: 4
        },
        {
            id: 1,
            iconName: `friend`,
            iconTag: <FontAwesome5 name="user-friends" size={24} color="black" />,
            countNotification: 0
        },
        {
            id: 2,
            iconName: `messenger`,
            iconTag: <Entypo name="message" size={24} color="black" />,
            countNotification: 4
        },
        {
            id: 3,
            iconName: `notification`,
            iconTag: <Ionicons name="notifications" size={24} color="black" />,
            countNotification: 3
        }
    ];

    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.facebook}>facebook</Text>
            </View>
            <View style={styles.headerIcon} >
                {
                    listIconHeader.map((item) => {
                        return (
                            <HeaderIcon
                                key={item.id}
                                iconTag={item.iconTag}
                                countNotification={item.countNotification}
                                style={{
                                    with: '25%'
                                }}
                            />
                        );
                    })
                }
            </View>
            <View style={styles.headerBottom}>
                <Image
                    source={require('../assets/picture/avatar/avatardefault.jpg')}
                    style={styles.imgAvatar}
                />
                <TextInput style={styles.input}
                    placeholder='Bạn đang nghĩ gì?'
                />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    header: {
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
    headerBottom: {
        width: "100%",
        height: 80,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center'
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
