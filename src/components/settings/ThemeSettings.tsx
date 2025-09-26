'use client';

import { useState } from 'react';

interface ThemeSettingsProps {
  isDarkMode: boolean;
  onThemeChange: () => void;
}

const accentColors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Teal', value: 'teal', class: 'bg-teal-500' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
  { name: 'Cyan', value: 'cyan', class: 'bg-cyan-500' },
  { name: 'Lime', value: 'lime', class: 'bg-lime-500' },
  { name: 'Amber', value: 'amber', class: 'bg-amber-500' },
  { name: 'Rose', value: 'rose', class: 'bg-rose-500' }
];

const fontSizes = [
  { name: 'Small', value: 'sm', class: 'text-sm' },
  { name: 'Medium', value: 'md', class: 'text-base' },
  { name: 'Large', value: 'lg', class: 'text-lg' },
  { name: 'Extra Large', value: 'xl', class: 'text-xl' }
];

export default function ThemeSettings({ isDarkMode, onThemeChange }: ThemeSettingsProps) {
  const [accentColor, setAccentColor] = useState('blue');
  const [fontSize, setFontSize] = useState('md');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleSaveSettings = () => {
    // Here you would typically save to your backend
    console.log('Saving theme settings:', {
      isDarkMode,
      accentColor,
      fontSize,
      compactMode,
      animations,
      highContrast
    });
    // Show success message
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Appearance Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize the look and feel of your AI Fiesta experience
        </p>
      </div>

      {/* Theme Mode */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Mode</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
            </div>
          <button
              onClick={onThemeChange}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
          </button>
          </div>
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accent Color</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose your preferred accent color for buttons, links, and highlights
        </p>
        
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              className={`p-3 border rounded-lg transition-all ${
                accentColor === color.value
                  ? 'border-gray-900 dark:border-white ring-2 ring-blue-500'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className={`w-8 h-8 ${color.class} rounded-full mx-auto mb-2`}></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Font Size</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Adjust the text size for better readability
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => setFontSize(size.value)}
              className={`p-3 border rounded-lg transition-all ${
                fontSize === size.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className={`${size.class} text-gray-900 dark:text-white`}>
                Sample Text
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{size.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Options</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Compact Mode</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Reduce spacing and padding for more content</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(e) => setCompactMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Animations</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Enable smooth transitions and animations</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={animations}
                onChange={(e) => setAnimations(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">High Contrast</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better accessibility</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          See how your theme settings will look
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 ${accentColors.find(c => c.value === accentColor)?.class} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">AI Fiesta</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Compare AI models</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <button className={`px-4 py-2 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded-lg transition-colors`}>
              Primary Button
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Secondary Button
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Save Theme Settings
        </button>
      </div>
    </div>
  );
}
