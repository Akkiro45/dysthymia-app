import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { connect } from 'react-redux';

import BG from '../../assets/Images/BG.png';
import Text from '../../components/UI/Text/Text';
import Button from '../../components/UI/RoundedButton/RoundedButton';
import { PURPLE } from '../../util/color';
import Logo from '../../components/UI/Logo/Logo';
import { switchOp } from '../../store/actions/index';

class Welcome2 extends Component {
  render() {
    return (
      <ImageBackground source={BG} style={{width: '100%', height: '100%'}} >
        <View style={style.body} >
          <Logo style={{ backgroundColor: '#fff' }} />
          <Text text='You are ready to go!' type='h3' style={{ color: '#fff', marginVertical: 20 }}  />
          <Text text="Thanks for taking your time to create account with us. Let's Explore!" type='h6' style={{ color: '#fff' }} />
        </View>
        <View style={style.footer} >
          <View style={style.button} >
            <Button text='Get Started' 
              style={{ backgroundColor: '#fff' }} 
              textStyle={{ color: PURPLE }} 
              onPress={() => {
                this.props.navigation.navigate('Tabs');
                this.props.onSwitchOp('welcome2', false);
              }}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  body: {
    // backgroundColor: 'green',
    width: '90%',
    height: '82%',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  footer: {
    // backgroundColor: 'yellow',
    width: '100%',
    height: '18%',
    justifyContent: 'center'
  },
  button: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginVertical: 15
  },
});

const mapDispatchToProps = dispatch => {
  return {
    onSwitchOp: (stackName, value) => dispatch(switchOp(stackName, value)) 
  }
}

export default connect(null, mapDispatchToProps)(Welcome2);