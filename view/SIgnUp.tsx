import { useState } from "react";
import React from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { signUp } from "../service/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSignUp = async () => {
        try {
            const response = await signUp(username, password, name);
            await AsyncStorage.setItem("accessToken", response.accessToken);
            await AsyncStorage.setItem("refreshToken", response.refreshToken);
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo Facebook */}
            <Image
                source={require("../assets/picture/logo.jpg")}
                style={styles.logo}
            />

            <Text style={styles.title}>Tạo tài khoản mới</Text>

            <TextInput
                placeholder="Tên người dùng"
                style={styles.input}
                placeholderTextColor="#999"
                onChangeText={setName}
            />

            <TextInput
                placeholder="Tên đăng nhập"
                style={styles.input}
                placeholderTextColor="#999"
                onChangeText={setUsername}
            />

            <TextInput
                placeholder="Mật khẩu"
                secureTextEntry={true}
                style={styles.input}
                placeholderTextColor="#999"
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
    },
    input: {
        height: 50,
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    button: {
        marginTop: 10,
        backgroundColor: "#26b8f1",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
