import React from 'react';
import { View, Text, Image } from 'react-native';

const LOGO = require('../../assets/images/saferide-logo.png');

const Logo: React.FC = () => {
  return (
    <View className="flex-row items-center space-x-2">
      <Image source={LOGO} style={{ width: 40, height: 40, borderRadius: 8 }} resizeMode="contain" />
      <Text className="font-bold text-blue-800 text-xl ml-2">SafeRide Africa</Text>
    </View>
  );
};

export default Logo;
