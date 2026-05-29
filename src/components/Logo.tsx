import React from 'react';
import { View, Text } from 'react-native';
import { Car } from 'lucide-react-native';

const Logo: React.FC = () => {
  return (
    <View className="flex-row items-center space-x-2">
      <View className="bg-sky-100 w-10 h-10 rounded-full items-center justify-center">
        <Car size={20} color="#0284c7" />
      </View>
      <Text className="font-bold text-blue-800 text-xl ml-2">SafeRide Africa</Text>
    </View>
  );
};

export default Logo;
