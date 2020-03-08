import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Spinner from '../../components/UI/Spinner/Spinner';
import Text from '../../components/UI/Text/Text';
import { switchOp } from '../../store/actions/index';

class Loading extends Component {

  componentDidMount() {
    setTimeout(() => {
      this.moveScreen(this.props.auth);
    }, 2000);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.moveScreen(nextProps.auth);
  }

  moveScreen = (auth) => {
    if(auth) {
      if(auth.token) {
        if(auth.data.profile) {
          if(auth.data.profile.profileEmoji) {
            this.props.navigation.navigate('Tabs');
          } else {
            this.props.navigation.navigate('Init');
          }
        } else {
          this.props.navigation.navigate('Init');
        }
      } else {
        this.props.navigation.navigate('Auth');
      }
      this.props.onSwitchOp('loading', false);
    } 
  }

  render() {
    return (
      <View style={style.container} >
        <View style={style.title} >
          <Text 
            text='Dysthymia'
            type='h1'
            style={{ fontFamily: 'Rubik-Bold' }}
          />
        </View>
        <View style={style.tagLine} >
          <Text 
            text='Make your life better!'
            type='h5'
            style={{ fontFamily: 'Rubik-Light' }}
          />
        </View>
        <Spinner
          isVisible={true} 
          size={150}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  title: {
    marginTop: '50%',
    marginBottom: '3%'
  },
  tagLine: {
    marginBottom: '15%'
  }
});

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSwitchOp: (stackName, value) => dispatch(switchOp(stackName, value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);