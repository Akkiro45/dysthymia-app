import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { autoSignin } from './src/store/actions/index';
import { PURPLE } from './src/util/color';
import { HOME, JOURNAL } from './src/util/icons';

import LoadingScreen from './src/screens/Loading/Loading';
import Welcome1Screen from './src/screens/Welcome1/Welcome1';
import SignupScreen from './src/screens/Signup/Signup';
import SigninScreen from './src/screens/Signin/Signin';
import Home from './App1';
import Init1Screen from './src/screens/Init1/Init1';
import Init2Screen from './src/screens/Init2/Init2';
import Init3Screen from './src/screens/Init3/Init3';
import Welcome2Screen from './src/screens/Welcome2/Welcome2';
import JournalScreen from './src/screens/Journal/Journal';

const AuthStack = createStackNavigator();
const authStack = () => (
  <AuthStack.Navigator headerMode='none' >
    <AuthStack.Screen name="Welcome1" component={Welcome1Screen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
    <AuthStack.Screen name="Signin" component={SigninScreen} />
  </AuthStack.Navigator>
);

const InitStack = createStackNavigator();
const initStack = () => (
  <InitStack.Navigator headerMode='none' >
    <InitStack.Screen name="Init1" component={Init1Screen} />
    <InitStack.Screen name="Init2" component={Init2Screen} />
    <InitStack.Screen name="Init3" component={Init3Screen} />
  </InitStack.Navigator>
);

const Tab = createBottomTabNavigator();
const tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if(focused) {
          color = PURPLE;
        } else {
          size -= 2;
        }
        if (route.name === 'Home') {
          iconName = HOME;
          return <Icon name={iconName} size={size} color={color} />;
        } else if (route.name === 'Journal') {
          iconName = JOURNAL;
          return <Icon name={iconName} size={size} color={color} />;
        }
      },
    })}
    tabBarOptions={{
      activeTintColor: PURPLE,
      inactiveTintColor: 'gray'
    }}
  >
    <Tab.Screen name="Journal" component={JournalScreen} />
    <Tab.Screen name="Home" component={Home} />
  </Tab.Navigator>
);

const Stack = createStackNavigator();

class App extends Component {
  componentDidMount() {
    this.props.onAutoSignin();
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode='none' >
          {this.props.stacks.loading ? <Stack.Screen name="Loading" component={LoadingScreen} /> : null}
          {this.props.stacks.auth ? <Stack.Screen name="Auth" component={authStack} /> : null}
          {this.props.stacks.welcome2 ? <InitStack.Screen name="Welcome2" component={Welcome2Screen} /> : null}
          {this.props.stacks.init ? <Stack.Screen name="Init" component={initStack} /> : null}
          {this.props.stacks.tabs ? <Stack.Screen name="Tabs" component={tabs} /> : null }
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
} 

const mapStateToProps = state => {
  return {
    auth: state.auth,
    stacks: state.switchNavigator
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onAutoSignin: () => dispatch(autoSignin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);