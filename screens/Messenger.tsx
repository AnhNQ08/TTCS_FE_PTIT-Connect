import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import Header from '../components/Header';
import Conversation from '../components/Conversation';
import { getAllConversation } from '../services/conversation';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentUser } from '../services/userAPI';

type LastMessageType = {
    content?: string | null;
    senderName?: string | null;
};

type ConversationType = {
    id: string,
    name?: string | null,
    avatar: string,
    type: string,
    lastMessage?: LastMessageType | null,
    displayName?: string | null
};

type userCurrentType = {
    id: number,
    username: string,
    avatar: string
}


export default function Messenger() {

    const [conversations, setConversations] = useState<ConversationType[] | null>(null);
    const [haveData, setHaveData] = useState<true | false>(false);
    const [userCurrent, setUserCurrent] = useState<userCurrentType>();

    useEffect(() => {
        const fetchUserCurrent = async () => {
            try {
                const response: userCurrentType = await getCurrentUser();
                setUserCurrent(response);
            } catch (e) {
                console.log("Loi fetchUserCurrent: ", e);
            }
        }
        fetchUserCurrent();
    }, [])

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await getAllConversation();
                if (response !== undefined) {
                    console.log("conversations: ", response);
                    setConversations(response);
                }
                setHaveData(true);
            } catch (e) {
                console.log('Lỗi fetchConversations:', e);
            }
        };
        fetchConversations();
    }, []);


    return (
        <View>
            <Header />
            <Text style={styles.screenName}>Tin nhắn</Text>
            {
                haveData ?
                    <>
                        <FlatList
                            data={conversations}
                            renderItem={({ item }) => <Conversation conversation={item} />}
                        />
                    </>
                    :
                    <>
                        <Text>Đang tải</Text>
                    </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    screenName: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 10,
    },
});


