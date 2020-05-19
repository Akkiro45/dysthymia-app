import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';

import { PURPLE, LIGHT_PURPLE, BLUE } from '../../util/color';
import Button from '../../components/UI/RoundedButton/RoundedButton';
import Text from '../../components/UI/Text/Text';
import { FEEDBACK } from '../../util/icons';
import { validateEmail } from '../../util/util'; 
import { resetError, setError, postProfile } from '../../store/actions/index';
import ErrorBox from '../../components/UI/ErrorBox/ErrorBox';
import ProgressBox from '../../components/UI/ProgressBox/ProgressBox';

class Init4 extends Component {
  state = {
    email: '',
    error: null
  }
  onContinue = () => {
    if(validateEmail(this.state.email)) {
      let { data } = this.props.route.params;
      if(Object.keys(data).length === 0) {
        data = { ...this.props.profile.profile };
      }
      data.emailIds = [this.state.email];
      this.props.onPostProfile(data, this.props.token, this.props.navigation);
    } else {
      this.setState({ error: 'Invalid email id!' });
    }
  }
  onChangeText = (value) => {
    this.setState({ email: value, error: null });
  }
  render() {
    return (
      <View style={style.container} >
        <ProgressBox 
          visible={this.props.loading !== null ? this.props.loading : false}
          title="Creating your profile"
          message="Please, wait..."
        />
        <ErrorBox 
          visible={this.props.error ? true : false}
          message={this.props.error}
          onTouchOutside={this.props.onResetError}
        />
        <View style={style.header}>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
        </View>
        <View style={style.body}>
          <Icon name={FEEDBACK} size={50} color={'#000'} />
          <Text text='Feedback' type='h3' style={{ marginVertical: 10, fontFamily: 'Rubik-Medium' }} />
          <TextField 
            label="Parents's/Guardian's Email ID"
            fontSize={18}
            // characterRestriction={100}
            lineWidth={1}
            textColor={'#000'}
            tintColor={BLUE}
            containerStyle={{ width: '80%', alignSelf: 'center', marginBottom: 30 }}
            onChangeText={(value) => this.onChangeText(value)}
            error={this.state.error}
            keyboardType='email-address'
          />
          <Text text='Providing this will help us give a detailed feedback.' type='h6' style={{ fontFamily: 'Rubik-Light', width: '60%' }} />
        </View>
        <View style={style.footer}>
          <View style={style.button} >
            <Button text='Continue' onPress={this.onContinue} />
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    // backgroundColor: 'yellow',
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    // backgroundColor: 'green',
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center'
  },
  footer: {
    // backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'center'
  },
  box: {
    backgroundColor: LIGHT_PURPLE,
    width: '20%',
    height: 12,
    marginHorizontal: 5
  },
  button: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginVertical: 15
  }
});

const mapStateToProps = state => {
  return {
    loading: state.loading.loading,
    error: state.error.error,
    token: state.auth.token,
    profile: state.auth.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onResetError: () => dispatch(resetError()),
    onSetError: (error) => dispatch(setError(error)),
    onPostProfile: (data, token, navigation) => dispatch(postProfile(data, token, navigation))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Init4);