import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View, Image, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";

import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { createCommentPost, getPostComment } from "../../services/userAPI";
import Comment from "./Comment";


export default function CommentContainer({ isVisible, onClose, postId }: any) {

    const [contentInput, setContentInput] = useState<string>("");
    const [selectedImages, setSelectedImages] = useState<ImagePickerAsset[]>([]);
    const [listComment, setListComment] = useState<null | any>();
    const [refreshFlag, setRefreshFlag] = useState<true | false>(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getPostComment(postId);
                console.log("refresFlag :", refreshFlag);
                setListComment(response);
            } catch (e) {
                console.log("Lỗi getPostComment: ", e);
            }
        };

        if (postId) {
            fetchComments();
        }
    }, [postId, refreshFlag, isVisible, onClose]);

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

    const handleRemoveImage = (index: number) => {
        selectedImages.splice(index, 1);
        setSelectedImages([...selectedImages]);
    }

    const handleCreateComment = async () => {
        const formData = new FormData();
        if (postId === undefined) {
            alert("Đã xảy ra lỗi! Vui lòng thử lại.");
        } else {
            formData.append(
                "content", contentInput as string,
            )
            if (selectedImages.length != 0) {
                selectedImages.forEach((image, index) => {
                    const uriParts = image.uri.split(".");
                    const fileType = uriParts[uriParts.length - 1];
                    formData.append("file", {
                        uri: image.uri,
                        name: `photo_${index}.${fileType}`,
                        type: `image/${fileType}`,
                    } as any);
                });
            } else {
                formData.append(
                    "file", null as any
                )
            }
            try {
                const response = await createCommentPost(formData, postId);
                if (response !== null) {
                    setContentInput("");
                    setSelectedImages([]);
                    console.log(response);
                }
            } catch (e) {
                console.log("Loi createCommentPost.", e);
            }
        }
    }

    const handlePadSendComment = async () => {
        await handleCreateComment();
        setRefreshFlag(!refreshFlag);
    }

    console.log("PostID: ", postId);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            style={styles.modal}
        >
            <View style={styles.container}>
                <ScrollView style={{ marginTop: 20 }}>
                    {listComment?.map((cmt: any, index: any) => (
                        <Comment
                            key={index}
                            id={cmt.id}
                            content={cmt.content}
                            backgroundUrl={cmt.backgroundUrl}
                            mediaUrl={cmt.mediaUrl}
                            commentedAt={cmt.commentedAt}
                            userSummary={cmt.userSummary}
                            reactionSummary={cmt.reactionSummary}
                            currentUserReaction={cmt.currentUserReaction}
                            reactionDTO={cmt.reactionDTO}
                            haveResponses={cmt.haveResponses}
                            setRefreshFlag = {setRefreshFlag(!refreshFlag)}
                        />
                    ))}
                </ScrollView>
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
                                onPress={handlePadSendComment}
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
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        height: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 16
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 10,
        paddingBottom: 10,
        paddingRight: 2
    },
    inputComment: {
        width: "95%",
        borderRadius: 25,
        backgroundColor: "#f0f0f0",
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10
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
});
function setSelectedImages(assets: ImagePicker.ImagePickerAsset[]) {
    throw new Error("Function not implemented.");
}

