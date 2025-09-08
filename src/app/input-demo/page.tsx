'use client'

import { useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import FloatingInput, { 
  SearchInput, 
  EmailInput, 
  PasswordInput, 
  UserInput, 
  PhoneInput, 
  DateInput, 
  LocationInput 
} from '@/components/ui/FloatingInput'
import { 
  Palette, 
  Sparkles, 
  Wand2, 
  Heart,
  Code,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'

export default function InputDemoPage() {
  const { darkMode } = useDarkMode()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    location: '',
    bio: '',
    search: '',
    website: '',
    company: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form submitted:', formData)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Modern Input Design
                </h1>
                <p className={`mt-1 transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Beautiful floating labels with smooth animations and modern styling
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Sparkles, label: 'Floating Labels', desc: 'Smooth label animations' },
                { icon: Wand2, label: 'Auto-validation', desc: 'Real-time error handling' },
                { icon: Heart, label: 'Accessible', desc: 'WCAG compliant design' },
                { icon: Code, label: 'TypeScript', desc: 'Fully typed components' }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className={`p-4 rounded-xl transition-colors duration-200 ${
                    darkMode ? 'bg-gray-800/60' : 'bg-white/80'
                  }`}>
                    <Icon className={`w-6 h-6 mb-2 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <h3 className={`font-semibold mb-1 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feature.label}
                    </h3>
                    <p className={`text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {feature.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Form Example */}
            <div className={`rounded-2xl p-8 transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800/60 border border-gray-700/50' 
                : 'bg-white/80 border border-slate-200/50'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Registration Form Example
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UserInput
                    id="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => updateField('firstName', value)}
                    required
                    error={errors.firstName}
                    autoComplete="given-name"
                  />
                  
                  <FloatingInput
                    id="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => updateField('lastName', value)}
                    autoComplete="family-name"
                  />
                </div>

                {/* Email */}
                <EmailInput
                  id="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={(value) => updateField('email', value)}
                  required
                  error={errors.email}
                  autoComplete="email"
                />

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordInput
                    id="password"
                    label="Password"
                    value={formData.password}
                    onChange={(value) => updateField('password', value)}
                    required
                    error={errors.password}
                    helperText="Minimum 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                  />
                  
                  <PasswordInput
                    id="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(value) => updateField('confirmPassword', value)}
                    required
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhoneInput
                    id="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(value) => updateField('phone', value)}
                    autoComplete="tel"
                  />
                  
                  <DateInput
                    id="birthDate"
                    label="Date of Birth"
                    value={formData.birthDate}
                    onChange={(value) => updateField('birthDate', value)}
                  />
                </div>

                {/* Location */}
                <LocationInput
                  id="location"
                  label="Location"
                  value={formData.location}
                  onChange={(value) => updateField('location', value)}
                  placeholder="City, Country"
                />

                {/* Bio */}
                <FloatingInput
                  id="bio"
                  label="Bio"
                  value={formData.bio}
                  onChange={(value) => updateField('bio', value)}
                  multiline
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us about yourself..."
                  helperText="Share a brief description about yourself"
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                >
                  Create Account
                </button>
              </form>
            </div>

            {/* Input Variants Showcase */}
            <div className="space-y-6">
              {/* Search Input */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Search Input
                </h3>
                <SearchInput
                  id="search"
                  label="Search Models"
                  value={formData.search}
                  onChange={(value) => updateField('search', value)}
                  placeholder="Type to search..."
                />
              </div>

              {/* Input States */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Input States
                </h3>
                
                <div className="space-y-4">
                  <FloatingInput
                    id="success"
                    label="Success State"
                    value="valid@example.com"
                    onChange={() => {}}
                    success={true}
                    helperText="Email verified successfully"
                  />
                  
                  <FloatingInput
                    id="error"
                    label="Error State"
                    value="invalid-email"
                    onChange={() => {}}
                    error="Please enter a valid email address"
                  />
                  
                  <FloatingInput
                    id="disabled"
                    label="Disabled State"
                    value="Cannot edit this field"
                    onChange={() => {}}
                    disabled={true}
                  />
                </div>
              </div>

              {/* Professional Fields */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Professional Information
                </h3>
                
                <div className="space-y-4">
                  <FloatingInput
                    id="company"
                    label="Company Name"
                    value={formData.company}
                    onChange={(value) => updateField('company', value)}
                    autoComplete="organization"
                  />
                  
                  <FloatingInput
                    id="website"
                    label="Website URL"
                    type="url"
                    value={formData.website}
                    onChange={(value) => updateField('website', value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Responsive Preview */}
              <div className={`rounded-2xl p-6 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/80 border border-slate-200/50'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Responsive Design
                </h3>
                
                <div className="flex items-center space-x-4 mb-4">
                  {[
                    { icon: Monitor, label: 'Desktop' },
                    { icon: Tablet, label: 'Tablet' },
                    { icon: Smartphone, label: 'Mobile' }
                  ].map((device, index) => {
                    const Icon = device.icon
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${
                          darkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          {device.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
                
                <p className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  All inputs automatically adapt to different screen sizes with optimized touch targets and spacing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}