import React from 'react';
import { Image, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

export default function Post(props: any) {

    const navigation = useNavigation<any>();

    function getImageMime(base64String: string): string {
        if (base64String.startsWith('/9j')) return 'image/jpeg';      // JPEG
        if (base64String.startsWith('iVBOR')) return 'image/png';     // PNG
        if (base64String.startsWith('R0lGOD')) return 'image/gif';    // GIF
        return 'image/jpeg'; // fallback nếu không khớp
    }


    const handlePadAvatarPoster = async () => {
        const userID = props.post.userSummary.id;
        const dataCurrentUserJSON = await AsyncStorage.getItem('dataCurrentUser');
        let dataCurrentUserId
        if (dataCurrentUserJSON !== null) {
            const dataCurrentUser = JSON.parse(dataCurrentUserJSON);
            dataCurrentUserId = dataCurrentUser.id
        }
        if (dataCurrentUserId === userID) {
            navigation.navigate("MyProfile");
        } else {
            navigation.navigate("OtherUserProfile", { userID });
        }
    }

    return (
        <View style={style.container}>
            {/*Post Header*/}
            <View style={style.postHeader}>
                {/*Avartar Poster */}
                <TouchableOpacity onPress={handlePadAvatarPoster}>
                    <Image
                        style={style.imgAvatarPoster}
                        source={{ uri: `data:${getImageMime(props.post.userSummary.avatar)};base64,${props.post.userSummary.avatar}` }}
                    />
                </TouchableOpacity>
                {/*Name poster and time*/}
                <View style={style.namePosterAndTime}>
                    <Text style={style.namePoster}>{props.post.userSummary.username}</Text>
                    <Text>16 phút</Text>
                </View>
            </View>
            {/*Content*/}
            <Text style={style.content}>{props.post.content}</Text>
            {/*ImgPost*/}
            {props.post.postMediaList.length > 0 &&
                props.post.postMediaList.map((item: any, index: any) => (
                    <Image
                        source={{
                            uri: `${item.url}`,
                        }}
                        key={index}
                        style={{ width: "100%", height: 400, marginTop: 10 }}
                    />
                ))
            }
            {/*Number Post*/}
            <View style={style.numberPost}>
                <Text style={style.numberLike}>11.900</Text>
                <Text style={style.numberComment}>1,9k bình luận</Text>
                <Text style={style.numberShare}>126 lượt chia sẻ</Text>
            </View>
            {/*Post Button*/}
            <View style={style.postButton}>
                <View style={style.like}>
                    <AntDesign name="like2" size={24} color="black" />
                    <Text style={style.textButton}>Thích</Text>
                </View>
                <View style={style.comment}>
                    <FontAwesome5 name="comment" size={24} color="black" />
                    <Text style={style.textButton}>Bình luận</Text>
                </View>
                <View style={style.share}>
                    <FontAwesome name="share" size={24} color="black" />
                    <Text style={style.textButton}>Chia sẻ</Text>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: "100%",
        height: "auto",
        borderBottomWidth: 3
    },
    postHeader: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10
    },
    imgAvatarPoster: {
        height: 60,
        width: 60,
        borderRadius: 50,
        marginLeft: 10
    },
    namePosterAndTime: {
        marginLeft: 10,
    },
    namePoster: {
        fontSize: 18,
        fontWeight: 500
    },
    content: {
        marginLeft: 15,
        marginTop: 5,
        fontSize: 18,
    },
    imgPost: {
        width: '100%',
        marginTop: 10,
    },
    numberPost: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5
    },
    numberLike: {
        fontSize: 15,
        marginLeft: 15
    },
    numberComment: {
        fontSize: 15,
        marginLeft: 'auto'
    },
    numberShare: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 15
    },
    postButton: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-around',
        marginTop: 10
    },
    like: {
        display: 'flex',
        flexDirection: "row",
        alignContent: 'center',
        justifyContent: 'center'
    },
    comment: {
        display: 'flex',
        flexDirection: "row",
        alignContent: 'center',
        justifyContent: 'center'
    },
    share: {
        display: 'flex',
        flexDirection: "row",
        alignContent: 'center',
        justifyContent: 'center'
    },
    textButton: {
        fontSize: 17
    }
})