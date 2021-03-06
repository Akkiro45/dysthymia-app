import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { BLUE_CHART, LIGHT_BLUE_CHART } from '../../../util/color';

const lineChart = (props) => {
  // const COLORS = {
  //   dark: '#1a237e',
  //   medium: '#3f51b5',
  //   light: '#9fa8da'
  // }
  const COLORS = {
    dark: BLUE_CHART,
    medium: BLUE_CHART,
    light: LIGHT_BLUE_CHART
  }
  const chartConfig = {
    backgroundColor: COLORS.dark,
    backgroundGradientFrom: COLORS.medium,
    backgroundGradientTo: COLORS.light,
    decimalPlaces: props.decimalPlaces ? props.decimalPlaces : 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 0
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: COLORS.light
    }
  }
  return (
    <LineChart
      data={props.data}
      width={Dimensions.get('window').width - 20} 
      height={250}
      onDataPointClick={props.onDataPointClick}
      yAxisInterval={1}
      chartConfig={chartConfig}
      bezier
      style={{
        marginVertical: 10,
        borderRadius: 16,
        alignSelf: 'center',
        elevation: 15
      }}
      fromZero
      // yAxisLabel="$"
      yAxisSuffix={props.yAxisSuffix}
    />
  );
} 

export default lineChart;