import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import Home from './src/components/Home/Home';
import UsageStats from './src/components/UsageStats/UsageStats';
import NotificationStats from './src/components/NotificationStats/NotificationStats';
import CallLogs from './src/components/CallLogs/CallLogs';
import store from './src/store/configStore';
import Authenticate from './src/components/Authenticate/Authenticate';
import ClickedNotificationStats from './src/components/ClickedNotificationStats/ClickedNotificationStats';

class App extends Component {
  state = {
    curr: 'authenticate'
  }
  onChangeState = (state) => {
    this.setState({ curr: state });
  }
  render() {
    let ren = null;
    if(this.state.curr === 'home') {
      ren = (
        <Home onChangeState={this.onChangeState} />
      );
    } else if(this.state.curr === 'usageStats') {
      ren = (
        <UsageStats onChangeState={this.onChangeState} />
      );
    } else if(this.state.curr === 'notificationStats') {
      ren = (
        <NotificationStats onChangeState={this.onChangeState} />
      );
    } else if(this.state.curr === 'clickedNotificationStats') {
      ren = (
        <ClickedNotificationStats onChangeState={this.onChangeState} />
      );
    } else if(this.state.curr === 'callLogs') {
      ren = (
        <CallLogs onChangeState={this.onChangeState} />
      );
    } else if(this.state.curr === 'authenticate') {
      ren = (
        <Authenticate onChangeState={this.onChangeState} />
      );
    }
    return (
      <Provider store={store()} >
        <View style={{ flex: 1 }} >
          <StatusBar 
            backgroundColor='#000' 
            barStyle='light-content'
          />
          {ren}
        </View>
      </Provider>
    );
  }
}

export default App;

