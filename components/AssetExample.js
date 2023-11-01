import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image  } from 'react-native';
import { TextInput, Button, List, IconButton, useRef } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AssetExample({ navigation, route }) {
  const listItemIdx = 0;
  // const TextInput = ue
  const [listName, setListName] = useState();
  const [noListMessage, setNoListMessage] = useState('');
  const [allData, setAllData] = useState([]);
  const myArray = [{ name: 'Todd' }, { name: 'Teresa' }];

  useEffect(() => {
    getData();
  }, []);

  // useEffect(() => {
  //   if(allData.length != 0){
  //     saveData()
  //   }
  // }, [allData]);

  const saveData = async () => {
    console.log('ASSETS SAVE DATA ', allData + ' ' + listName);

    let newArray = [];

    let newObj = { name: listName, items: [] };
    console.log('ASSETS SAVE DATA NEW OBJ', allData);
    if (allData.length != 0) {
      newArray = allData;
      newArray.push(newObj);
    } else {
      newArray.push(newObj);
    }
    
    setListName("");
    await AsyncStorage.setItem('lists', JSON.stringify(newArray));
    
    getData();
  };

  const updateDeletedArray = async (filterArray) => {
    console.log('UPDATE DELETE ', filterArray);
    await AsyncStorage.setItem('lists', JSON.stringify(filterArray));
    getData();
  };

  const getData = async () => {
    console.log('ASSETS GET DATA LOAD ');
    try {
      const lists = await AsyncStorage.getItem('lists');
      console.log('ASSETS GET DATA LOAD ', lists);
      if (!lists) {
        setNoListMessage('You have no lists at this time. Please add a list.');
      } else {
        console.log('ASSETS GET DATA JSON ', JSON.parse(lists));
        setAllData(JSON.parse(lists));
      }
    } catch (e) {
      console.log('ASSET GET DATA ERROR ', e);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {noListMessage ? <Text>{noListMessage}</Text> : ''}
        <TextInput
          placeholder="List Name"
          onChangeText={setListName}
          value={listName}
        />
        <Button onPress={saveData}>Save List Name</Button>
        {listName ? <Text>{listName}</Text> : <Text>Nothing To See Here</Text>}
        {allData ? <Text>{allData.name}</Text> : <Text>No Data</Text>}
      </View>
      <View>
        {allData.map((list, idx) => (
          <List.Item
            style={styles.lists}
            title={list.name}
            onPress={() =>
              navigation.navigate('DetailList', {
                title: list.name,
                index: idx,
              })
            }
            right={(props) => (
              <IconButton
                onPress={() => {
                  setAllData(allData.filter((a) => a.name !== list.name));
                  updateDeletedArray(
                    allData.filter((a) => a.name !== list.name)
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
    padding: 10,
  },
  lists: {
    backgroundColor: '#aaa',
  },
});
