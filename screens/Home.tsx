import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import Post from '../components/Post';
import HeaderBottom from '../components/HeaderBottom';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

    type User = {
        id: number;
        name: string;
        avatar: Uint8Array;
    }

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const tmp = await AsyncStorage.getItem('dataCurrentUser');
                console.log(tmp);
                if (tmp != null) setCurrentUser(JSON.parse(tmp));
            } catch (e) {
                console.error(e);
            }
        }
        fetchCurrentUser();
    }, [])

    return (
        <View>
            <View>
                <Header />
                {currentUser && <HeaderBottom currentUser={currentUser} />}
            </View>
            <Post />
        </View>
    );
}
