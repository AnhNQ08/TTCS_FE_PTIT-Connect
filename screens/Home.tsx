import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import Post from '../components/Post';
import HeaderBottom from '../components/HeaderBottom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNewestPost, sharePost } from '../services/userAPI';
import CommentContainer from '../components/Comment/CommentContainer';
import { useFocusEffect } from '@react-navigation/native';
import ShareModal from '../components/ShareModel';

export default function Home() {

    type User = {
        id: number;
        name: string;
        avatar: Uint8Array;
    }

    type MediaType = "IMAGE" | "VIDEO";

    type PostMedia = {
        url: string;
        mediaType: MediaType;
    };

    type Reaction = {
        reactor: string;
        emotion: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";
    };

    type userSummary = {
        id: number;
        username: string;
        avatar: string;
    };

    type NewestPost = {
        id: number;
        content: string;
        backgroundUrl: string;
        postMediaList: PostMedia[];
        createdAt: string;
        updatedAt: string;
        userSumary: userSummary;
        emotions: string[];
        reactionsDto: Reaction[];
    };


    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [newestPost, setNewestPost] = useState<NewestPost[]>([]);
    const [isShowCommentContainer, setShowCommentContainer] = useState<true | false>(false);
    const [selectedPostId, setSelectedPostId] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isFetching, setIsFetching] = useState(false);
    const [isShareModalVisible, setShareModalVisible] = useState(false);
    const [sharedPostId, setSharedPostId] = useState<number | null>(null);



    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const tmp = await AsyncStorage.getItem('dataCurrentUser');
                console.log(tmp);
                if (tmp != null) setCurrentUser(JSON.parse(tmp));
            } catch (e) {
                console.error(e);
            }
        }

        fetchCurrentUser();
    }, [])

    useEffect(() => {
        const fetchNewestPost = async () => {
            console.log("fetchGetNewestPost");
            if (isFetching) return;
            setIsFetching(true);
            try {
                const newestPostTmp = await getNewestPost(pageNumber);
                console.log("newestPostTmp: ", newestPostTmp);
                setNewestPost(prev => [...prev, ...newestPostTmp]);
            } catch (e) {
                console.log("Lỗi lấy bài viết mới nhất: ", e);
            } finally {
                setIsFetching(false);
            }
        };
        fetchNewestPost();
    }, [pageNumber]);

    const padComment = (postId: number) => {
        setShowCommentContainer(true);
        setSelectedPostId(postId);
        console.log(postId);
    }

    const handleSharePost = async (content: string, privacy: string) => {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("privacy", privacy);
        try {
            if (!sharedPostId) return;
            await sharePost(sharedPostId, formData);
            console.log('Chia sẻ thành công');
        } catch (err) {
            console.log('Chia sẻ thất bại', err);
        }
        setShareModalVisible(false);
    };


    return (
        <View style={{ flex: 1 }}>
            <View>
                <Header />
                {currentUser && <HeaderBottom currentUser={currentUser} />}
            </View>
            <FlatList
                data={newestPost}
                // keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Post
                        post={item}
                        padComment={() => padComment(item.id)}
                        padShare={() => {
                            setSharedPostId(item.id);
                            setShareModalVisible(true);
                        }}
                    />
                )}
                onEndReached={() => {
                    console.log("Reached end of list. Load more...");
                    setPageNumber(prev => prev + 1);
                }}
                onEndReachedThreshold={0.5}
            />
            <CommentContainer
                isVisible={isShowCommentContainer}
                onClose={() => setShowCommentContainer(false)}
                postId={selectedPostId}
            />
            <ShareModal
                visible={isShareModalVisible}
                onClose={() => setShareModalVisible(false)}
                onShare={handleSharePost}
            />


        </View>
    );
}
