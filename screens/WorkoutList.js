import { Context}  from '../Context';
import { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, SafeAreaView, FlatList, Pressable, ScrollView } from 'react-native';
import { Text, Button, TextInput, Appbar, Portal, Modal} from 'react-native-paper';



  function Workout({navigation, workout}) {
    return (
      <View>
        <Pressable onPress={() => navigation.navigate("WorkoutDrilldown", {workout: workout.workout_id})}>
          <View style={{display:"flex",flexDirection:"row",paddingVertical:25, paddingHorizontal:10}}>
            <Text variant="titleMedium" >{workout.name}</Text>

          </View>
        </Pressable>
      </View>
    );
  }

  function Workouts({ navigation, refresher }) {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
    Context.db.transaction((tx) => {
        tx.executeSql(
          `select * from workout`,
          [],
          (_, { rows: { _array } }) => {
            console.log("workouts" , _array);
            setWorkouts(_array);
          },
          (t, error) => {
            // TODO: toast

            console.log("insert error", t, error);
          }
        );
      });
    }, [refresher]);

    console.log("workout11");

    return (
      <View>
        <FlatList 
          data={workouts}
          keyExtractor={item => item.workout_id}
          renderItem={(selected) => <Workout navigation={navigation} workout={selected.item} />}
        />
      </View>
    );
  }

  
  function WorkoutList( { navigation }) {
    const [name, setName] = useState("");
    const[refresher, setRefresher] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const hideModal = () => setModalVisible(false);

    useLayoutEffect(() => {
      navigation.setOptions({
        header: () => (
          <Appbar.Header>
            <Appbar.Content
              title="Workout List"
            />
            <Appbar.Action icon="plus" onPress={() => setModalVisible(true) } />
        </Appbar.Header>
        )
      });
    }, [
      modalVisible
    ]);

    function addWorkoutSQL(name, navigation) {
      if (name != "") {
        console.log("hello?");
          Context.db.transaction((tx) => {
              console.log("ASDF");
              tx.executeSql(
                " insert into workout (name) values (?) ",
                [name],
                (t, success) => {
                  // TODO: toast
                  console.log("successful insert", t, success);
                  console.log("name " + name)
                  setName("")
                },
                (t, error) => {
                  // TODO: toast
  
                  console.log("insert error", t, error);
                }
              );
            });
            console.log("fa");
      } else {
          // TODO: toast
          console.log("enter a name");   
      }
  
    
      console.log("after add", name,);
    }

    const containerStyle = {margin: 20};

    return (
      <View>
        <SafeAreaView>
          <Portal>
            <Modal style={{opacity:90}} visible={modalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
              <Pressable style={{alignSelf:"flex-end", marginRight:10}} onPress={() => {
                setModalVisible(false);
              }}>
                <Text>X</Text>
              </Pressable>
              <View  style={{paddingTop:25, paddingHorizontal:10}} >
                <Text variant="headlineMedium">Workouts</Text>
                <TextInput style={{marginTop:10}} mode='outlined' onChangeText={setName} value={name}/>
              </View>
              <Button style={{marginTop:5}} mode="contained-tonal"  onPress={() =>{
                  addWorkoutSQL(name,navigation);
                  setRefresher(!refresher);
              }}>Add</Button>
            </Modal>
          </Portal>
          <Workouts navigation={navigation} refresher={refresher}/>
        </SafeAreaView>
      </View>
    );
  }

  export default WorkoutList;