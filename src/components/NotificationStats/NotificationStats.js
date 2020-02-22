import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, BackHandler, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import ListItem from '../UI/ListItem/ListItem';
import { sortObj } from '../../util/util';
import { colors } from '../../util/color';

class NotificationStats extends Component {
  state = {
    notificationStats: null
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.getData();
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  handleBackPress = () => {
    this.props.onChangeState('home');
    return true;
  }
  getData = () => {
    AsyncStorage.getItem('receiver')
      .then(receiver => {
        receiver = JSON.parse(receiver);
        if(receiver) {
          let notificationStats;
          if(receiver.notifications) {
            const len = receiver.notifications.length;
            if(!receiver.notifications[len - 1].apps) {
              notificationStats = { None: 'None' };
            } else {
              notificationStats = sortObj(receiver.notifications[len - 1].apps, 'desc');
            }
          } else {
            notificationStats = { None: 'None' };
          }          
          this.setState({ notificationStats });
        }
      })
      .catch(e => {
        this.setState({ notificationStats: { None: 'None' } });
      });
  }
  render() {
    let list = null;
    if(this.state.notificationStats) {
      list = Object.keys(this.state.notificationStats).map(key => {
        return (
          <ListItem key={key} name={key} value={this.state.notificationStats[key]} />
        );
      });
    } else {
      list = (
        <Text style={style.loading} >Loading...</Text>
      );
    }
    return (
      <ScrollView style={{ backgroundColor: '#000' }} 
        refreshControl={
          <RefreshControl 
            refreshing={false} 
            onRefresh={this.getData} 
            colors={colors} />
        }
      >
        <Text style={style.title} >Notification Stats</Text>
        <ListItem name='App name' value='Count' underline />
        {list}
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
  loading: {
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 30
  }
});

export default NotificationStats;