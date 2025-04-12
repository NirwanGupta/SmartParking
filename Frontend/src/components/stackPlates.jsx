// components/StackPlates.jsx
import React from 'react';

const StackPlates = ({ count = 5, selectedIndex, onSelect }) => {
  return (
    <div className="flex flex-col items-center space-y-3 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-full rounded-xl py-2 text-sm font-semibold transition-all duration-200
            ${selectedIndex === index
              ? 'bg-primary text-primary-content scale-105 shadow-lg'
              : 'bg-base-100 text-base-content hover:bg-base-300'}
          `}
        >
          Floor {index+1}
        </button>
      ))}
    </div>
  );
};

export default StackPlates;
