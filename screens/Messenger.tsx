import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import Header from '../components/Header';
import Conversation from '../components/Conversation';
import { getAllConversation } from '../services/conversation';
import { useFocusEffect } from '@react-navigation/native';

type LastMessageType = {
    content?: string | null;
    senderName?: string | null;
};

type ParticipantsType = {
    id: string | null,
    participantId: string | null,
    nickname: string | null,
    username: string | null,
    avatar: string | null,
    role: string | null,
}

type ConversationType = {
    id: string | null,
    name: string | null,
    avatar: string | null,
    type: string | null,
    participants: ParticipantsType[] | null,
    lastMessage?: LastMessageType | null;
    displayName: string | null
};


export default function Messenger() {

    const [conversations, setConversations] = useState<ConversationType[] | null>(null);
    const [haveData, setHaveData] = useState<true | false>(false);


    const fetchConversations = async () => {
        try {
            const response = await getAllConversation();
            console.log("conversations: ", response);
            setConversations(response);
            setHaveData(true);
        } catch (e) {
            console.log('Lỗi fetchConversations:', e);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // useFocusEffect(
    //     useCallback(() => {
    //         // setConversations([]);
    //         // setHaveData(false);
    //         fetchConversations();
    //     }, [])
    // );

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

