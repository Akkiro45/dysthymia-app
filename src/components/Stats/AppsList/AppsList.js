import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;

import Text from '../../UI/Text/Text';
import { PURPLE, YELLOW_CHART, GREEN_CHART, BLUE_CHART, RED_CHART } from '../../../util/color';
import { minToTimePerfect } from '../../../util/util';

const COLORS = [YELLOW_CHART, GREEN_CHART, BLUE_CHART, RED_CHART];

class AppsList extends Component {
  state = {
    appIcons: null,
    error: null
  }
  componentDidMount() {
    if(this.props.appUsage) {
      if(this.props.appUsage.isNotAvialbale) {
        this.setState({ error: 'No App Icons Found!' });
      } else {
        this.getIcons(this.props.appUsage);
      }
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ appIcons: null, error: null });
    this.getIcons(nextProps.appUsage);
  }
  fethIcons = (appIconsNames) => {
    return new Promise((resolve, reject) => {
      try {
        UsageStats.getAppsIcon(appIconsNames.toString(), (appIcons) => {
          if(appIcons) {
            resolve(appIcons);
          } else {
            reject('No App Icons Found!');
          }
        });
      } catch(e) {
        reject('No App Icons Found!');
      }
    });
  }
  getIcons = (appUsage) => {
    let appIconsNames = Object.keys(appUsage.stats);
    this.fethIcons(appIconsNames)
      .then((appIcons) => {
        this.setState({ appIcons });
      })
      .catch(e => {
        this.setState({ error: e });
      });
  }
  render() {
    let ren = null;
    if(this.state.appIcons) {
      ren = Object.keys(this.props.appUsage.stats).map((appName, i) => {
        return (
          <View style={[style.item, i < 4 ? { borderBottomColor: COLORS[i] } : null]} key={appName + i} >
            <View style={style.appInfo} >
              <View style={style.icon} >
                <Image 
                  source={{ uri: `data:image/png;base64,${this.state.appIcons[appName]}` }} 
                  style={{ height: 30, width: 30 }} />
              </View>
              <View style={style.name} >
                <Text text={appName} type='h6' style={{ textAlign: 'left', fontSize: 16 }} numberOfLines={1} />
              </View>
            </View>
            <View style={style.time} >
              <Text text={minToTimePerfect(this.props.appUsage.stats[appName])} type='h6' style={{ textAlign: 'right', fontSize: 16 }} numberOfLines={1} />
            </View>
          </View>
        );
      });
    } else {
      ren = (
        <View style={{ marginVertical: 40 }} >
          <ActivityIndicator size="large" color={PURPLE} />
        </View>
      );
    }
    if(this.state.error) {
      ren = (
        <View style={{ width: '90%', alignSelf: 'center', marginTop: 40}} >
          <Text text='Sorry!' type='h4' style={{ color: PURPLE, marginVertical: 20 }} />
          <Text text='No App Icons Found!' type='h5' />
        </View>
      );
    }
    return ren;
  }
}

const style = StyleSheet.create({
  item: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignSelf: 'center',
    // backgroundColor: 'blue',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    borderRadius: 10,
    marginVertical: 5
  },
  appInfo: {
    height: '100%',
    width: '65%',
    flexDirection: 'row'
  },
  time: {
    width: "35%",
    height: '100%',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 5,
    marginVertical: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    height: '100%',
    marginLeft: 5,
    justifyContent: 'center'
  }
});

export default AppsList;