import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;

import { sortObj, miliToMin } from '../util/util';

export default usageStats = (startTime, endTime) => {
  return new Promise((resolve, reject) => {
    UsageStats.getStats(startTime.toString(), endTime.toString(), (res) => {
      let stats = {};
      let val;
      Object.keys(res).forEach(key => {
        val = miliToMin(parseInt(res[key]));
        if(val > 0) {
          stats[key] = val;
        }
      });
      resolve(sortObj(stats, 'desc'));
    });
  })
}