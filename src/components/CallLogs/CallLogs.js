import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, BackHandler, RefreshControl } from 'react-native';

import Box from '../Home/Box/Box';
import { getColor, colors } from '../../util/color';
import { secToMin } from '../../util/util';
import getCallLogsStats from '../../services/CallLogs';

class CallLogs extends Component {
  state = {
    logStats: null,
    error: false
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
    getCallLogsStats(new Date().getTime())
      .then(stats => {
        if(stats) {
          this.setState({ logStats: stats });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(e => {
        this.setState({ error: true });
      });
  }
  render() {
    let ren = null;
    if(this.state.error) {
      ren = (
        <Text style={style.loading} >Call Log permission denied!</Text>
      );
    } else if(!this.state.logStats) {
      ren = (
        <Text style={style.loading} >Loading...</Text>
      );
    } else {
      ren = (
        <View>
          <Box 
            borderColor={getColor()}
            title='No. InComing'
            value={this.state.logStats.incoming}
          />
          <Box 
            borderColor={getColor()}
            title='No. Outgoing'
            value={this.state.logStats.outgoing}
          />
          <Box 
            borderColor={getColor()}
            title='No. Missed'
            value={this.state.logStats.missed}
          />
          <Box 
            borderColor={getColor()}
            title='Duration of Incoming'
            value={secToMin(this.state.logStats.incomingDuration)}
          />
          <Box 
            borderColor={getColor()}
            title='Duration of Outgoing'
            value={secToMin(this.state.logStats.outgoingDuration)}
          />
          <Box 
            borderColor={getColor()}
            title='No. Unique InComing'
            value={this.state.logStats.uniqueIncoming}
          />
          <Box 
            borderColor={getColor()}
            title='No. Unique Outgoing'
            value={this.state.logStats.uniqueOutgoing}
          />
          <Box 
            borderColor={getColor()}
            title='No. Unique Missed'
            value={this.state.logStats.uniqueMissed}
          />
        </View>
      );
    }
    return (
      <ScrollView style={{ backgroundColor: '#000'  }}
        refreshControl={
          <RefreshControl 
            refreshing={false} 
            onRefresh={this.getData} 
            colors={colors} />
        }
      >
        <Text style={style.title} >Call Logs</Text>
        {ren}
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

export default CallLogs;