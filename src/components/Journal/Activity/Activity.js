import React, { Component } from 'react';
import { View, StyleSheet, TouchableNativeFeedback, ActivityIndicator } from 'react-native';
import Pie from 'react-native-pie';
import moment from 'moment';

import Text from '../../UI/Text/Text';
import { BLUE, PURPLE, BLUE_CHART, GREEN_CHART, PURPLE_CHART, RED_CHART, YELLOW_CHART, GRAY1 } from '../../../util/color';
import { capitalize } from '../../../util/util';

class Activity extends Component {
  getPercentage = (type, total, activities) => {
    if(total === 0) {
      if(type === 'UNKNOWN') return 100;
      else return 0;
    }
    if(activities[type]) {
      return ((activities[type] * 100) / total);
    } else {
      return 0;
    }
  }
  render() {
    let labels = [];
    const currTime = new Date().getTime();
    const time =  moment(currTime - 3600000).format('h.mma') + ' - ' + moment(currTime).format('h.mma');
    let total = 0;
    let activities = {};
    const chartColors = {
      IN_VEHICLE: PURPLE_CHART,
      STILL: GREEN_CHART,
      TILTING: YELLOW_CHART,
      UNKNOWN: GRAY1,
      WALKING: BLUE_CHART,
      RUNNING: RED_CHART
    }
    if(this.props.activities) {
      Object.keys(this.props.activities).forEach(e => {
        if(e === 'IN_VEHICLE' || e === 'STILL' || e === 'TILTING' || e === 'UNKNOWN' || e === 'WALKING' || e === 'RUNNING') {
          total += this.props.activities[e];
          activities[e] = this.props.activities[e];
          labels.push(
            (
              <View style={style.pair} key={e} >
                <View style={[style.dot, { backgroundColor: chartColors[e] }]} ></View>
                <Text text={capitalize(e)} type='h6' numberOfLines={1} style={style.label} />
              </View>
            )
          );
        }
      });
    }
    
    
    let contents = null;
    if(activities) {
      contents = (
        <View style={{ flexDirection: 'row' }} >
          <View style={style.chart}>
            <Pie
              radius={80}
              innerRadius={65}
              sections={[
                {
                  percentage: this.getPercentage('WALKING', total, activities),
                  color: BLUE_CHART,
                },
                {
                  percentage: this.getPercentage('STILL', total, activities),
                  color: GREEN_CHART,
                },
                {
                  percentage: this.getPercentage('RUNNING', total, activities),
                  color: RED_CHART,
                },
                {
                  percentage: this.getPercentage('IN_VEHICLE', total, activities),
                  color: PURPLE_CHART,
                },
                {
                  percentage: this.getPercentage('TILTING', total, activities),
                  color: YELLOW_CHART,
                },
                {
                  percentage: this.getPercentage('UNKNOWN', total, activities),
                  color: GRAY1,
                },
              ]}
              dividerSize={0}
              strokeCap={'butt'}
            />
          </View>
          <View style={style.info}>
            {labels}
          </View>
        </View>
      );
    } else {
      contents = (
        <View style={{ flex: 1, justifyContent: 'center' }} >
          <ActivityIndicator size="large" color={PURPLE} />
        </View>
      );
    }
    return (
      <View style={style.container} >
        <TouchableNativeFeedback>
          <View style={{ flex: 1 }} >
            <View style={style.header}>
              <Text text='Activity' type='h5' style={{ color: BLUE, fontFamily: 'Rubik-Medium' }} />
            </View>
            <View style={style.time} >
              <Text text={time} type='h6' numberOfLines={1} />
            </View>
            {contents}
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    width: '90%',
    height: 250,
    backgroundColor: '#fff',
    elevation: 15,
    alignSelf: 'center',
    marginVertical: 25,
    borderRadius: 15,
    overflow: 'hidden'
  },
  header: {
    // backgroundColor: 'yellow',
    width: '100%',
    height: 40,
    justifyContent: 'center'
  },
  time: {
    // backgroundColor: 'blue',
    height: 30,
    width: '100%',
    justifyContent: 'center'
  },
  chart: {
    // backgroundColor: 'red',
    width: '60%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    // backgroundColor: 'blue',
    height: 180,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pair: {
    // backgroundColor: 'green',
    width: '100%',
    height: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 2
  },
  label: {
    // backgroundColor: 'yellow',
    height: '100%',
    width: '80%',
    marginTop: 1.5,
    textAlign: 'left',
    paddingLeft: 5
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginTop: 2.5,
    marginRight: 2.5
  }
});

export default Activity;