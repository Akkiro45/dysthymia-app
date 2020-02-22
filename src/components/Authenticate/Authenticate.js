import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import Button from '../UI/Button/Button';
import { auth, resetError, authSuccess } from '../../store/actions/index';

class Authenticate extends Component {
  state = {
    userName: '',
    password: '',
    show: false
  }
  componentDidMount() {
    AsyncStorage.getItem('auth')
      .then(auth => {
        if(auth) {
          auth = JSON.parse(auth);
          if(auth.token) {
            this.props.onAuthSuccess(auth);
            this.props.onChangeState('home');
          } else {
            this.setState({ show: true });
          } 
        } else {
          this.setState({ show: true });
        }
      })
      .catch(() => {
        this.setState({ show: true });
      })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.token) {
      this.props.onChangeState('home');
    }
  }
  onSignupHandler = () => {
    this.props.onResetError();
    this.props.onAuth(this.state, false);
  }
  onSigninHandler = () => {
    this.props.onResetError();
    this.props.onAuth(this.state, true);
  }
  onChangeText = (type, text) => {
    this.setState({ [type]: text });
  }
  render(){
    let error = null;
    if(this.props.error) {
      error = (
        <Text style={style.text} >{this.props.error}</Text>
      );
    }
    let buttons = (
      <Text style={style.text} >Loading...</Text>
    );
    if(!this.props.loading) {
      buttons = (
        <View style={style.buttonContainer} >
          <View style={style.button} >
            <Button onPress={this.onSignupHandler} title='Signup' />
          </View>
          <View style={style.button} >
            <Button onPress={this.onSigninHandler} title='Signin' />
          </View>
        </View>
      );
    }
    let show = null;
    if(this.state.show) {
      show = (
        <View>
          <View style={{ marginVertical: 50 }} >
            <TextInput 
              placeholder='User name'
              style={style.textInput}
              maxLength={60}
              onChangeText={(text) => this.onChangeText('userName', text)}
              placeholderTextColor='#ccc'
              underlineColorAndroid='#ccc'
            />
            <TextInput 
              placeholder='Password'
              style={style.textInput}
              maxLength={60}
              secureTextEntry
              onChangeText={(text) => this.onChangeText('password', text)}
              placeholderTextColor='#ccc'
              underlineColorAndroid='#ccc'
            />
          </View>
          {buttons}
          {error}
        </View>
      );
    } else {
      show = (
        <Text style={[style.text, { marginVertical: 40 }]} >Loading...</Text>
      );
    }
    return (
      <View style={style.container} >
        <Text style={style.title} >Dysthymia</Text>
        {show}
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1
  },
  title: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 15
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 15
  },
  buttonContainer: {
    marginVertical: 40,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button: {
    width: 110,
    height: 40,
    marginHorizontal: 5
  },
  textInput: {
    width: '90%',
    alignSelf: 'center',
    height: 50,
    marginVertical: 20,
    color: '#ccc'
  }
});

const mapStateToProps = state => {
  return {
    loading: state.loading.loading,
    error: state.error.error,
    token: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (data, isSignin) => dispatch(auth(data, isSignin)),
    onResetError: () => dispatch(resetError()),
    onAuthSuccess: (data) => dispatch(authSuccess(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);