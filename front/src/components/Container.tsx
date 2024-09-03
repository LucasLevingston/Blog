import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps): JSX.Element {
  return (
    <div
      className={`flex-1 bg-mainTextColor 
        p-6  sm:p-[50px] ${className}`}
    >
      <div className="h-full">{children}</div>
    </div>
  );
}
