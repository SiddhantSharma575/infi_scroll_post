
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';


const App = () => {
  const [items, setItems] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0)


  const fetchApi = async () => {

    await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${currentPage}`)
      .then((response) => {
        return response.json()
      }).then((data) => {
        setItems([...items, ...data.hits]);
        setFilteredData([...items, ...data.hits])
      })
  }
  useEffect(() => {
    fetchApi()
  }, [currentPage])

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemWrapper}>
        <Text style={styles.textNameStyle}>{`${item.title}`}</Text>
      </View>
    )
  }

  const renderLoader = () => {
    return (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    )
  }

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1)
  }

  const handleChange = (text) => {
    setSearchText(text);
    // console.log(text)
    if (text) {
      const newItems = items.filter((curr) => curr.author.toLowerCase().includes(text.toLowerCase()) || curr.title.toLowerCase().includes(text.toLowerCase()));
      setFilteredData(newItems);
    } else {
      setFilteredData(items)
    }
  }

  return (

    <View style={styles.body}>
      <TextInput style={styles.input} placeholder="Enter Title or Author Name" value={searchText} onChangeText={(text) => handleChange(text)} />
      <FlatList data={filteredData} renderItem={renderItem} keyExtractor={item => item.createdAt} ListFooterComponent={renderLoader} onEndReached={loadMoreItem} onEndReachedThreshold={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    margin: 10
  },
  textNameStyle: {
    fontSize: 16
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: "center"

  }
});

export default App;
