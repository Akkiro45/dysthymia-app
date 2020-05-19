import React, { Component } from 'react';
import { View, StyleSheet, TouchableNativeFeedback, Image } from 'react-native';
import { connect } from 'react-redux';

import { PURPLE, LIGHT_PURPLE, GRAY2 } from '../../util/color';
import Button from '../../components/UI/RoundedButton/RoundedButton';
import Text from '../../components/UI/Text/Text';
import Male from '../../assets/Images/Male.png';
import Female from '../../assets/Images/Female.png';
import ErrorBox from '../../components/UI/ErrorBox/ErrorBox';
import { setError, resetError } from '../../store/actions/index';

class Init1 extends Component {
  state = {
    gender: null
  }
  componentDidMount() {
    if(this.props.route.params.redirect) {
      this.props.navigation.navigate('Init4', { data: {} });
    }
  }
  onPressCard = (gender) => {
    this.setState({ gender });
  }
  onContinue = () => {
    if(this.state.gender) {
      this.props.navigation.navigate('Init2', { gender: this.state.gender });
    } else {
      this.props.onSetError('Please select gender!');
    }
  }
  render() {
    return (
      <View style={style.container} >
        <ErrorBox 
          visible={this.props.error ? true : false}
          message={this.props.error}
          onTouchOutside={this.props.onResetError}
        />
        <View style={style.header}>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={style.box} ></View>
          <View style={style.box} ></View>
          <View style={style.box} ></View>
        </View>
        <View style={style.body}>
          <Text text='Which one are you?' type='h3' style={{ fontFamily: 'Rubik-Medium' }} />
          <View style={style.cardContainer} >
            <View style={[style.card, this.state.gender === 'male' ? style.activeCard : null]} >
              <TouchableNativeFeedback onPress={() => this.onPressCard('male')} >
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} >
                  <Image 
                    source={Male}
                    style={{ height: '80%', width: '80%', marginBottom: 5 }}
                  />
                  <Text text='Male' type='h6' style={{ fontFamily: 'Rubik-Medium' }} />
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={[style.card, this.state.gender === 'female' ? style.activeCard : null]} >
              <TouchableNativeFeedback onPress={() => this.onPressCard('female')} >
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} >
                  <Image 
                    source={Female}
                    style={{ height: '80%', width: '80%', marginBottom: 5 }}
                  />
                  <Text text='Female' type='h6' style={{ fontFamily: 'Rubik-Medium' }} />
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <Text text='To give a better experience we need to know your gender.' type='h6' style={{ fontFamily: 'Rubik-Light' }} />
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
    width: '90%',
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
  },
  cardContainer: {
    // backgroundColor: 'yellow',
    height: 150,
    width: '100%',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  card: {
    backgroundColor: '#fff',
    width: 120,
    height: 140,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: GRAY2,
    borderRadius: 15,
    elevation: 10,
    overflow: 'hidden',
  },
  activeCard: {
    borderColor: PURPLE
  }
});

const mapStateToProps = state => {
  return {
    error: state.error.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetError: (error) => dispatch(setError(error)),
    onResetError: () => dispatch(resetError())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Init1);