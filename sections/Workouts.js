import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutList from '../screens/WorkoutList';
import WorkoutDrilldown from '../screens/WorkoutDrilldown';
import SessionWorkoutDrilldown from '../screens/SessionWorkoutDrilldown';

const Stack = createNativeStackNavigator();

function Workouts({ route }) {

    return (
        <Stack.Navigator initialRouteName="WorkoutList" >
            <Stack.Screen name="WorkoutList" component={WorkoutList} />
            <Stack.Screen name="WorkoutDrilldown" component={WorkoutDrilldown} />
            {/* <Stack.Screen name="SessionWorkoutDrilldown" component={SessionWorkoutDrilldown} /> */}
        </Stack.Navigator>
    );
}

export default Workouts;