import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header'
import Conversation from '../components/Conversation';

export default function Messenger() {
    return (
        <View>
            <Header />
            <Text style={styles.screenName}>Tin nhan</Text>
            <Conversation />
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
