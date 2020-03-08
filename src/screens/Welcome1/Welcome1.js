import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';

import Text from '../../components/UI/Text/Text';
import { BLUE } from '../../util/color';
import Button from '../../components/UI/RoundedButton/RoundedButton';
import Logo from '../../components/UI/Logo/Logo';

const onSigninPress = (navigation) => {
  navigation.replace('Signin');
}

const onSignupPress = (navigation) => {
  navigation.replace('Signup');
}

const welcome1 = (props) => {
  return (
    <View style={style.container} >
      <View style={style.box} >
        <Text 
          text='Welcome to'
          type='h4'
        />
        <Text 
          text='Dysthymia'
          type='h1'
        />
      </View>
      <View style={style.center} >
        <Logo />
        <Text 
          text='Make your life better!'
          type='h5'
          style={{ fontFamily: 'Rubik-Light' }}
        />
      </View>
      <View style={style.box} >
        <View style={style.button} >
          <Button 
            text='Get Started'
            onPress={() => onSignupPress(props.navigation)}
          />
        </View>
        <Text 
          text='Already have an account?'
          type='h6'
        />
        <TouchableNativeFeedback onPress={() => onSigninPress(props.navigation)} >
          <View>
            <Text 
              text='Sign in'
              type='h6'
              style={{ color: BLUE, fontWeight: 'bold' }}
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  box: {
    // backgroundColor: 'red',
    flex: 3,
    alignContent: 'center',
    justifyContent: 'center'
  },
  center: {
    // backgroundColor: 'blue',
    flex: 6,
    alignContent: 'center',
    justifyContent: 'center'
  },
  button: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginVertical: 15
  }
});

export default welcome1;