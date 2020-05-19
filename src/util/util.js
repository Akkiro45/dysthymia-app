import moment from 'moment'; 

export const sortObj = (obj, type) => {
  const keysSorted = Object.keys(obj).sort(function(a,b){
    if(type === 'desc')
      return obj[b]-obj[a]
    else 
      return obj[a]-obj[b]
  });
  let sortedObj = {}
  keysSorted.forEach(key => {
    sortedObj[key] = obj[key]; 
  })
  return sortedObj;
}

export const miliToMin = (mili) => {
  return Math.trunc((mili / 60000));
}

export const secToMin = (sec) => {
  return Math.trunc(sec / 60);
} 
export const secToMinRound = (sec) => {
  return Math.round(sec / 60);
}

export const updateObject = (oldObject, updatedproperties) => {
  return {
      ...oldObject,
      ...updatedproperties
  }
}

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const capitalizeFirstChar = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const getDateFormate1 = (date) => {
  // Tuesday, 03 March
  return moment(date).format('dddd, DD MMMM');
}

export const tranformTime = (time) => {
  let res = {};
  if(time < 1000) {
    res.time = 0;
    res.type = 'Seconds';
  } else if(time < 60000) {
    res.time = Math.trunc(time / 1000);
    res.type = 'Seconds';
  } else if(time < 3600000) {
    res.time = Math.trunc((time / 60000));
    res.type = 'Miniutes';
  } else {
    // res.time = (time / (1000 * 60 * 60)).toFixed(1);
    const min = miliToMin(time);
    res.time = Math.trunc(min / 60) + ':' + (min % 60);
    res.type = 'Hours';
  }
  return res;
}

export const miliToTime = (time) => {
  return minToTime(miliToMin(time));
}

export const minToTime = (time) => {
  const hour = Math.trunc(time / 60);
  const min = time % 60;
  return (hour + 'hrs ' + min + 'min'); 
}

export const minToTimePerfect = (time) => {
  const hour = Math.trunc(time / 60);
  const min = time % 60;
  if(hour === 0) {
    return (min + 'min');
  } else {
    return (hour + 'hrs ' + min + 'min'); 
  }
}

export const miliToHoure = (time) => {
  return parseFloat((time / (1000 * 60 * 60)).toFixed(1));
}

export const calcDistance = (steps, height) => {
  // in km
  const inchs = height * 12; 
  let strideLength = inchs * 0.413;
  strideLength = strideLength * 2.54; 
  return ((steps * strideLength) / 100000).toFixed(2);
}

export const calcCalories = (steps, weight, height) => {
  const miles = calcDistance(steps, height) / 1.609;
  const weightInLbs = weight * 2.205;
  const calPerMiles = weightInLbs * 0.57;
  return Math.trunc(calPerMiles * miles);
}

export const convHeightStrToFootInt = (height) => {
  let inch = '0';
  if(height.length === 9) {
    inch = height.substring(4, 5);
  } else if(height.length === 10) {
    inch = height.substring(4, 6);
  }
  return parseFloat(height[0] + '.' + inch);
}

export const kRespresentedStr = (val) => {
  val = val.toString();
  if(val.length > 3) {
    return (val.slice(0, val.length - 3) + ',' + val.slice(val.length - 3));
  } else {
    return val;
  }
}

export const validateEmail = (email) => {
  // eslint-disable-next-line
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}