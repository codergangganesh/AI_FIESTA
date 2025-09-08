'use client'

import { useState, useRef, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Eye, EyeOff, Search, Mail, User, Lock, Calendar, Phone, MapPin } from 'lucide-react'

interface FloatingInputProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  success?: boolean
  icon?: any
  helperText?: string
  autoComplete?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  multiline?: boolean
  rows?: number
  className?: string
  onFocus?: () => void
  onBlur?: () => void
}

export default function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  success = false,
  icon: Icon,
  helperText,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  multiline = false,
  rows = 3,
  className = '',
  onFocus,
  onBlur
}: FloatingInputProps) {
  const { darkMode } = useDarkMode()
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  
  const hasValue = value.length > 0
  const shouldFloat = isFocused || hasValue
  const isPassword = type === 'password'

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const getStatusColor = () => {
    if (error) return darkMode ? 'border-red-400 text-red-400' : 'border-red-500 text-red-500'
    if (success) return darkMode ? 'border-green-400 text-green-400' : 'border-green-500 text-green-500'
    if (isFocused) return darkMode ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-500'
    return darkMode ? 'border-gray-600 text-gray-400' : 'border-slate-300 text-slate-500'
  }

  const getBackgroundColor = () => {
    if (disabled) return darkMode ? 'bg-gray-800/50' : 'bg-slate-100/50'
    return darkMode ? 'bg-gray-800/80' : 'bg-white/80'
  }

  const getLabelColor = () => {
    if (error) return darkMode ? 'text-red-400' : 'text-red-500'
    if (success) return darkMode ? 'text-green-400' : 'text-green-500'
    if (isFocused || hasValue) return darkMode ? 'text-blue-400' : 'text-blue-600'
    return darkMode ? 'text-gray-400' : 'text-slate-500'
  }

  const getTextColor = () => {
    if (disabled) return darkMode ? 'text-gray-500' : 'text-slate-400'
    return darkMode ? 'text-white' : 'text-slate-900'
  }

  const getPlaceholderColor = () => {
    return darkMode ? 'placeholder-gray-500' : 'placeholder-slate-400'
  }

  const inputProps = {
    ref: inputRef as any,
    id,
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled,
    required,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    placeholder: shouldFloat ? placeholder : '',
    className: `
      w-full px-4 py-3 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 ease-out
      focus:outline-none focus:ring-0 resize-none
      ${getBackgroundColor()}
      ${getStatusColor()}
      ${getTextColor()}
      ${getPlaceholderColor()}
      ${Icon ? 'pl-12' : ''}
      ${isPassword ? 'pr-12' : ''}
      ${disabled ? 'cursor-not-allowed opacity-60' : ''}
    `
  }

  const Component = multiline ? 'textarea' : 'input'
  const componentProps = multiline 
    ? { ...inputProps, rows }
    : { ...inputProps, type: isPassword && showPassword ? 'text' : type }

  return (
    <div className={`relative group ${className}`}>
      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${
            multiline ? 'top-4 translate-y-0' : ''
          }`}>
            <Icon className={`w-5 h-5 ${getLabelColor()}`} />
          </div>
        )}

        {/* Input/Textarea */}
        <Component {...componentProps} />

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`
            absolute left-4 transition-all duration-300 ease-out cursor-text select-none pointer-events-none
            ${Icon ? 'left-12' : 'left-4'}
            ${shouldFloat 
              ? `-top-2 text-sm px-2 ${getBackgroundColor()} ${getLabelColor()} font-medium scale-95` 
              : `top-1/2 transform -translate-y-1/2 text-base ${getLabelColor()} ${multiline ? 'top-4 translate-y-0' : ''}`
            }
          `}
        >
          {label} {required && <span className={darkMode ? 'text-red-400' : 'text-red-500'}>*</span>}
        </label>

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 hover:scale-110 ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-slate-500 hover:text-slate-600'
            }`}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Focus Ring */}
        <div className={`
          absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
          ${isFocused ? 'ring-2 ring-offset-2 ring-opacity-50' : ''}
          ${error ? darkMode ? 'ring-red-400/50 ring-offset-gray-900' : 'ring-red-500/50 ring-offset-white' : ''}
          ${success ? darkMode ? 'ring-green-400/50 ring-offset-gray-900' : 'ring-green-500/50 ring-offset-white' : ''}
          ${!error && !success && isFocused ? darkMode ? 'ring-blue-400/50 ring-offset-gray-900' : 'ring-blue-500/50 ring-offset-white' : ''}
        `} />
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <div className={`mt-2 text-sm transition-all duration-300 ${
          error 
            ? darkMode ? 'text-red-400' : 'text-red-500'
            : darkMode ? 'text-gray-400' : 'text-slate-600'
        }`}>
          {error || helperText}
        </div>
      )}

      {/* Character Count */}
      {maxLength && (
        <div className={`mt-1 text-xs text-right transition-colors duration-300 ${
          value.length > maxLength * 0.8 
            ? value.length >= maxLength 
              ? darkMode ? 'text-red-400' : 'text-red-500'
              : darkMode ? 'text-yellow-400' : 'text-yellow-600'
            : darkMode ? 'text-gray-500' : 'text-slate-400'
        }`}>
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  )
}

// Export pre-configured input variants
export const SearchInput = (props: Omit<FloatingInputProps, 'icon' | 'type'>) => (
  <FloatingInput {...props} icon={Search} type="search" />
)

export const EmailInput = (props: Omit<FloatingInputProps, 'icon' | 'type'>) => (
  <FloatingInput {...props} icon={Mail} type="email" />
)

export const PasswordInput = (props: Omit<FloatingInputProps, 'icon' | 'type'>) => (
  <FloatingInput {...props} icon={Lock} type="password" />
)

export const UserInput = (props: Omit<FloatingInputProps, 'icon' | 'type'>) => (
  <FloatingInput {...props} icon={User} type="text" />
)

export const PhoneInput = (props: Omit<FloatingInputProps, 'icon' | 'type'>) => (
  <FloatingInput {...props} icon={Phone} type="tel" />
)

export const DateInput = (props: Omit<FloatingInputProps, 'icon' | 'type'>) => (
  <FloatingInput {...props} icon={Calendar} type="date" />
)

export const LocationInput = (props: Omit<FloatingInputProps, 'icon' | 'type'>) => (
  <FloatingInput {...props} icon={MapPin} type="text" />
)