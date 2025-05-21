import React, {createContext, useRef} from 'react';
import SockJS from "sockjs-client";
import {Client} from '@stomp/stompjs';

export const SockJSContext = createContext();

export const SockJSProvider = ({children}) => {
    const stompClientRef = useRef(null);

    const setUpStompClient = (groupIds, userId, onMessageReceived, onPublicChannel) => {
        return new Promise((resolve, reject) => {
            const socket = new SockJS("http://100.114.40.116:8081/ws");
            const stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                connectHeaders: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                onConnect: () => {
                    console.log('STOMP Connected');
                    try {
                        const subscriptions = [];
                        if (userId && onMessageReceived) {
                            subscriptions.push(
                                stompClient.subscribe(
                                    `/user/${userId}/queue/messages`,
                                    onMessageReceived
                                )
                            );
                        }
                        if (groupIds && onMessageReceived) {
                            groupIds.forEach(groupId => {
                                subscriptions.push(
                                    stompClient.subscribe(
                                        `/topic/group/${groupId}`,
                                        onMessageReceived
                                    )
                                );
                            });
                        }
                        if (onPublicChannel) {
                            subscriptions.push(
                                stompClient.subscribe(
                                    '/topic/public',
                                    onPublicChannel
                                )
                            );
                        }
                        stompClientRef.current = stompClient;
                        console.log(`Established ${subscriptions.length} subscriptions`);
                        resolve(true);
                    } catch (err) {
                        reject(err);
                    }
                },
                onStompError: (frame) => {
                    const error = new Error(`STOMP error: ${frame.headers.message}\n${frame.body}`);
                    console.error(error);
                    reject(error);
                },
                onWebSocketError: (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                },
                onDisconnect: () => {
                    console.log('STOMP Disconnected');
                }
            });
            stompClient.activate();
        });
    };

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