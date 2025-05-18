import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-paper';

import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from '@expo/vector-icons/Ionicons';

import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Comment(props: any) {

    const [userId, setUserId] = useState();
    const [myId, setMyId] = useState<string>()
    const [selectedImages, setSelectedImages] = useState<ImagePickerAsset[]>([]);
    const [contentInput, setContentInput] = useState<string>(`@${props.userSummary.username}`);
    const [isReplyComment, setReplyComment] = useState<true | false>(false);
    const [reactionDTO, setReactionDTO] = useState<string | null>();
    const [isShowReactionList, setShowReactionList] = useState<true | false>(false)

    useEffect(() => {
        setUserId(props.userSummary.id.toString());
        const fetchMyId = async () => {
            try {
                const myIdTmp = await AsyncStorage.getItem('myID');
                if (myIdTmp) {
                    setMyId(myIdTmp);
                }
            } catch (e) {
                console.error('Lỗi khi lấy myID từ AsyncStorage:', e);
            }
        };
        setReactionDTO(props.reactionDTO);
        fetchMyId();
    }, [])

    function getImageMime(base64String: string): string {
        if (base64String.startsWith('/9j')) return 'image/jpeg';      // JPEG
        if (base64String.startsWith('iVBOR')) return 'image/png';     // PNG
        if (base64String.startsWith('R0lGOD')) return 'image/gif';    // GIF
        return 'image/jpeg'; // fallback nếu không khớp
    }

    const handleRemoveImage = (index: number) => {
        selectedImages.splice(index, 1);
        setSelectedImages([...selectedImages]);
    }

    const handleImagePickerPress = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập thư viện ảnh!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setSelectedImages(result.assets);
        } else {
            console.log("Không có ảnh nào được chọn.");
        }
    };

    const getReactionIcon = (type: string) => {
        switch (type) {
            case "LIKE":
                return <AntDesign name="like1" size={20} color="#1877F2" />;
            case "LOVE":
                return <AntDesign name="heart" size={20} color="#E0245E" />;
            case "HAHA":
                return <FontAwesome5 name="laugh-squint" size={20} color="#F7B125" />;
            case "WOW":
                return <FontAwesome5 name="surprise" size={20} color="#F7B125" />;
            case "CRY":
                return <FontAwesome5 name="sad-tear" size={20} color="#F7B125" />
            case "ANGRY":
                return <FontAwesome5 name="angry" size={20} color="#E9710F" />;
            default:
                return null;
        }
    };

    const renderReactionPopup = () => {
        return (
            <View style={styles.reactionPopup}>
                {["LIKE", "LOVE", "HAHA", "WOW", "CRY", "ANGRY"].map((type) => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => {
                            setReactionDTO(type as any)
                            setShowReactionList(false)
                        }}
                    >
                        {getReactionIcon(type as any)}
                    </TouchableOpacity>
                ))}
            </View>
        )
    }


    const renderReaction = () => {
        switch (reactionDTO) {
            case "LIKE":
                return (
                    <>
                        <Text style={[styles.textButton, { color: "#1877F2" }]}>Thích</Text>
                    </>
                );
            case "LOVE":
                return (
                    <>
                        <Text style={[styles.textButton, { color: "#E0245E" }]}>Yêu thích</Text>
                    </>
                );
            case "HAHA":
                return (
                    <>
                        <Text style={[styles.textButton, { color: "#F7B125" }]}>Haha</Text>
                    </>
                );
            case "WOW":
                return (
                    <>
                        <Text style={[styles.textButton, { color: "#F7B125" }]}>Wow</Text>
                    </>
                );
            case "CRY":
                return (
                    <>
                        <Text style={[styles.textButton, { color: "#F7B125" }]}>Buồn</Text>
                    </>
                );
            case "ANGRY":
                return (
                    <>
                        <Text style={[styles.textButton, { color: "#E9710F" }]}>Phẫn nộ</Text>
                    </>
                );
            default:
                return (
                    <>
                        <Text style={styles.textButton}>Thích</Text>
                    </>
                );
        }
    };


    return (
        <View style={{ marginBottom: 20 }}>
            <View>
                <Text style={{ marginBottom: 3, marginLeft: 70 }}>{props.commentedAt}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: 'flex-start', }}>
                <Image
                    style={styles.imgAvatar}
                    source={{ uri: `data:${getImageMime(props.userSummary.avatar)};base64,${props.userSummary.avatar}` }}
                />
                <View style={styles.comment}>
                    <Text style={{ fontSize: 15, fontWeight: 700 }}>{props.userSummary.username}</Text>
                    <Text style={{ fontSize: 15 }}>{props.content}</Text>
                </View>
            </View>
            {props.mediaUrl !== null &&
                <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={{ uri: props.mediaUrl }}
                />
            }
            {
                isShowReactionList &&
                renderReactionPopup()
            }
            <View style={{ flexDirection: "row", marginTop: 7 }}>
                <TouchableOpacity
                    style={{ marginLeft: 70, marginRight: 20 }}
                    disabled={
                        isShowReactionList === true
                    }
                    onPress={async () => {
                        if (reactionDTO !== null) {
                            setReactionDTO(null);
                            // try {
                            //     const response = await deleteReaction(props.post.id);
                            //     console.log("deletePostReaction: ", response);
                            // } catch (e) {
                            //     console.log("Loi deleteReactionPost ", e);
                            // }
                        } else {
                            setReactionDTO("LIKE");
                            // try {
                            //     const response = await sendReaction("POST", "LIKE", props.post.id);
                            //     console.log("response sendReactionPost: ", response);
                            //     console.log("reaction: ", reaction);
                            // } catch (e) {
                            //     console.log("Loi sendReactionPost: ", e);
                            // }
                        }
                    }}
                    onLongPress={() => { setShowReactionList(true) }}
                >
                    {renderReaction()}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    if (isReplyComment === true) {
                        setContentInput(`@${props.userSummary.username}`);
                        setSelectedImages([]);
                    }
                    setReplyComment(!isReplyComment)
                }}>
                    <Text style={{ color: isReplyComment ? '#1877F2' : "black" }}>Trả lời</Text>
                </TouchableOpacity>

                {/* {
                    myId === userId &&
                    <TouchableOpacity style={{ marginLeft: 20 }}>
                        <Text>Chỉnh sửa</Text>
                    </TouchableOpacity>
                } */}
                {
                    props.reactionSummary.total !== 0 &&
                    <View>
                        <Text>{props.reactionSummary.total}</Text>
                    </View>
                }
            </View>


            {/* replyComment */}
            {isReplyComment &&
                <View>
                    <View style={styles.inputRow}>
                        <TextInput
                            placeholder="Write a comment ..."
                            mode="outlined"
                            style={[styles.inputComment]}
                            value={contentInput}
                            onChangeText={(text) => { setContentInput(text) }}
                            outlineColor="#ccc"
                            activeOutlineColor="#000"
                            textColor="#000"
                            multiline
                        />
                        <View style={{ flexDirection: "column" }}>
                            <TouchableOpacity style={{ marginBottom: 15 }} onPress={handleImagePickerPress}>
                                <AntDesign name="camerao" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={
                                    (contentInput === null || contentInput.trim() === "") && selectedImages.length === 0
                                }
                            // onPress={handlePadSendComment}
                            >
                                <Ionicons
                                    name="send"
                                    size={24}
                                    color={(contentInput !== null && contentInput.trim() !== "" || selectedImages.length !== 0) ? "#007AFF" : "#ccc"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {selectedImages.length !== 0 &&
                        <View>
                            <View style={styles.imageContainer}>
                                {selectedImages.map((image, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image
                                            source={{ uri: image.uri }}
                                            style={styles.selectedImage}
                                        />
                                        <TouchableOpacity
                                            onPress={() => handleRemoveImage(index)}
                                            style={styles.removeImageButton}
                                        >
                                            <Ionicons name="close-circle" size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>
                    }
                </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    imgAvatar: {
        width: 40,
        height: 40,
        marginLeft: 10,
        borderRadius: 50
    },
    comment: {
        maxWidth: "80%",
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: "#f2f2f2",
        marginLeft: 15,
        borderRadius: 20
    },
    image: {
        height: 150,
        width: 150,
        marginTop: 10,
        marginLeft: 70,
        borderRadius: 10
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 10,
        paddingBottom: 10,
        paddingRight: 2,
        marginTop: 20
    },
    inputComment: {
        width: "70%",
        borderRadius: 25,
        backgroundColor: "#f0f0f0",
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 50
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 50
    },
    imageWrapper: {
        position: 'relative',
    },
    selectedImage: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 10,
    },
    removeImageButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    reactionPopup: {
        width: 200,
        position: 'absolute',
        left: 70,
        bottom: 20,
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
    textButton: {
        fontSize: 14,
        marginLeft: 3
    },
})