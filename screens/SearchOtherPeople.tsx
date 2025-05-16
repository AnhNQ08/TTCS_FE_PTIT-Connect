import React, { useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { TextInput } from "react-native-paper";
import { searchUser } from "../services/userAPI";
import SearchResultBox from "../components/Search/SearchResultBox";

// Định nghĩa kiểu dữ liệu cho mỗi kết quả tìm kiếm
type SearchResultType = {
    id: number;
    username: string;
    avatar: string;
};

export default function SearchOtherPeople() {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResult, setSearchResult] = useState<SearchResultType[] | null>(null);

    const fetchSearchResult = async (keyword: string) => {
        try {
            const response = await searchUser(keyword);
            console.log("response: ", response);
            setSearchResult(null);
            setSearchResult(response);
        } catch (e) {
            console.log("Lỗi tìm kiếm người dùng khác: ", e);
        }
    };

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
                    console.log(text);
                    if (text !== "") {
                        setSearchValue(text);
                        await fetchSearchResult(text);
                    } else {
                        setSearchValue("");
                        setSearchResult(null);
                    }
                }}
            />
            {
                searchResult !== null &&
                <View>
                    <FlatList
                        data={searchResult || []}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <SearchResultBox user={item} />}
                    />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 10,
        marginTop: 50,
    },
    inputSearch: {
        height: 40,
        backgroundColor: "#fff",
        borderRadius: 20,
        overflow: "hidden",
    },
});
