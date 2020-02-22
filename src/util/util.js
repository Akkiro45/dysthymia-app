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

export const updateObject = (oldObject, updatedproperties) => {
  return {
      ...oldObject,
      ...updatedproperties
  }
}