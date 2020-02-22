import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListItem = (props) => {
  return (
    <View style={[style.container, props.underline ? style.underline : null]} >
      <View style={style.name} >
        <Text style={style.text} numberOfLines={1} >{props.name}</Text>
      </View>
      <View style={style.count} >
        <Text style={style.text} numberOfLines={1} >{props.value}</Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 5
  },
  underline: {
    borderColor: '#fff',
    borderBottomWidth: 1,
  },
  name: {
    width: '78%',
  },
  count: {
    width: '20%'
  },
  text: {
    color: '#fff',
    fontSize: 15
  }
});

export default ListItem;