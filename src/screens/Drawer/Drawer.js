import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/dist/Feather';

import Heartbeat from '../../../Heartbeat';
import Text from '../../components/UI/Text/Text';
import { GRAY2 } from '../../util/color';
import { LOGOUT } from '../../util/icons';
import { onSignout } from '../../store/actions/index';

class Drawer extends Component {
  render() {
    return (
      <DrawerContentScrollView>
        <View style={style.header} >
          <Text text='Settings' type='h5' />
        </View>
        <View style={style.divider} ></View>
        <DrawerItem
          label='Start Service'
          onPress={() => {
            Heartbeat.startService();
          }}
        />
        <DrawerItem
          label='Stop Service'
          onPress={() => {
            Heartbeat.stopService();
          }}
        />
        <View style={style.divider} ></View>
          <DrawerItem
            label='Old Version'
            onPress={() => {
              this.props.navigation.navigate('Home');
            }}
          />
        <View style={style.divider} ></View>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon
              name={LOGOUT}
              color={color}
              size={size}
            />
          )}
          label='Logout'
          onPress={() => {
            Heartbeat.stopService();
            this.props.onSignout(this.props.token);
          }}
        />
      </DrawerContentScrollView>
    );
  }
}

const style = StyleSheet.create({
  header: {
    marginVertical: 20
  },
  divider: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: GRAY2
  }
});

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignout: (token) => dispatch(onSignout(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);