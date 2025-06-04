// components/ShareModal.tsx
import React, { useState } from 'react';
import { Modal, View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ShareModalProps {
    visible: boolean;
    onClose: () => void;
    onShare: (content: string, privacy: string) => void;
}

export default function ShareModal({ visible, onClose, onShare }: ShareModalProps) {
    const [content, setContent] = useState('');
    const [privacy, setPrivacy] = useState<'PUBLIC' | 'FRIENDS'>('PUBLIC');

    const handleShare = () => {
        onShare(content, privacy);
        setContent('');
        setPrivacy('PUBLIC');
        onClose();
    };

    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Chia sẻ bài viết</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập nội dung chia sẻ..."
                        multiline
                        value={content}
                        onChangeText={setContent}
                    />
                    <View style={styles.privacyContainer}>
                        <TouchableOpacity
                            style={[
                                styles.privacyButton,
                                privacy === 'PUBLIC' && styles.selected
                            ]}
                            onPress={() => setPrivacy('PUBLIC')}
                        >
                            <Text style={styles.privacyText}>Công khai</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.privacyButton,
                                privacy === 'FRIENDS' && styles.selected
                            ]}
                            onPress={() => setPrivacy('FRIENDS')}
                        >
                            <Text style={styles.privacyText}>Bạn bè</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                            <Text>Chia sẻ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        minHeight: 80,
        marginBottom: 10
    },
    privacyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    privacyButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc'
    },
    selected: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3'
    },
    privacyText: {
        color: '#fff'
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    cancelBtn: {
        marginRight: 10,
        padding: 10
    },
    shareBtn: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5
    }
});
