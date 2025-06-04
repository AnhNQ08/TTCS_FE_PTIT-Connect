import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Feather } from "@expo/vector-icons";

type PropsType = {
    handleSendMessenger: (message: string) => void
}

export default function BottomMessenger({ handleSendMessenger }: PropsType) {

    const [textInput, setTextInput] = useState<string>("");

    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <MaterialIcons name="add-circle" size={26} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialIcons name="photo-camera" size={26} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity>
                <Entypo name="image-inverted" size={26} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialIcons name="keyboard-voice" size={26} color="#007AFF" />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
                <TextInput
                    placeholder="Nhắn tin"
                    value={textInput}
                    underlineColorAndroid="transparent"
                    mode="flat"
                    style={styles.textInput}
                    theme={{ colors: { primary: 'transparent' } }}
                    onChangeText={setTextInput}
                />
            </View>
            {
                textInput.trim().length !== 0 ?
                    <TouchableOpacity
                        onPress={() => {
                            handleSendMessenger(textInput);
                            setTextInput(""); // Xoá sau khi gửi
                        }}
                    >
                        <Feather name="send" size={24} color="#007AFF" />
                    </TouchableOpacity>

                    :
                    <TouchableOpacity>
                        <AntDesign name="like1" size={24} color="#007AFF" />
                    </TouchableOpacity>
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        gap: 10
    },
    inputWrapper: {
        flex: 1,
        height: "90%",
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: 'transparent',
        fontSize: 16,
    },
});
