import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Image } from 'react-native';
import Emoji from 'react-native-emoji';
import moment from 'moment';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;

import getCallLogsStats from '../../services/CallLogs';
import getUsageStats from '../../services/UsageStats';

import Text from '../../components/UI/Text/Text';
import { capitalize, getDateFormate1, tranformTime, minToTime, calcCalories, calcDistance } from '../../util/util';
import { PURPLE } from '../../util/color';

import Activity from '../../components/Journal/Activity/Activity';
import Card from '../../components/Journal/Card/Card';
import Workout from '../../components/Journal/Workout/Workout';

class Journal extends Component {
  state = {
    refreshing: false,
    calls: null,
    unlocks: null,
    notifications: null,
    steps: null,
    screenOnTime: null,
    screenOnTimeType: '',
    appUsage: null,
    appIcon: null,
    activities: null
  }
  componentDidMount() {
    this.getStats();
    // this.props.navigation.popToTop();
  }
  onRefresh = () => {
    this.getStats();
  }
  getIcon = (appName) => {
    const arr = [appName];
    try {
      UsageStats.getAppsIcon(arr.toString(), (data) => {
        this.setState({ appIcon: data[appName] });
      });
    } catch(e) {
      this.setState({ appIcon: null });
      console.log(e);
    }
  }
  getStats = () => {
    const currTime = new Date().getTime();
    const usageStats = getUsageStats(parseInt(moment(currTime).startOf('day').format('x')), currTime);
    const callLogs = getCallLogsStats(currTime);
    const receiver = AsyncStorage.getItem('receiver');    
    Promise.all([receiver, usageStats, callLogs])
      .then(res => {
        let calls = 0;
        let unlocks = 0;
        let notifications = 0;
        let steps = 0;
        let screenOnTime = 0;
        let screenOnTimeType = '';
        let appUsage = null;
        let appIcon = null;
        let activities = null;
        if(res) {
          try {
            const receiver = JSON.parse(res[0]);

            if(receiver) {
              if(receiver.unlocks.length > 0) {
                unlocks = receiver.unlocks[receiver.unlocks.length - 1].count;
              }
              if(receiver.notifications.length > 0) {
                notifications = receiver.notifications[receiver.notifications.length - 1].count;
              }
              if(receiver.stepCounter.length > 0) {
                steps = receiver.stepCounter[receiver.stepCounter.length - 1].steps;
              }
              if(receiver.screenOnTime.length > 0) {
                const t = tranformTime(receiver.screenOnTime[receiver.screenOnTime.length - 1].time);
                screenOnTimeType = t.type;
                screenOnTime = t.time;
              }
              if(receiver.activities.length > 0) {
                const curr = new Date().getTime();
                const prev = curr - 3600000;
                activities = {};
                let type;
                for(let i=receiver.activities.length-1; i>=0; i--) {
                  if(receiver.activities[i].time <= curr && receiver.activities[i].time >= prev) {
                    type = receiver.activities[i].type;
                    if(activities[type]) {
                      activities[type] += 1;
                    } else {
                      activities[type] = 1;
                    }
                  } 
                }
              }
            }

            
            if(res[1]) {
              let name = null;
              let time = 0;
              Object.keys(res[1]).forEach(key => {
                if(res[1][key] >= time) {
                  name = key;
                  time = res[1][key];
                }
              });
              appUsage = minToTime(time);
              this.getIcon(name);
              // appIcon = res[3][name];
            }

            if(res[2]) {
              calls = res[2].incoming + res[2].outgoing;
            }
            
            
            this.setState({ activities, calls, unlocks, notifications, steps, screenOnTime, screenOnTimeType, appIcon, appUsage });
          } catch(e) {
            // setState
            this.setState({ activities, calls, unlocks, notifications, steps, screenOnTime, screenOnTimeType, appIcon, appUsage });
            console.log(e);
          }
        } else {
          this.setState({ activities, calls, unlocks, notifications, steps, screenOnTime, screenOnTimeType, appIcon, appUsage });
          // setState
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: '#fff' }} 
        refreshControl={
          <RefreshControl 
            refreshing={this.state.refreshing} 
            onRefresh={this.onRefresh} 
            colors={[PURPLE]} />
        }
      >
        <View style={style.header} >
          <View style={style.status} >
            <Text 
              text={'Hi, ' + capitalize(this.props.profile.userName) + '!'} 
              type='h3'
              style={{ textAlign: 'left', fontFamily: 'Rubik-Medium', marginBottom: 5 }}
              numberOfLines={1}
            />
            <Text 
              text={getDateFormate1(new Date())} 
              type='h5'
              style={{ textAlign: 'left', fontFamily: 'Rubik-Light', fontSize: 18 }}
              numberOfLines={1}
            />
          </View>
          <View style={style.icon} >
            <Emoji name={this.props.profile.profile.profileEmoji} style={{fontSize: 50}} />
          </View>
        </View>

        <Activity activities={this.state.activities} />

        <View style={style.cards} >
          <Card data={this.state.appIcon !== null ? true : false} left title='App Usage' label={this.state.appUsage} >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
              {this.state.appIcon ? (
                <Image source={{ uri: `data:image/png;base64,${this.state.appIcon}` }} style={{ height: 50, width: 50 }} />
              ) : null}
            </View>
          </Card>
          <Card data={this.state.unlocks !== null ? true : false} title='Unlock Counter' label='Unlocks'>
            <View style={style.value} >
              <Text text={this.state.unlocks} type='h1' numberOfLines={1} />
            </View>
          </Card>
        </View>
        <View style={style.cards} >
          <Card data={this.state.notifications !== null ? true : false} left title='Notification Counter' label='Notifications'>
            <View style={style.value} >
              <Text text={this.state.notifications} type='h1' numberOfLines={1} />
            </View>
          </Card>
          <Card data={this.state.calls !== null ? true : false} title='Call Logs' label='Calls'>
            <View style={style.value} >
              <Text text={this.state.calls} type='h1' numberOfLines={1} />
            </View>
          </Card>
        </View>
        <View style={style.cards} >
          <Card data={this.state.steps !== null ? true : false} left title='Step Counter' label='Steps'>
            <View style={style.value} >
              <Text text={this.state.steps} type='h1' numberOfLines={1} />
            </View>
          </Card>
          <Card data={this.state.screenOnTime !== null ? true : false} title='Screen On Time' label={this.state.screenOnTimeType}>
            <View style={style.value} >
              <Text text={this.state.screenOnTime} type='h1' numberOfLines={1} />
            </View>
          </Card>
        </View>
        <Workout data={this.state.steps !== null ? true : false} 
          cal={calcCalories(this.state.steps, this.props.profile.profile.weight, this.props.profile.profile.height)} 
          km={calcDistance(this.state.steps, this.props.profile.profile.height)} 
        />
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  header: {
    // backgroundColor: 'blue',
    width: '90%',
    height: 110,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  status: {
    // backgroundColor: 'red',
    width: '73%',
    height: '100%',
    justifyContent: 'center'
  },
  icon: {
    // backgroundColor: 'yellow',
    height: '100%',
    width: '27%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cards: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row'
  },
  value: {
    // backgroundColor: 'green',
    flex: 1,
    justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  return {
    profile: state.auth.data
  }
}

export default connect(mapStateToProps, null)(Journal);