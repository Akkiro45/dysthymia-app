import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, BackHandler, RefreshControl } from 'react-native';

import ListItem from '../UI/ListItem/ListItem';
import getUsageStats from '../../services/UsageStats';
import { colors } from '../../util/color';
 
class UsageStats extends Component {
  state = {
    usageStats: null
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
    getUsageStats()
      .then(usageStats => {
        this.setState({ usageStats });
      });
  }
  render() {
    let list = null;
    if(this.state.usageStats) {
      list = Object.keys(this.state.usageStats).map(key => {
        return (
          <ListItem key={key} name={key} value={this.state.usageStats[key]} />
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
        <Text style={style.title} >Usage Stats</Text>
        <ListItem name='App name' value='Miniute' underline />
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

export default UsageStats;