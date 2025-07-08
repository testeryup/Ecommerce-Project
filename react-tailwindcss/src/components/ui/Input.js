import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  icon,
  error,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 
            ${icon ? 'pl-12' : 'pl-4'} 
            ${type === 'password' ? 'pr-12' : 'pr-4'}
            border border-gray-200 rounded-2xl 
            bg-white text-gray-900 placeholder-gray-500
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${isFocused ? 'shadow-lg transform scale-[1.02]' : 'hover:border-gray-300'}
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon 
              icon={showPassword ? faEyeSlash : faEye} 
              className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" 
            />
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
