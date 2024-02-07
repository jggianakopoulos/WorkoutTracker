
import { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { View, SafeAreaView, FlatList, Pressable, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text, Button, Appbar, Divider, List } from 'react-native-paper';
import { Context } from '../Context';
import { plus } from 'react-native-vector-icons';
import moment from "moment";

export default function SessionList({ navigation }) {
    const [items, setItems] = useState(null);
  
    useFocusEffect(
      useCallback(() => {
        console.log("were doing good0");
        Context.db.transaction((tx) => {
          tx.executeSql(
            `select * from session order by date desc, created desc`,
            null,
            (_, { rows: { _array } }) => setItems(_array),
            (t, error) => {
              console.log("error creating db", t, error);
            }
          );
        });
      }, []));


  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header>
          <Appbar.Content
            title="Sessions"
          />
          <Appbar.Action icon="plus" onPress={() => navigation.push('SessionAdd') } />
      </Appbar.Header>
      )
    });
  }, [
    navigation
  ]);
          
    console.log("item", items);
    return (
      <View>
        <SafeAreaView>
          <FlatList
            data={items}
            renderItem={({item}) => <PreviousSession navigation={navigation} workout={item} />}
            keyExtractor={item => item.session_id}
            ItemSeparatorComponent={Divider}
          />
        </SafeAreaView>
      </View>
    );
}

function PreviousSession( { navigation, workout } ) {
    var date = moment(workout.date);

    var formatted_date = (date.year() == moment().year()) ? date.format("MM/DD") : date.format("MM/DD/YY");

    return (
      <List.Item
        onPress={() => navigation.navigate("SessionView", {session_id: workout.session_id})}
        title={workout.name}
        right={props => <Text>{formatted_date}</Text>}
      />
    );
}
  