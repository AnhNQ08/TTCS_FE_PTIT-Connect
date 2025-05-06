import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyMessengerLine() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>Khong</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    text: {
        maxWidth: 300,
        backgroundColor: "#007AFF",
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
        color: "white",
        fontSize: 16,
        marginBottom: 2,
        borderRadius: 15,
    }
})
