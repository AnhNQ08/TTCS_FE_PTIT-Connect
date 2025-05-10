import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteStackParamList } from './routeParams';
import Home from './screens/Home';
import Login from './screens/Login';
import Friend from './screens/Friend';
import Messenger from './screens/Messenger';
import Notification from './screens/Notification';
import SignUp from './screens/SIgnUp';
import MyProFile from './screens/MyProfile';
import MessengerBox from './screens/MessengerBox';
import AddPost from './screens/AddPost';
import SearchOtherPeople from './screens/SearchOtherPeople';
import OtherUserProfile from './screens/OtherUserProfile';

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
        <Stack.Screen
          name="MessengerBox"
          component={MessengerBox}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPost"
          component={AddPost}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchOtherPeople"
          component={SearchOtherPeople}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtherUserProfile"
          component={OtherUserProfile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
