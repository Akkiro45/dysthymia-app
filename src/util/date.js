let y = [];
let startYear = 1980;
for(let i=0;i<36;i++) {
  y.push(startYear.toString());
  startYear += 1;
}

const genratePair = (start, end) => {
  let temp = [];
  for(let i=start;i<=end;i++) {
    if(i<10) {
      temp.push('0' + i);
    } else {
      temp.push(i.toString());
    }
  }
  return temp;
}

export const isLeapYear = (year) => {
  year = parseInt(year);
  if(year % 100 === 0) {
    return (year % 400 === 0);
  } else {
    return (year % 4 === 0);
  }
}

export const getDays = (month, year) => {
  if(month === 2) {
    if(isLeapYear(year)) {
      return genratePair(1, 29);
    } else {
      return genratePair(1, 28);
    }
  } else if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
    return genratePair(1, 31);
  } else {
    return genratePair(1, 30);
  }
}

export const month = genratePair(1, 12);
export const year = y;