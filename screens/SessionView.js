
import { useState, useEffect, useLayoutEffect } from "react";
import { View, SafeAreaView, FlatList, Pressable, Animated, StyleSheet  } from 'react-native';
import { TextInput, Text, Button, Modal, Portal, Appbar, FAB } from 'react-native-paper';
import { Directions, Gesture } from 'react-native-gesture-handler';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

import Autocomplete from "../components/Autocomplete";
import { Context } from '../Context';

// SESSION VIEW

function SessionView({ route, navigation }) {
  const [session, setSession] = useState("");
  const [workouts, setWorkouts] = useState([]);

  const [sessionworkouts, setSessionWorkouts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => setModalVisible(false);
  const EDIT_ICON = editMode ? "check" : "playlist-edit";

  const session_id = route.params.session_id; 
  useEffect(() => {
   console.log("set session");

    Context.db.transaction((tx, session) => {
      tx.executeSql(
        `select * from session where session_id = ?`,
        [session_id],
        (_, { rows: { _array } }) => {
          setSession(_array[0]);
        }
      );
    });
  }, []);

  var retrieveSessionWorkouts = function() {
    Context.db.transaction((tx) => {
      tx.executeSql(
        `select *, workout.name as workout_name from sessionworkout join workout using (workout_id) where session_id = ? order by w_index asc`,
        [session_id],
        (_, { rows: { _array } }) => {
          console.log(["sessionworkouts", _array]);
          setSessionWorkouts(_array);
        },
        (t, error) => {
          console.log("error retrieving sw", t, error);
        }
      );
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title={session.name}
          />
          <Appbar.Action icon={EDIT_ICON} onPress={() => {setEditMode(!editMode)}} />
        </Appbar.Header>
      )
    });
  }, [
    EDIT_ICON,
    setEditMode,
    editMode,
    session
  ]);

  useEffect(() => {
    console.log("retrieve session workouts");
    retrieveSessionWorkouts();
  }, []);
  useEffect(() => {
    console.log("workout select");

    Context.db.transaction((tx) => {
      tx.executeSql(
        `select * from workout`,
        [],
        (_, { rows: { _array } }) => {
          setWorkouts(_array);
        }
      );
    });
  }, []);

  function addFunction(workout_id) {
    console.log("add function", session_id, workout_id);
    Context.db.transaction((tx) => {
      tx.executeSql(
        `insert into sessionworkout (workout_id, session_id, w_index) values (?, ?, ?)`,
        [workout_id, session_id, sessionworkouts.length + 1],
        (_, result, next) => {
          console.log(["check here", next]);
          console.log(result);
          console.log(["index", sessionworkouts.length + 1]);
          retrieveSessionWorkouts();
        }
      );
    });
  }

  const containerStyle = {margin: 20};

  function updateIndex(flatlist_index, move_down) {
    console.log(["update index", flatlist_index, move_down]);

    var sessionworkout = sessionworkouts[flatlist_index];

    var index = sessionworkout["w_index"];

    var new_index;
    var replaced_sw;
    if (move_down) {
      new_index = sessionworkout["w_index"] + 1;

      if (new_index > sessionworkouts.length) {
        console.log("ERROR");
        // TODO: throw error
        return false;
      }
      
      replaced_sw = sessionworkouts[flatlist_index + 1]
    } else {
      new_index = sessionworkout["w_index"] - 1;

      if (new_index == 0) {
        console.log("ERROR");
        // TODO: throw error
        return false;
      }

      replaced_sw = sessionworkouts[flatlist_index - 1]
    }

    console.log("session workout current and below", sessionworkout, replaced_sw);

    Context.db.transaction((tx) => {
      tx.executeSql(
        `update sessionworkout set w_index = ? where sessionworkout_id = ?`,
        [new_index, sessionworkout["sessionworkout_id"]],
        (_, result, next) => {
          console.log("result", result);
        },
        (t, error) => {
          console.log("error in update", t, error);
        }
      );
      tx.executeSql(
        `update sessionworkout set w_index = ? where sessionworkout_id = ?`,
        [index, replaced_sw["sessionworkout_id"]],
        (_, result, next) => {
          console.log("result", result);
        },
        (t, error) => {
          console.log("error in update", t, error);
        }
      );
    });

    retrieveSessionWorkouts();

    
  }


  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })

  return (
    <View style={{display:"flex", flex:1}}>
      <Portal>
        <Modal style={{opacity:90}} visible={modalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Pressable style={{alignSelf:"flex-end", marginRight:10}} onPress={() => {
            setModalVisible(false);
          }}>
            <Text>X</Text>
          </Pressable>
          <Text  variant="headlineSmall" style={{paddingHorizontal:10}}>Add Workout</Text>
          <Autocomplete id="workout_id" addFunction={addFunction} options={workouts} />
        </Modal>
      </Portal>
      <FlatList 
          data={sessionworkouts}
          keyExtractor={item => item.sessionworkout_id}
          renderItem={(selected) => <SessionWorkoutView navigation={navigation} item={selected.item} index={selected.index} editMode={editMode} updateIndex={updateIndex}/>}
      />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        />
    </View>
  );


}


function SessionWorkoutView({item, index, navigation, editMode, updateIndex}) {
  const [showExpanded, setShowExpanded] = useState(false);
  const [data, setData] = useState(item.data);

  console.log(["index", index]);
  console.log(["item", item]);

  var mainBasis = editMode ? "70%" : "100%"

  return (
    <View style={{display:"flex", flexDirection:"row", paddingVertical:15, margin:5}}>
      { editMode &&
      <Pressable style={{flexBasis:"15%", justifyContent:"center"}} onPress={() => { 
        console.log("up");
        updateIndex(index, false);
      }}>
        <AntDesign name="caretup" size={24}  />
      </Pressable> }
      <Pressable style={{flexBasis:mainBasis}} onPress={() => {
        navigation.navigate("SessionWorkoutDrilldown", {sessionworkout_id: item.sessionworkout_id, workout_id: item.workout_id, workout_name: item.workout_name});
      }}>
        <View>
          <Text style={{paddingHorizontal:10}}>{item.name}</Text>
          { data != "" && <Text>{data}</Text> }
        </View>
      </Pressable>
      { editMode &&
      <Pressable style={{flexBasis:"15%"}} onPress={() => { 
        console.log("down");
        updateIndex(index, true);
      }}>
        <AntDesign name="caretdown" size={24}  />

      </Pressable>
      }
    </View>
  );
}

export default SessionView;