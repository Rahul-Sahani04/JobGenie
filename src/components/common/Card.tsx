import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  border?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
  shadow = 'md',
  padding = 'md',
  rounded = 'md',
  border = false,
}) => {
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };
  
  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Hover effect
  const hoverClasses = hover 
    ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
    : '';
  
  // Border
  const borderClasses = border ? 'border border-gray-200' : '';
  
  return (
    <div
      className={`bg-white ${shadowClasses[shadow]} ${paddingClasses[padding]} ${roundedClasses[rounded]} ${hoverClasses} ${borderClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;