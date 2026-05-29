import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseClass = 'py-2 px-4 rounded-lg items-center justify-center';

  const variantClass = {
    primary: 'bg-sky-600',
    secondary: 'bg-orange-500',
    outline: 'border-2 border-orange-500 bg-transparent',
  }[variant];

  const textClass = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-orange-500 font-semibold',
  }[variant];

  return (
    <TouchableOpacity
      className={`${baseClass} ${variantClass} ${className}`}
      activeOpacity={0.85}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={textClass}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;
