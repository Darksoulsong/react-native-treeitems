import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

function onButtonPress(onPress) {
  setTimeout(() => {
    onPress();
  }, 50);
}

export default function({ children, onPress, disabled }) {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        disabled={disabled}
        background={TouchableNativeFeedback.Ripple('#000000')}
        onPress={() => onButtonPress(onPress)}
      >
        <View>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => onButtonPress(onPress)}
      >
        <View>{children}</View>
      </TouchableOpacity>
    );
  }
}
