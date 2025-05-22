import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header'
import NotificationBox from '../components/NotificationBox';
import { getAllNotification } from '../services/userAPI';

export default function Notification() {

    const [notificationList, setNotificationList] = useState([]);


    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await getAllNotification();
                setNotificationList(response);
            } catch (e) {
                console.log("Loi getAllNotification: ", e);
            }
        }
        fetchNotification();
    }, [])

    return (
        <View>
            <Header></Header>
            <Text style={styles.screenName}>Thông báo</Text>
            <FlatList
                data={notificationList}
                keyExtractor={(item: any, index) => index.toString()}
                renderItem={({ item }) => (
                    <NotificationBox
                        id={item.id}
                        type={item.type}
                        content={item.content}
                        read={item.read}
                        author={item.author}
                        noticeAt={item.noticeAt}
                    />
                )}
            />
        </View>
    );
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