import React from 'react';
import { View } from 'react-native';
import { Dialog  } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { DANGER } from '../../../util/color';
import Text from '../Text/Text';
import { WARNING } from '../../../util/icons';

const progressBox = (props) => {
  return (
    <Dialog 
      visible={props.visible}
      onTouchOutside={props.onTouchOutside}
    >
      <View>
        <View style={{ alignItems: 'center', marginVertical: 5 }} >
          <Icon name={WARNING} size={35} color={DANGER} />
        </View>
        <Text 
          text={props.message}
          type='h5'
          style={{ marginVertical: 15 }}
        />    
      </View>
    </Dialog>
  );
}

export default progressBox;