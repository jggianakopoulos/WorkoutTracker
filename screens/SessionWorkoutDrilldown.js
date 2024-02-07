import { useState, useEffect, useLayoutEffect } from "react";
import { View, SafeAreaView, FlatList, Pressable  } from 'react-native';
import Autocomplete from "../components/Autocomplete";
import { Context } from '../Context';
import { Text, Button, TextInput, Appbar } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';



function SessionWorkoutDrilldown({ route, navigation }) {
    const [workoutSets, setWorkoutSets] = useState([]);
    const [otherworkouts, setSessionWorkouts] = useState([]);
    const[editMode, setEditMode] = useState(false);

    const workout_id = route.params.workout_id;
    const workout_name = route.params.workout_name;
    const sessionworkout_id = route.params.sessionworkout_id;
    console.log("sessionworkout_id", sessionworkout_id);

    function retrieveWorkoutSets() {
      console.log("retrieve");
      Context.db.transaction((tx) => {
        tx.executeSql(
          `select * from workoutset where sessionworkout_id = ?`,
          [sessionworkout_id],
          (_, { rows: { _array } }) => {
            setWorkoutSets(_array);
            console.log(["workoutsets", workoutSets]);
          },
          (t, error) => {
            console.log("error creating table workout", t, error);
          }
        );
      });
    }

    useEffect(retrieveWorkoutSets, []);

    useLayoutEffect(() => {
      navigation.setOptions({
        header: () => (
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content 
              title={workout_name}
            />
        </Appbar.Header>
        )
      });
    }, [workout_name, navigation]);

    useEffect(() => {
      Context.db.transaction((tx) => {
        tx.executeSql(
          `select * from sessionworkout join workout using (workout_id) join session using (session_id) where sessionworkout.workout_id = ? and sessionworkout.sessionworkout_id != ?`,
          [workout_id, sessionworkout_id],
          (_, { rows: { _array } }) => {
            setSessionWorkouts(_array);
            console.log(["otherworkouts", otherworkouts]);
          },
          (t, error) => {
            console.log("error creating table workout", t, error);
          }
        );
      });

    }, []);


    function createNewSet() {
      console.log("create new set");
      Context.db.transaction((tx) => {
        console.log("hi lo");
        tx.executeSql(
          `insert into workoutset (sessionworkout_id) values (?) `,
          [sessionworkout_id],
          (_, result, next) => {
            console.log("result", result);
            retrieveWorkoutSets();
          },
          (t, error) => {
            console.log("error creating table workout", t, error);
          }
        );
      });
    }


    console.log(["otherworkouts", otherworkouts]);
    var width = editMode ? "25%" : "30%";

    return (
        <View>
            <SafeAreaView>
                <View style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"center",flexWrap:"nowrap", paddingVertical:5, paddingHorizontal:10, textAlign:"center"}}>
                  <Text style={{flexGrow:0,flexShrink:0,flexBasis:"40%", textAlign:"center"}}>Type</Text>
                  <Text style={{flexGrow:0,flexShrink:0,flexBasis:width, textAlign:"center" }}>Lbs</Text>
                  <Text style={{flexGrow:0,flexShrink:0,flexBasis:width,  textAlign:"center" }}>Reps</Text>
                </View>
                <FlatList
                  data={workoutSets}
                  renderItem={({item}) => <WorkoutSetView retrieveWorkoutSets={retrieveWorkoutSets} workoutset={item}/>}
                  keyExtractor={item => item.workoutset_id}
                />
                <Pressable style={{width:"100%", paddingVertical:20, marginHorizontal:5,textAlign:"center", backgroundColor:"white"}} onPress={() => {
                  createNewSet();
                }}>
                  <Text style={{textAlign:"center",}}>Add Set</Text>
                </Pressable>
                <Text variant="headlineSmall">Previous Workouts</Text>
                <FlatList
                    data={otherworkouts}
                    renderItem={({item}) => <PreviousSessionWorkout navigation={navigation} workout={item} editMode={editMode} />}
                    keyExtractor={item => item.sessionworkout_id}
                />
            </SafeAreaView>
        </View>
    );
}

