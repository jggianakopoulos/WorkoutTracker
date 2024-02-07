import { Context}  from './../Context';
import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, FlatList, } from 'react-native';
import {  Text, Button, TextInput, } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

function addSessionSQL(name, date, navigation) {
    const formatted_date = format(date, "yyyy-MM-dd");
    Context.db.transaction((tx) => {
      tx.executeSql(
        " insert into session (date, name) values (?, ?) ",
        [formatted_date,name],
        (t, success) => {
          console.log("successful insert", t, success);
          navigation.navigate("SessionList");
        },
        (t, error) => {
          console.log("insert error", t, error);
        }
      );
    });
  
    console.log("after add", name, date);
  }
  
  export default function SessionAdd( { navigation }) {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const onChange = (event, selectedDate) => {
        console.log(selectedDate)
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    return (
      <View>
        <Text variant="headlineMedium">Add Session</Text>
        <View>
          <TextInput style={{margin:10}} label="Name" onChangeText={setName} defaultValue={name}/>
        </View>
        <View>
          <Text variant="bodyMedium">Date</Text>
            {/* <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                onChange={onChange}
            /> */}
        </View>
        {/* TODO: tags that can be added */}
        <Button mode="contained-tonal" onPress={() =>{
          if (name != "") {
            addSessionSQL(name, date, navigation);
          } else {
            //TODO: toast
          }
        }}>Save</Button>
        
      </View>
  
    );
  }