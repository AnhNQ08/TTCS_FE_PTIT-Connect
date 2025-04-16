import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import FriendRequest from '../components/FriendRequest';

export default function Friend() {
    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.screenName}>Bạn bè</Text>
            <TouchableOpacity style={styles.seeAllFriend}>
                <Text style={styles.seeAllFriendText}>Bạn bè</Text>
            </TouchableOpacity>
            <View style={styles.friendRequestSection}>
                <Text style={styles.inviteTitle}>Lời mời kết bạn</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
                <FriendRequest />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    screenName: {
        fontSize: 22,
        fontWeight: 600,
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 10
    },
    seeAllFriend: {
        width: 80,
        height: 30,
        backgroundColor: '#D3D3D3',
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        marginTop: 15,
        marginLeft: 15
    },
    seeAllFriendText: {
        fontWeight: 700,
        fontSize: 16
    },
    friendRequestSection: {
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
    },
    inviteTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    viewAllText: {
        color: '#26b8f1',
        fontWeight: 'bold',
        marginBottom: 15,
    },
});
