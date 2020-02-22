import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

import Heartbeat from '../../../Heartbeat';
import Box from './Box/Box';
import { getColor, colors } from '../../util/color';
import { miliToMin } from '../../util/util';
import Button from '../UI/Button/Button';
import { signout } from '../../store/actions/index';
import ClickedNotificationStats from '../ClickedNotificationStats/ClickedNotificationStats';

class Home extends Component {
  state = {
    refreshing: false,
    unlockCount: 0,
    screenOnTime: 0,
    notificationCount: 0,
    clickedNotificationCount: 0,
    currActivity: 'NONE',
    headsetPlug: 0,
    steps: 0,
    light: 0
  }

  componentDidMount() {
    this.getData();
  }

  onRefresh = () => {
    this.getData();
  }

  onSignoutHandler = () => {
    AsyncStorage.removeItem('auth')
      .then(() => {
        this.props.onSignout();
        this.props.onChangeState('authenticate');
      });
  }

  getData = () => {
    AsyncStorage.getItem('receiver')
      .then(receiver => {
        receiver = JSON.parse(receiver);
        if(receiver) {
          let unlockCount = 0;
          let screenOnTime = 0;
          let notificationCount = 0;
          let clickedNotificationCount = 0;
          let currActivity = 'NONE';
          let headsetPlug = 0;
          let steps = 0;
          let light = 0;
          if(receiver.unlocks.length > 0) {
            unlockCount = receiver.unlocks[receiver.unlocks.length - 1].count;
          }
          if(receiver.unlocks.length > 0) {
            steps = receiver.stepCounter[receiver.stepCounter.length - 1].steps;
          }
          if(receiver.screenOnTime.length > 0) {
            screenOnTime = miliToMin(receiver.screenOnTime[receiver.screenOnTime.length - 1].time);
          }
          if(receiver.notifications.length > 0) {
            notificationCount = receiver.notifications[receiver.notifications.length - 1].count;
            clickedNotificationCount = receiver.notifications[receiver.notifications.length - 1].clickedCount;
          }
          if(receiver.activities.length > 0) {
            currActivity = receiver.activities[receiver.activities.length - 1].type;
          }
          if(receiver.lightSensor.length > 0) {
            light = receiver.lightSensor[receiver.lightSensor.length - 1].light;
          }
          if(receiver.headsetPlug.length > 0) {
            headsetPlug = receiver.headsetPlug[receiver.headsetPlug.length - 1].count;
          }
          this.setState({ unlockCount, light, steps, headsetPlug, screenOnTime, notificationCount, clickedNotificationCount, currActivity });
        }
      });
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: '#000'  }}
        refreshControl={
          <RefreshControl 
            refreshing={this.state.refreshing} 
            onRefresh={this.onRefresh} 
            colors={colors} />
        }>
        <Text style={style.title} >Dysthymia</Text>
        <View style={style.buttonContainer} >
          <View style={style.button} >
            <Button onPress={() => Heartbeat.startService()} title='Start Service' />
          </View>
          <View style={style.button} >
            <Button onPress={() => Heartbeat.stopService()} title='Stop Service' />
          </View>
        </View>
        <View style={style.buttonContainer} >
          <View style={style.button} >
            <Button onPress={this.onSignoutHandler} title='Logout' />
          </View>
        </View>
        <Box 
          borderColor={getColor()}
          title='Activity'
          value={this.state.currActivity}
        />
        <Box 
          borderColor={getColor()}
          title='Light Sensor'
          value={Math.trunc(this.state.light)}
        />
        <Box 
          borderColor={getColor()}
          title='Steps Counter'
          value={this.state.steps}
        />
        <Box 
          borderColor={getColor()}
          title='Call Logs'
          value='Click Me'
          clickable
          onPress={() => this.props.onChangeState('callLogs')}
        />
        <Box 
          borderColor={getColor()}
          title='Usage Stats'
          value='Click Me'
          clickable
          onPress={() => this.props.onChangeState('usageStats')}
        />
        <Box 
          borderColor={getColor()}
          title='Notifications'
          value={this.state.notificationCount}
          clickable
          onPress={() => this.props.onChangeState('notificationStats')}
        />
        <Box 
          borderColor={getColor()}
          title='Clicked Notifications'
          value={this.state.clickedNotificationCount}
          clickable
          onPress={() => this.props.onChangeState('clickedNotificationStats')}
        />
        <Box 
          borderColor={getColor()}
          title='Screen On Time'
          value={this.state.screenOnTime}
        />
        <Box 
          borderColor={getColor()}
          title='Unlock Counter'
          value={this.state.unlockCount}
        />
        <Box 
          borderColor={getColor()}
          title='Headset Plug'
          value={this.state.headsetPlug}
        />
        
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 15
  },
  buttonContainer: {
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button: {
    width: 110,
    height: 40,
    marginHorizontal: 5
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onSignout: () => dispatch(signout())
  }
}

export default connect(null, mapDispatchToProps)(Home);