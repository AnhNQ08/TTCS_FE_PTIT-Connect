import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { login, signUp } from '../service/authentication';
import { useNavigation } from '@react-navigation/native';

export default function Login() {

    const navigation = useNavigation<any>()

    const padLogin = () => {
        navigation.navigate("Home")
    }

    const padSignUp = () => {
        navigation.navigate("SignUp")
    }

    return (
        <View style={style.container}>
            {/* Logo */}
            <View style={style.logo}>
                <Image
                    style={style.imageLogo}
                    source={require('../assets/picture/logo.jpg')}
                />
            </View>
            {/* Input Account */}
            <TextInput
                style={style.input}
                placeholder="Số di động hoặc email"
            />
            {/* Input Password */}
            <TextInput
                style={style.input}
                placeholder="Mật khẩu"
            />
            {/* Button */}
            <TouchableOpacity
                style={style.button}
                onPress={padLogin}
            >
                <Text style={style.textButton}>Đăng nhập</Text>
            </TouchableOpacity>
            {/* forgot password */}
            <TouchableOpacity>
                <Text style={style.forgotPassword}>Bạn quên mật khẩu?</Text>
            </TouchableOpacity>
            {/* Register */}
            <TouchableOpacity style={style.register} onPress={padSignUp}>
                <Text style={style.textRegister}>Tạo tài khoản mới</Text>
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        marginTop: 250,
        marginBottom: 60,
        width: '100%',
        height: 100,
    },
    imageLogo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        marginBottom: 20,
    },
    button: {
        width: '90%',
        height: 50,
        marginTop: 25,
        marginBottom: 25,
        backgroundColor: "#26b8f1",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    textButton: {
        fontSize: 18,
        color: "white",
        fontWeight: 500
    },
    forgotPassword: {
        fontSize: 16,
        fontWeight: 500
    },
    register: {
        marginTop: 125,
        height: 50,
        width: "90%",
        borderWidth: 2,
        borderColor: "#26b8f1",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    textRegister: {
        fontSize: 16,
        fontWeight: 500,
        color: "#26b8f1",
    }
});
