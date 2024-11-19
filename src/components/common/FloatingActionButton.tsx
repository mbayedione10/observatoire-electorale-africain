import React from 'react';
import { FaFilter } from 'react-icons/fa';

interface FloatingActionButtonProps {
  onClick: () => void;
  isActive?: boolean;
  badgeCount?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  isActive = false,
  badgeCount
}) => {
  return (
    <button
      className={`
        fixed bottom-4 right-4 z-50 
        flex items-center justify-center
        w-14 h-14 
        rounded-full 
        shadow-lg 
        transition-all duration-300 ease-in-out
        ${isActive 
          ? 'bg-africa-accent rotate-180' 
          : 'bg-africa-primary hover:bg-africa-secondary'}
        text-white
        focus:outline-none focus:ring-2 focus:ring-africa-accent focus:ring-offset-2
        lg:hidden
      `}
      onClick={onClick}
      aria-label="Toggle filters"
    >
      <FaFilter className="w-6 h-6" />
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="
          absolute -top-2 -right-2 
          bg-africa-accent 
          text-white text-xs 
          rounded-full 
          w-6 h-6 
          flex items-center justify-center
        ">
          {badgeCount}
        </span>
      )}
    </button>
  );
};

export default FloatingActionButton;
