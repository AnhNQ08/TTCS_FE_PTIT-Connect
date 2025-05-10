import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { searchUser } from "../services/userAPI";

export default function SearchOtherPeople() {

    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResult, setSearchResult] = useState<[] | null>(null);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Tìm kiếm"
                mode="flat"
                style={styles.inputSearch}
                underlineColor="transparent"
                theme={{
                    roundness: 20,
                }}
                value={searchValue}
                onChangeText={async (text) => {
                    setSearchValue(text);
                    try {
                        const searchResultTmp = await searchUser(text);
                        setSearchResult(searchResultTmp);
                        console.log(searchResultTmp);
                    } catch (e) {
                        console.log("Lỗi tìm kiếm người dùng khác: ", e);
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 10,
        marginTop: 50
    },
    inputSearch: {
        height: 40,
        backgroundColor: '#fff', // bắt buộc để thấy rõ viền
        borderRadius: 20,
        overflow: 'hidden' // đôi khi cần để hiển thị đúng
    }
})