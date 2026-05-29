import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <View
      className={`bg-white rounded-xl border border-orange-200 p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;
