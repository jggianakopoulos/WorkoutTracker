import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useState, useEffect } from "react";
import Sessions from './sections/Sessions';
import Workouts from './sections/Workouts';
import { Context } from './Context';

const Tab = createBottomTabNavigator();


export default function App() {
  
    Context.db.transaction((tx) => {
      console.log("in transaction", tx);
      tx.executeSql(
        "CREATE TABLE if not exists session ( session_id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE NOT NULL, name varchar(255) default '', created datetime default current_timestamp); "
      , [], (t, success) => {
        console.log("success creating table session", t, success);
      }, (t, error) => {
        console.log("error creating table session", t, error);
      }
      )

      tx.executeSql(
        "CREATE TABLE if not exists workout ( workout_id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(255) default ''); "
      , [], (t, success) => {
        console.log("success creating table workout", t, success);
      }, (t, error) => {
        console.log("error creating table workout", t, error); 
      }
      )

      tx.executeSql(
        "CREATE TABLE if not exists sessionworkout ( sessionworkout_id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER not null, w_index INTEGER default 1, session_id INTEGER not null); "
      , [], (t, success) => {
        console.log("success creating table sessionworkout", t, success);
      }, (t, error) => {
        console.log("error creating table sessionworkout", t, error);
      }
      )

      tx.executeSql(
        "CREATE TABLE if not exists workoutset ( workoutset_id INTEGER PRIMARY KEY AUTOINCREMENT, sessionworkout_id INTEGER not null, weight varchar(8) default '', reps varchar(8), type varchar(30) default 'Working'); "
      , [], (t, success) => {
        console.log("success creating table workoutset", t, success);
      }, (t, error) => {
        console.log("error creating table workoutset", t, error);
      }
      )

    });


  return (
      <PaperProvider>
        <GestureHandlerRootView style={{flex:1}}>
          <View style={styles.container}>
            <NavigationContainer>

              <Tab.Navigator initialRouteName="Sessions" 
                screenOptions={({ route }) => ({
                  headerShown: false,
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
        
                    if (route.name === 'Sessions') {
                      iconName = focused ? 'ios-list' : 'ios-list-outline';
                    } else if (route.name === 'Workouts') {
                      iconName = focused ? 'ios-list' : 'ios-list-outline';
                    }
        
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: 'tomato',
                  tabBarInactiveTintColor: 'gray',
                })}
              >
                <Tab.Screen name="Sessions" component={Sessions} />
                <Tab.Screen name="Workouts" component={Workouts} />
              </Tab.Navigator>

            </NavigationContainer>
          </View>
        </GestureHandlerRootView>

      </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
