import moment from 'moment';

export const transformStats = (stats, initialData) => {
  if(initialData) {
    stats.unshift(initialData);
  }
  const l = stats.length;
  
  if(l === 0) {
    return [];
  }

  if(l === 1) {
    return [{
      ...initialData,
      day: moment(curr).format('ddd'),
      timeFormate: moment(curr).format('ddd, DD MMM')
    }];
  }
  
  const oneDay = 86400000;
  const startTimeStamp = moment(stats[0].date, 'DD/MM/YY').valueOf();
  const endTimeStamp = moment(stats[l-1].date, 'DD/MM/YY').valueOf();

  let transformedStats = [];
  let curr = startTimeStamp;
  let temp;
  let date;
  let data;

  while(curr >= endTimeStamp) {
    date = moment(curr).format('DD/MM/YY');
    data = stats.find(el => el.date === date);
    if(data) {
      temp = {
        ...data
      }
    } else {
      temp = {}
    }
    temp.date = date;
    temp.day = moment(curr).format('ddd');
    temp.timeFormate = moment(curr).format('ddd, DD MMM');

    transformedStats.push(temp);
    curr -= oneDay;
  }
  return transformedStats;
}

// {
//   date: '01/02/20',
//   day: 'wed',
//   timeFormate: 'Sat, 28 Feb',
//   ...remaingData
// }