import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header'
import NotificationBox from '../components/NotificationBox';

export default function Notification() {
    return (
        <View>
            <Header />
            <Text style={styles.screenName}>Thong bao</Text>
            <NotificationBox />
        </View>
    )
}

const styles = StyleSheet.create({
    screenName: {
        fontSize: 22,
        fontWeight: 600,
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 10
    }
})