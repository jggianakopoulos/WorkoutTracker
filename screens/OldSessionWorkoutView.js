function SessionWorkoutView({item, navigation}) {
    const [showExpanded, setShowExpanded] = useState(false);
    const [data, setData] = useState(item.data);
  
    function updateSessionWorkout(sessionworkout_id, data) {
      console.log("update", sessionworkout_id, data);
      Context.db.transaction((tx) => {
        tx.executeSql(
          `update sessionworkout set data = ? where sessionworkout_id = ?`,
          [data, sessionworkout_id],
          (_, result, next) => {
            console.log(["updated", result, next]);
          },
          (error) => {
            console.log("execute error: " + JSON.stringify(error));
          }
        );
      });
    }
  
    console.log(["item", item]);
  
  
    return (
      <View>
        <Pressable onPress={() => {
          setShowExpanded(!showExpanded);
        }}>
          <View style={{paddingVertical:15, paddingHorizontal:10, margin:5}}>
            <Text>{item.name}</Text>
            { !showExpanded && data != "" && <Text>{data}</Text>
            }
          </View>
        </Pressable>
        { showExpanded &&
          <View>
            <View style={{padding:10}}>
              <TextInput style={{borderWidth:1, borderColor:"black", padding:3}} onEndEditing={() => {
                updateSessionWorkout(item.sessionworkout_id, data)
              }} onChangeText={(text) => {
                  setData(text);
              }} value={data} />
            </View>
            <Button mode="contained-tonal" onPress={() => {
              navigation.navigate("SessionWorkoutDrilldown", {sessionworkout_id: item.sessionworkout_id, workout_id: item.workout_id})
            }}>Drilldown</Button>
          </View>
        }
      </View>
    );