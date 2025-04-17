import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteStackParamList } from './routeParams';
import Home from './view/Home';
import Login from './view/Login';
import Friend from './view/Friend';
import Messenger from './view/Messenger';
import Notification from './view/Notification';
import SignUp from './view/SIgnUp';
import MyProFile from './view/MyProfile';

const Stack = createNativeStackNavigator<RouteStackParamList>();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Friend"
          component={Friend}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Messenger"
          component={Messenger}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyProfile"
          component={MyProFile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
