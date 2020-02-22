import moment from 'moment';

export const getObjByDate = (arr, date) => {
  for(let i=arr.length - 1; i>=0; i--) {
    if(arr[i].date === date) {
      return arr[i];
    }
  }
}
export const getArrayByTime = (arr, time) => {
  let tempArray = [];
  if(typeof(time) === 'string') {
    for(let i=arr.length - 1; i>=0; i--) {
      if(arr[i].time === time) {
        tempArray.push(arr[i]);
      } 
    }
  } else {
    const start = parseInt(moment(time).startOf('day').format('x'));
    const end = parseInt(moment(time).endOf('day').format('x'));
    for(let i=arr.length - 1; i>=0; i--) {
      if((start <= arr[i].time) && (end >= arr[i].time)) {
        tempArray.push(arr[i]);
      } 
    }
  }
  
  return tempArray;
}

export const generateActivityData = (actvts, time) => {
  const start = parseInt(moment(time).startOf('day').format('x'));
  const activities = getArrayByTime(actvts, time);    
  const oneHour = 3600000;
  let currTime; 
  let prevTime = start;
  let formedActivity = {};
  let key;
  activities.forEach(activity => {
    for(let i=1;i<=24;i++) {
      currTime = start + (i*oneHour);
      if((prevTime <= activity.time) && (currTime >= activity.time)) {
        key = i-1 + '-' + i; 
        if(!formedActivity[key]) {
          formedActivity[key] = {};
        }
        if(!formedActivity[key][activity.type]) {
          formedActivity[key][activity.type] = 0
        }
        formedActivity[key][activity.type] += 1;
        break;
      }
      prevTime = currTime;
    }
  });
  return {
    date: moment(time).format("DD/MM/YY"),
    stats: formedActivity
  }
}

export const generateKeysByHalfHoure = (k) => {
  // 0:00 to 0:30
  // 0:30 to 1:00
  // 1:00 to 1:30 
  // 9:00 to 9:30
  //11:30 to 12:00
  const key = ((k-1) / 2) + '-' + (k/2); 
  return key;
}

export const generateLightData = (actvts, time) => {
  const start = parseInt(moment(time).startOf('day').format('x'));
  const activities = getArrayByTime(actvts, time);    
  const oneHour = 1800000; // 30 Miniute
  let currTime; 
  let prevTime = start;
  let formedActivity = {};
  let key;
  activities.forEach(activity => {
    for(let i=1;i<=48;i++) {
      currTime = start + (i*oneHour);
      if((prevTime <= activity.time) && (currTime >= activity.time)) {
        key = generateKeysByHalfHoure(i); 
        if(!formedActivity[key]) {
          formedActivity[key] = {};
        }
        if(!formedActivity[key].light) {
          formedActivity[key].light = 0;
          formedActivity[key].count = 0;
        }
        formedActivity[key].count += 1;
        formedActivity[key].light += activity.light;
        break;
      }
      prevTime = currTime;
    }
  });
  let formedLightData = {};
  Object.keys(formedActivity).forEach(key => {
    formedLightData[key] = formedActivity[key].light / formedActivity[key].count;
  });
  return {
    date: moment(time).format("DD/MM/YY"),
    stats: formedLightData
  }
}

export const generateUploadData = (arr, time) => {
  const currDate = moment(time).format("DD/MM/YY");
  let data = {};
  data.usageStats = {
    date: currDate,
    stats: arr[1]
  }
  data.callStats = {
    date: currDate,
    stats: arr[2]
  }
  const receiver = JSON.parse(arr[0]);
  data.unlocks = getObjByDate(receiver.unlocks, currDate);
  data.screenOnTime = getObjByDate(receiver.screenOnTime, currDate);
  data.notifications = getObjByDate(receiver.notifications, currDate);
  data.headsetPlug = getObjByDate(receiver.headsetPlug, currDate);
  data.activities = generateActivityData(receiver.activities, time);
  data.stepCounter = getObjByDate(receiver.stepCounter, currDate);
  data.lightSensor = generateLightData(receiver.lightSensor, time);
  return data;
}