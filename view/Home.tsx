import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import Post from '../components/Post';
import HeaderBottom from '../components/HeaderBottom';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

    let dataCurrentUserJSON;

    const getDataCurrentUser = async () => {
        return dataCurrentUserJSON = await AsyncStorage.getItem("dataCurrentUser")
    }

    let dataCurrentUser;
    if (dataCurrentUserJSON !== null) {
        dataCurrentUser = JSON.parse(getDataCurrentUser());
    }

    const srcAvatar = dataCurrentUser.avatar

    return (
        <View>
            <View>
                <Header />
                <HeaderBottom srcAvartar={srcAvatar} />
            </View>
            <Post />
        </View>
    );
}
