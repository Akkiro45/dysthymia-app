import { PermissionsAndroid, NativeModules } from 'react-native';
import moment from 'moment';

const { CallLogs } = NativeModules;

const filterCallLogs = (logs, time) => {
  let callLogInfo = {
    incoming: 0,
    outgoing: 0,
    missed: 0,
    incomingDuration: 0,
    outgoingDuration: 0,
    uniqueIncoming: 0,
    uniqueOutgoing: 0,
    uniqueMissed: 0
  }
  let incoming = [];
  let outgoing = [];
  let missed = [];
  const start = parseInt(moment(time).startOf('day').format('x'));
  const end = parseInt(moment(time).endOf('day').format('x'));
  logs.forEach(l => {
    if((start <= parseInt(l.timestamp)) && (end >= parseInt(l.timestamp))) {
      if(l.type === 'INCOMING') {
        callLogInfo.incoming += 1;
        callLogInfo.incomingDuration += l.duration;
        if(incoming.indexOf(l.phoneNumber) === -1) {
          incoming.push(l.phoneNumber);
        }
      }
      else if(l.type === 'OUTGOING') {
        callLogInfo.outgoing += 1;
        callLogInfo.outgoingDuration += l.duration;
        if(outgoing.indexOf(l.phoneNumber) === -1) {
          outgoing.push(l.phoneNumber);
        }
      }
      else if(l.type === 'MISSED') {
        callLogInfo.missed += 1;
        if(missed.indexOf(l.phoneNumber) === -1) {
          missed.push(l.phoneNumber);
        }
      }

    }
  });
  callLogInfo.uniqueIncoming = incoming.length;
  callLogInfo.uniqueOutgoing = outgoing.length;
  callLogInfo.uniqueMissed = missed.length;
  return callLogInfo;
}

const getCallLogsStats = (time) => {
  return new Promise((resolve, reject) => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      {
        title: 'Dysthymia',
        message: 'Access your call logs',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    )
      .then(granted  => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          CallLogs.load(100)
            .then(logs => {
              resolve(filterCallLogs(logs, time));
            });
        } else {
          reject(false);
          // reject('Call Log permission denied!');
        }
      })
      .catch(e => {
        reject(false);
        // reject('Call Log permission denied!');
      });
  });
}

export default getCallLogsStats;