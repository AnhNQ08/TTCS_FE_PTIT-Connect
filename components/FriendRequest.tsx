import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function FriendRequest() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/picture/avatar/avatardefault.jpg')}
                style={styles.avatar}
            />
            <View style={styles.textContainer}>
                <Text style={styles.name}>Phan Van Bien</Text>
                <Text style={styles.time}>1 tuần trước</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.buttonText}>Xác nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 14,
        color: '#777',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    acceptButton: {
        backgroundColor: '#26b8f1',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 25,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