function WorkoutSetView({workoutset, retrieveWorkoutSets, editMode}) {
  const [weight, setWeight] = useState(workoutset.weight);
  const [reps, setReps] = useState(workoutset.reps);

  function deleteSet(workoutset_id) {
    console.log("delete set");
    Context.db.transaction((tx) => {
      console.log("hi lo");
      tx.executeSql(
        `delete from workoutset where workoutset_id = ?`,
        [workoutset_id],
        (_, result, next) => {
          console.log("result", result);
          retrieveWorkoutSets();
        },
        (t, error) => {
          console.log("error creating table workout", t, error);
        }
      );
    });
  }

  function updateSet(update_workoutset) {
    console.log("update set");
    Context.db.transaction((tx) => {
      tx.executeSql(
        `update workoutset set type=?, weight=?, reps=? where workoutset_id = ?`,
        [update_workoutset.type, update_workoutset.weight, update_workoutset.reps, update_workoutset.workoutset_id],
        (_, result, next) => {
          console.log("result", result);
        },
        (t, error) => {
          console.log("error in update", t, error);
        }
      );
    });
  }

  var width = editMode ? "25%" : "30%";

  var types = ["Warmup", "Working", "Rest-Pause", "Drop"];

  var textInputStyle = {
    width:"80%", alignSelf:"center", padding:5
  };
  return(
    <SafeAreaView>
      <View style={{}} >
        <View style={{width:"100%",display:"flex",flexDirection:"row",flexWrap:"nowrap", paddingVertical:5, paddingHorizontal:10}}>
          <View style={{flexGrow:0,flexShrink:0,flexBasis:"40%", paddingTop:5}}>
            <SelectDropdown
            buttonStyle={{width:"100%", borderRadius:5}}
            defaultButtonText={workoutset.type}
            data={types}
            onSelect={(selectedItem, index) => {
              workoutset.type = selectedItem;
              updateSet(workoutset);
              console.log(selectedItem, index)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item
            }}
          />
          </View>
          <View style={{flexGrow:0,flexShrink:0,flexBasis:width}} >
            <TextInput style={{padding:10}} keyboardType="decimal-pad" onChangeText={setWeight}  value={weight} style={textInputStyle}  onEndEditing={() => {
              workoutset.weight = weight;
              updateSet(workoutset);
            }}/>
          </View>
          <View style={{flexGrow:0,flexShrink:0,flexBasis:width}} >
            <TextInput keyboardType="decimal-pad" onChangeText={setReps} value={reps} style={textInputStyle} onEndEditing={() => {
              workoutset.reps = reps;
              updateSet(workoutset);
            }}/>
          </View>
          { editMode && <Pressable style={{flexGrow:0,flexShrink:0,flexBasis:"10%"}} onPress={() => {
            deleteSet(workoutset.workoutset_id)
            console.log("Button press");
          }}>
              <AntDesign name="closecircle" size={32}  />
          </Pressable> }
        </View>
      </View>
    </SafeAreaView>
  );
}

function PreviousSessionWorkout({ workout, navigation }) {
    return (
        <View style={{}}>
            {/* <Pressable onPress={() => navigation.navigate("SessionWorkoutDrilldown", {sessionworkout_id: workout.sessionworkout_id, workout:workout.workout_id})}> */}
              <View style={{display:"flex",flexDirection:"row",paddingVertical:25, paddingHorizontal:10}}>
                <View style={{flexGrow:0,flexShrink:0,flexBasis:"80%"}} >
                    <Text variant="titleMedium" >{workout.data}</Text>
                    <Text variant="titleMedium" >{workout.name}</Text>
                </View>
                <Text variant="titleMedium" style={{flexGrow:0,flexShrink:0,flexBasis:"20%", alignSelf:"flex-end"}}>{workout.date}</Text>
              </View>
            {/* </Pressable> */}

        </View>
    );
}

export default SessionWorkoutDrilldown;