import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, TouchableNativeFeedback, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux';
import Emoji from 'react-native-emoji';
import Icon from 'react-native-vector-icons/dist/Feather';

import Text from '../../components/UI/Text/Text';
import { BLUE, GRAY2 } from '../../util/color';
import Spinner from '../../components/UI/Spinner/Spinner';
import { SETTING, RIGHT_ARROW } from '../../util/icons';
import Wave from '../../assets/Images/Profile-Wave.png';

// import TestComp from '../../components/TestComp/TestComp';

class Profile extends Component {

  getHeightString = (height) => {
    height = height.toString();
    return (height.charAt(0) + 'ft ' + height.slice(2) + 'in' );
  }
  getDateString = (dob) => {
    let day = dob.day;
    let month = dob.month;
    if(dob.day < 10) {
      day = '0' + dob.day;
    }
    if(dob.month < 10) {
      month = '0' + dob.month;
    }
    return (day + '-' + month + '-' + dob.year);
  }
  render() {
    let content = null;
    if(this.props.profile) {
      content = (
        <ScrollView style={{ backgroundColor: '#fff' }} >
          <View style={style.headerShape} >
            <Image source={Wave} />
          </View>
          <View style={style.emoji} >
            <Emoji name={this.props.profile.profile.profileEmoji} style={{fontSize: 75}} />
          </View>
          <Text text={this.props.profile.userName} type='h3' style={{ color: BLUE, fontFamily: 'Rubik-Medium' }} numberOfLines={1} />
          <View style={style.title} >
            <View style={style.sub} >
              <View style={style.divider} ></View>
            </View>
            <View style={[style.sub, { width: '40%', marginHorizontal: '1%' }]} >
              <Text text='Personal Details' type='h6' style={{ color: BLUE }} />
            </View>
            <View style={style.sub} >
              <View style={style.divider} ></View>
            </View>
          </View>
          <View style={{ width: '90%', alignSelf: 'center', marginBottom: 35 }} >
            <Text text='Date of Birth' type='h6' style={{ color: BLUE, textAlign: 'left' }} />
            <Text text={this.getDateString(this.props.profile.profile.dob)} type='h5' style={{ textAlign: 'left', marginVertical: 5 }} numberOfLines={1} />
            <View style={style.divider} ></View>
          </View>
          <View style={{ width: '90%', alignSelf: 'center', marginBottom: 35, flexDirection: 'row' }} >
            <View style={{ width: '45%', marginRight: '10%' }} >
              <Text text='Weight' type='h6' style={{ color: BLUE, textAlign: 'left' }} numberOfLines={1} />
              <Text text={this.props.profile.profile.weight + 'kg'} type='h5' style={{ textAlign: 'left', marginVertical: 5 }} numberOfLines={1} />
              <View style={style.divider} ></View>
            </View>
            <View style={{ width: '45%' }} >
              <Text text='Height' type='h6' style={{ color: BLUE, textAlign: 'left' }} numberOfLines={1} />
              <Text text={this.getHeightString(this.props.profile.profile.height)} type='h5' style={{ textAlign: 'left', marginVertical: 5 }} numberOfLines={1} />
              <View style={style.divider} ></View>
            </View>
          </View>
          <View style={{ width: '90%', alignSelf: 'center', marginBottom: 35 }} >
            <Text text="Parents's/Guardian's Email Id" type='h6' style={{ color: BLUE, textAlign: 'left' }} />
            <Text text={this.props.profile.profile.emailIds[0]} type='h5' style={{ textAlign: 'left', marginVertical: 5 }} numberOfLines={1} />
            <View style={style.divider} ></View>
          </View>
          <TouchableNativeFeedback onPress={this.props.navigation.openDrawer} >
            <View style={style.settingButton} >
              <View style={style.icon} >
                <Icon name={SETTING} size={25} color={'#000'} />
              </View>
              <View style={[style.icon, { width: '60%', alignItems: 'flex-start' }]} >
                <Text text='Settings' type='h5' style={{ textAlign: 'left' }} numberOfLines={1} />
              </View>
              <View style={style.icon} >
                <Icon name={RIGHT_ARROW} size={25} color={'#000'} />
              </View>
            </View>
          </TouchableNativeFeedback>
          {/* <TestComp /> */}
        </ScrollView>
      );
    } else {
      content = (
        <View style={style.spinner} >
          <Spinner
            isVisible={true} 
            size={150}
          />
        </View>
      );
    }
    return content;
  }
}

const style = StyleSheet.create({
  headerShape: {
    width: '100%',
    height: 180,
    // backgroundColor: BLUE,
    zIndex: 0,
    marginBottom: 60
  },
  emoji: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    zIndex: 10,
    position: 'absolute',
    top: 120,
    left: (Dimensions.get('screen').width / 2) - 60,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: BLUE
  },
  title: {
    marginVertical: 35,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center'
  },
  divider: {
    borderTopWidth: 1,
    borderColor: GRAY2,
    height: 0
  },
  sub: {
    width: '29%',
    justifyContent: 'center'
  },
  spinner: {
    marginVertical: Dimensions.get('screen').height / 3
  },
  settingButton: {
    width: '90%',
    height: 45,
    elevation: 2,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginBottom: 40,
    borderRadius: 2,
    flexDirection: 'row'
  },
  icon: {
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => {
  return {
    profile: state.auth.data
  }
}

export default connect(mapStateToProps, null)(Profile);