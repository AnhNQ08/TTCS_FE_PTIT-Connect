import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import Post from '../components/Post';
import HeaderBottom from '../components/HeaderBottom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNewestPost } from '../services/userAPI';

export default function Home() {

    type User = {
        id: number;
        name: string;
        avatar: Uint8Array;
    }

    type MediaType = "IMAGE" | "VIDEO";

    type PostMedia = {
        url: string;
        mediaType: MediaType;
    };

    type Reaction = {
        reactor: string;
        emotion: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";
    };

    type userSummary = {
        id: number;
        username: string;
        avatar: string;
    };

    type NewestPost = {
        id: number;
        content: string;
        backgroundUrl: string;
        postMediaList: PostMedia[];
        createdAt: string;
        updatedAt: string;
        userSumary: userSummary;
        emotions: string[];
        reactionsDto: Reaction[];
    };


    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [newestPost, setNewestPost] = useState<NewestPost[] | null>(null);

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


        const fetchNewestPost = async () => {
            try {
                const newestPostTmp = await getNewestPost();
                setNewestPost(newestPostTmp);
            }
            catch (e) {
                console.log("Loi lay bai viet moi nhat: ", e)
            }
        }

        fetchCurrentUser();
        fetchNewestPost();
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Header />
                {currentUser && <HeaderBottom currentUser={currentUser} />}
            </View>
            <FlatList
                data={newestPost}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Post post={item} />}
            />
        </View>
    );
}
