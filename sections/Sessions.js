import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionList from '../screens/SessionList';
import SessionAdd from '../screens/SessionAdd';
import SessionView from '../screens/SessionView';
import SessionWorkoutDrilldown from '../screens/SessionWorkoutDrilldown';

const Stack = createNativeStackNavigator();

function Sessions({ route }) {

    return (
        <Stack.Navigator initialRouteName="SessionList" >
            <Stack.Screen name="SessionList" component={SessionList} />
            <Stack.Screen name="SessionAdd" component={SessionAdd} />
            <Stack.Screen name="SessionView" component={SessionView} />
            <Stack.Screen name="SessionWorkoutDrilldown" component={SessionWorkoutDrilldown} />
        </Stack.Navigator>
    );
}

export default Sessions;