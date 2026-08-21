import React from 'react';
import { motion } from 'framer-motion';

export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  disabled = false,
  className = '',
  type = 'button',
  size = 'md'
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-semibold'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, boxShadow: '0 0 20px -2px rgba(79, 140, 255, 0.4)' }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-text-primary font-medium transition-colors duration-200 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon className={`${size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />}
      <span>{children}</span>
    </motion.button>
  );
}

export default PrimaryButton;
