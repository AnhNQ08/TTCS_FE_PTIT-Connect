import React, {createContext, useRef} from 'react';
import SockJS from "sockjs-client";
import {Client} from '@stomp/stompjs';

export const SockJSContext = createContext();

export const SockJSProvider = ({children}) => {
    const stompClientRef = useRef(null);

    const setUpStompClient = (groupIds, userId, onMessageReceived, onPublicChannel, onGroupChannel) => {
        return new Promise((resolve) => {
            const socket = new SockJS("http://100.114.40.116:8081/ws");
            const stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                onConnect: () => {
                    if(userId && onMessageReceived) {
                        stompClient.subscribe(`/user/${userId}/queue/messages`, onMessageReceived);
                    }
                    if(groupIds && onGroupChannel) {
                        groupIds.forEach(groupId => {
                            stompClient.subscribe(`/topic/group/${groupId}`, onGroupChannel);
                        })
                    }
                    stompClient.subscribe('/topic/public', onPublicChannel);
                    stompClientRef.current = stompClient;
                    resolve(true);
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                onWebSocketClose: (event) => {
                    console.log("Websocket closed", event);
                }
            });
            stompClient.activate();
        })
    }

    const disconnectStomp = () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate().then(() => {
                console.log('STOMP Client deactivated');
            });
        }
    };

    return (
        <SockJSContext.Provider value={{setUpStompClient, disconnectStomp, stompClientRef}}>
            {children}
        </SockJSContext.Provider>
    );
};

export default SockJSContext;