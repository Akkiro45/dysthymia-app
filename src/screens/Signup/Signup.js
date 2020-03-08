import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableNativeFeedback, KeyboardAvoidingView } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';

import WaveImg from '../../assets/Images/Wave.png'
import { BLUE } from '../../util/color';
import Text from '../../components/UI/Text/Text';
import Button from '../../components/UI/RoundedButton/RoundedButton';
import { resetError, auth } from '../../store/actions/index';
import { validateAuth } from '../../util/validation';
import ProgressBox from '../../components/UI/ProgressBox/ProgressBox';
import ErrorBox from '../../components/UI/ErrorBox/ErrorBox';

class Signup extends Component {
  state = {
    username: '',
    password: '',
    usernameError: null,
    passwordError: null
  }
  onChangeTextHandler = (field, value) => {
    const error = validateAuth(field, value);
    this.setState({ [field]: value, [error.type]: error.error });
  }
  onSigninPress = () => {
    this.props.navigation.replace('Signin');
  }
  onSignupPress = () => {
    if(validateAuth('username', this.state.username).error == null && validateAuth('password', this.state.password).error == null) {
      const data = {
        userName: this.state.username,
        password: this.state.password
      }
      this.props.onAuth(data, false, this.props.navigation);
    }
  }
  render() {
    return (
      <KeyboardAvoidingView style={style.container} behavior='height' >
        <ProgressBox 
          visible={this.props.loading !== null ? this.props.loading : false}
          title="Signing you up"
          message="Please, wait..."
        />
        <ErrorBox 
          visible={this.props.error ? true : false}
          message={this.props.error}
          onTouchOutside={this.props.onResetError}
        />
        <View style={style.header} >
          <Text 
            text='Welcome!'
            type='h3'
            style={{ color: BLUE, textAlign: 'left', fontFamily: 'Rubik-Medium' }}
          />
        </View>
        <View style={style.content} >
          <TextField 
            label='Username'
            fontSize={18}
            characterRestriction={20}
            lineWidth={1}
            textColor={'#000'}
            tintColor={BLUE}
            containerStyle={{ width: '80%', alignSelf: 'center' }}
            onChangeText={(value) => this.onChangeTextHandler('username', value)}
            error={this.state.usernameError}
          />
          <TextField 
            label='Password'
            secureTextEntry={true}
            fontSize={18}
            characterRestriction={60}
            lineWidth={1}
            textColor={'#000'}
            tintColor={BLUE}
            containerStyle={{ width: '80%', alignSelf: 'center' }}
            onChangeText={(value) => this.onChangeTextHandler('password', value)}
            error={this.state.passwordError}
          />
        </View>
        <View style={style.footer}>
          <View style={style.button} >
            <Button 
              text='SIGN UP'
              onPress={this.onSignupPress}
            />
          </View>
          <Text 
            text='Already have an account?'
            type='h6'
          />
          <TouchableNativeFeedback onPress={this.onSigninPress} >
            <View>
              <Text 
                text='Sign in'
                type='h6'
                style={{ color: BLUE, fontWeight: 'bold' }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={style.wave} >
          <Image source={WaveImg} resizeMode='cover' style={style.img} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    // backgroundColor: 'yellow',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1
  },
  content: {
    // backgroundColor: 'blue',
    justifyContent: 'center',
    flex: 3
  },
  footer: {
    // backgroundColor: 'green',
    flex: 2,
    zIndex: 10,
    justifyContent: 'center'
  },
  wave: {
    // backgroundColor: 'red', 
    width: '100%', 
    height: 83,
    flex: 1,
    zIndex: 0
  },
  button: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginVertical: 15
  },
  img: { 
    position: 'absolute', 
    bottom: -1 
  }
});

const mapStateToProps = state => {
  return {
    loading: state.loading.loading,
    error: state.error.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onResetError: () => dispatch(resetError()),
    onAuth: (data, isSignin, navigation) => dispatch(auth(data, isSignin, navigation))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);