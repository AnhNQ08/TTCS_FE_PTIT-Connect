import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { TouchableWithoutFeedback } from 'react-native';
import { changeReaction, deleteReaction, sendReaction } from '../services/userAPI';

export default function Post(props: any) {

    const navigation = useNavigation<any>();

    const [reaction, setReaction] = useState<"LIKE" | "LOVE" | "HAHA" | "WOW" | "CRY" | "ANGRY" | null>(null);
    const [showReactionPopup, setShowReactionPopup] = useState(false);
    const [reactionId, setReactionId] = useState<number>();

    function getImageMime(base64String: string): string {
        if (base64String.startsWith('/9j')) return 'image/jpeg';      // JPEG
        if (base64String.startsWith('iVBOR')) return 'image/png';     // PNG
        if (base64String.startsWith('R0lGOD')) return 'image/gif';    // GIF
        return 'image/jpeg';
        // fallback nếu không khớp
    }

    useEffect(() => {
        console.log("-------Post------------------");
        if (props.post.currentUserReaction !== null) {
            setReaction(props.post.currentUserReaction.emotion);
            setReactionId(props.post.currentUserReaction.id);
        }
    }, [])


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

    const renderReaction = () => {
        switch (reaction) {
            case "LIKE":
                return (
                    <>
                        <AntDesign name="like1" size={30} color="#1877F2" />
                        <Text style={[style.textButton, { color: "#1877F2" }]}>Thích</Text>
                    </>
                );
            case "LOVE":
                return (
                    <>
                        <AntDesign name="heart" size={30} color="#E0245E" />
                        <Text style={[style.textButton, { color: "#E0245E" }]}>Yêu thích</Text>
                    </>
                );
            case "HAHA":
                return (
                    <>
                        <FontAwesome5 name="laugh-squint" size={30} color="#F7B125" />
                        <Text style={[style.textButton, { color: "#F7B125" }]}>Haha</Text>
                    </>
                );
            case "WOW":
                return (
                    <>
                        <FontAwesome5 name="surprise" size={30} color="#F7B125" />
                        <Text style={[style.textButton, { color: "#F7B125" }]}>Wow</Text>
                    </>
                );
            case "CRY":
                return (
                    <>
                        <FontAwesome5 name="sad-tear" size={30} color="#F7B125" />
                        <Text style={[style.textButton, { color: "#F7B125" }]}>Buồn</Text>
                    </>
                );
            case "ANGRY":
                return (
                    <>
                        <FontAwesome5 name="angry" size={30} color="#E9710F" />
                        <Text style={[style.textButton, { color: "#E9710F" }]}>Phẫn nộ</Text>
                    </>
                );
            default:
                return (
                    <>
                        <AntDesign name="like2" size={30} color="black" />
                        <Text style={style.textButton}>Thích</Text>
                    </>
                );
        }
    };

    const ReactionPopup = () => (
        <View style={style.reactionPopup}>
            {["LIKE", "LOVE", "HAHA", "WOW", "CRY", "ANGRY"].map((type) => (
                <TouchableOpacity
                    key={type}
                    style={style.reactionOption}
                    onPress={async () => {
                        if (reaction === null) {
                            try {
                                const response = await sendReaction("POST", type, props.post.id);
                                console.log("reaction send: ", type);
                                console.log("response sendReactionPost: ", response);
                                setReactionId(response);
                            } catch (e) {
                                console.log("Loi sendReactionPost: ", e);
                            }
                        } else {
                            try {
                                console.log("reaction change: ", type);
                                console.log("reactionID: ", reactionId);
                                const response = await changeReaction(reactionId, type);
                                console.log("response changeReactionPost: ", response);
                            } catch (e) {
                                console.log("Loi changeReactionPost: ", e);
                            }
                        }
                        setReaction(type as any);
                        setShowReactionPopup(false);
                    }}
                >
                    {getReactionIcon(type as any)}
                </TouchableOpacity>
            ))}
        </View>
    );

    const getReactionIcon = (type: string) => {
        switch (type) {
            case "LIKE":
                return <AntDesign name="like1" size={30} color="#1877F2" />;
            case "LOVE":
                return <AntDesign name="heart" size={30} color="#E0245E" />;
            case "HAHA":
                return <FontAwesome5 name="laugh-squint" size={30} color="#F7B125" />;
            case "WOW":
                return <FontAwesome5 name="surprise" size={30} color="#F7B125" />;
            case "CRY":
                return <FontAwesome5 name="sad-tear" size={30} color="#F7B125" />
            case "ANGRY":
                return <FontAwesome5 name="angry" size={30} color="#E9710F" />;
            default:
                return null;
        }
    };

    const renderPostWithoutBackground = () => {
        return (
            <>
                <Text style={style.content}>{props.post.content}</Text>
                {renderSharedPost()}
                {props.post.mediaList.map((item: any, index: any) => (
                    <Image
                        source={{ uri: item.url }}
                        key={index}
                        style={{ width: "100%", height: 400, marginTop: 10 }}
                    />
                ))}
            </>
        )
    }
    const renderPostBackground = () => {
        return (
            <ImageBackground
                source={{ uri: encodeURI(props.post.backgroundUrl) }}
                style={{
                    width: '100%',
                    minHeight: 200,
                    alignItems: "center",
                    justifyContent: "center"
                }}
                resizeMode="cover"
            >
                <View style={{ width: "80%", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "white", fontSize: 20 }}>{props.post.content}</Text>
                    {renderSharedPost()}
                </View>
            </ImageBackground>
        );
    };


    const renderSharedPost = () => {
        const sharedPost = props.post.parentPost;
        if (!sharedPost) return null;

        return (
            <View style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
                backgroundColor: '#f9f9f9'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                        source={{ uri: `data:${getImageMime(sharedPost.userSummary.avatar)};base64,${sharedPost.userSummary.avatar}` }}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>{sharedPost.userSummary.username}</Text>
                        <Text>{sharedPost.createdAt}</Text>
                    </View>
                </View>

                {
                    sharedPost.backgroundUrl === null &&
                    <View>
                        <Text style={{ marginTop: 10 }}>{sharedPost.content}</Text>


                        {sharedPost.mediaList?.length > 0 &&
                            sharedPost.mediaList.map((item: any, index: number) => (
                                <Image
                                    key={index}
                                    source={{ uri: item.url }}
                                    style={{ width: "100%", height: 200, marginTop: 10 }}
                                />
                            ))
                        }
                    </View>
                }
                {
                    sharedPost.backgroundUrl !== null &&
                    <ImageBackground
                        source={{ uri: encodeURI(sharedPost.backgroundUrl) }}
                        style={{
                            width: '100%',
                            minHeight: 200,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        resizeMode="cover"
                    >
                        <View style={{ width: "80%", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "white", fontSize: 20 }}>{sharedPost.content}</Text>
                        </View>
                    </ImageBackground>
                }
            </View>
        );
    };


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
                    <Text >{props.post.createdAt}</Text>
                </View>
            </View>
            {
                props.post.backgroundUrl === null && renderPostWithoutBackground()
            }
            {
                props.post.backgroundUrl !== null && renderPostBackground()
            }
            {/*Number Post*/}
            {/* <View style={style.numberPost}>
                <Text style={style.numberLike}>{props.post.reactionSummary.total}</Text>
                <Text style={style.numberComment}>1,9k bình luận</Text>
                <Text style={style.numberShare}>126 lượt chia sẻ</Text>
            </View> */}
            {/*Post Button*/}
            <View style={style.postButton}>
                <View>
                    {
                        showReactionPopup &&
                        <TouchableWithoutFeedback onPress={() => setShowReactionPopup(false)}>
                            <View style={StyleSheet.absoluteFill}>
                                <ReactionPopup />
                            </View>
                        </TouchableWithoutFeedback>
                    }

                    <TouchableOpacity
                        style={style.like}
                        disabled={
                            showReactionPopup === true
                        }
                        onPress={async () => {
                            if (reaction !== null) {
                                try {
                                    console.log("reactionID: ", reactionId);
                                    const response = await deleteReaction(reactionId);
                                    console.log("deletePostReaction: ", response);
                                } catch (e) {
                                    console.log("Loi deleteReactionPost ", e);
                                }
                                setReaction(null);
                            } else {
                                try {
                                    const response = await sendReaction("POST", "LIKE", props.post.id);
                                    setReactionId(response);
                                    console.log("response sendReactionPost: ", response);
                                    console.log("reaction: ", reaction);
                                } catch (e) {
                                    console.log("Loi sendReactionPost: ", e);
                                }
                                setReaction("LIKE");
                            }
                        }}
                        onLongPress={() => setShowReactionPopup(true)}
                    >
                        {renderReaction()}
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={props.padComment} style={style.comment}>
                        <FontAwesome5 name="comment" size={30} color="black" />
                        <Text style={style.textButton}>Bình luận</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={style.share} onPress={props.padShare}>
                    <AntDesign name="sharealt" size={30} color="black" />
                    <Text style={style.textButton} >Chia sẻ</Text>
                </TouchableOpacity>
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
        marginTop: 20,
        marginBottom: 10
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
        fontSize: 20,
        marginLeft: 3
    },
    reactionPopup: {
        width: 350,
        position: 'absolute',
        left: -10,
        bottom: 50,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 10,
        gap: 10,
    },

    reactionOption: {
        marginHorizontal: 5,
    }
})