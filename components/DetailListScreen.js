import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, List, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailListScreen({ navigation, route }) {
  let dataObj = route.params;
  const [currentList, setCurrentList] = useState();
  const [allLists, setAllLists] = useState();
  const [currentItems, setCurrentItems] = useState([])
  const [itemName, setItemName] = useState();

  useEffect(() => {
    getCurrentList();
  }, []);

  const getCurrentList = async () => {
    console.log('DETAIL GET DATA LOAD ');
    try {
      const lists = await AsyncStorage.getItem('lists');
      console.log('DETAIL GET DATA LOAD ', lists);
      if (!lists) {
        setNoListMessage('You have no lists at this time. Please add a list.');
      } else {
        setCurrentList(JSON.parse(lists)[dataObj.index]);
        console.log('DETAIL GET DATA JSON ', JSON.parse(lists)[dataObj.index]);
        setAllLists(JSON.parse(lists));
      }
    } catch (e) {
      console.log('DETAIL GET DATA ERROR ', e);
    }
  };

  const saveData = async () => {
    currentList.items.push({itemTitle: itemName});
    setCurrentItems(currentList.items)
    console.log(currentList.items);
    setItemName('');
    console.log(currentList);
  }

   const updateItemArray = async (filterArray) => {
    console.log('UPDATE ITEMs ', filterArray);
    console.log('UPDATE ITEMs CURRENT ITEMS ', currentItems)
    // await AsyncStorage.setItem('lists', JSON.stringify(filterArray));
    // getData();
  };

  return (
    <View>
      <View>
        <h1 style={styles.title}>{dataObj.title}</h1>
      </View>
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          This is the about screen with this data. {dataObj.title} what is the
          index? {dataObj.index}
        </Text>
        <TouchableOpacity
          style={styles.button}
          title="Go to About"
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.text}>Go Back </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TextInput
          placeholder="Item Name"
          onChangeText={setItemName}
          value={itemName}
        />
        <Button onPress={saveData}>Save item to list</Button>
      </View>
      <View>
        {currentItems.map((item, idx) => (
          <List.Item
            style={styles.lists}
            title={item.itemTitle}
            onPress={() =>
              navigation.navigate('DetailList', {
                title: item.itemTitle,
                index: idx,
              })
            }
            right={(props) => (
              <IconButton
                onPress={() => {
                  setCurrentItems(currentItems.filter((a) => a.itemTitle !== item.itemTitle));
                  
                  updateItemArray(
                    currentItems.filter((a) => a.itemTitle !== item.itemTitle)
                  );
                }}
                icon="delete"
                size={20}
              />
            )}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  button: {
    backgroundColor: '#0000ee',
    padding: 10,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  paragraph: {
    padding: 8,
  },
  title: {
    textTransform: 'capitalize',
  },
});
