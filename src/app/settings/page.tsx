'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/contexts/DarkModeContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SettingsSidebar from '@/components/SettingsSidebar';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import ModelPreferences from '@/components/settings/ModelPreferences';
import ThemeSettings from '@/components/settings/ThemeSettings';

export default function SettingsPage() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedModels, setSelectedModels] = useState<string[]>(['openai/gpt-4o', 'google/gemini-pro-1.5', 'deepseek/deepseek-chat']);
  const [chatHistory, setChatHistory] = useState<Array<{prompt: string, responses: any[], timestamp: Date | string | number}>>([]);

  const handleNewChat = () => {
    router.push('/');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'models':
        return <ModelPreferences selectedModels={selectedModels} onModelsChange={setSelectedModels} />;
      case 'theme':
        return <ThemeSettings isDarkMode={darkMode} onThemeChange={toggleDarkMode} />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className={`flex h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 w-full">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <Sidebar 
            chatHistory={chatHistory}
            onNewChat={handleNewChat}
            isDarkMode={darkMode}
            onToggleTheme={toggleDarkMode}
          />
        </div>
      
        {/* Main Content */}
        <div className="flex-1 flex min-w-0">
          {/* Settings Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <SettingsSidebar 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
          
          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
