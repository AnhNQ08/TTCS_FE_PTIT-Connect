import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import Post from '../components/Post';

export default function Home() {
    const listPost = [
        {

            id: '1',
            namePoster: "Phan Van Bien",
            time: "16 phút",
            sourcePicture: "../assets/picture/avatar/avatardefault.jpg",
            content: "Chao mung ban den voi Facebook",
            numberLike: "11.900",
            numberComment: "1,9k",
            numberShare: "126"
        },
        {
            id: '2',
            namePoster: "Phan Van Bien",
            time: "16 phút",
            sourcePicture: "../assets/picture/avatar/avatardefault.jpg",
            content: "Chao mung ban den voi Facebook",
            numberLike: "11.900",
            numberComment: "1,9k",
            numberShare: "126"
        },
    ];
    return (
        <View>
            <View style={styles.header}>
                <Header />
            </View>
            <Post />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: "100%",
        marginTop: 50,
    }
});
