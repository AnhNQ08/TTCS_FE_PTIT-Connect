import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header'
import NotificationBox from '../components/NotificationBox';
import { getAllNotification } from '../services/userAPI';

export default function Notification() {

    const [notificationList, setNotificationList] = useState([]);
    const [haveData, setHaveData] = useState<true | false>(true);


    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await getAllNotification();
                setNotificationList(response);
                setHaveData(true)
            } catch (e) {
                console.log("Loi getAllNotification: ", e);
            }
        }
        fetchNotification();
    }, [])

    return (
        <View>
            <Header />
            <Text style={styles.screenName}>Thông báo</Text>

            {notificationList.length > 0 ? (
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
            ) : (
                <Text style={styles.emptyText}>Không có thông báo nào</Text>
            )}
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
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'gray'
    }
})