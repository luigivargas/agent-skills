import React from 'react';
import { useTheme } from '../context/ThemeContext';

const sunIcon = '☀️';
const moonIcon = '🌙';
const systemIcon = '💻';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light' as const, icon: sunIcon, label: 'Light' },
    { value: 'dark' as const, icon: moonIcon, label: 'Dark' },
    { value: 'system' as const, icon: systemIcon, label: 'System' },
  ];

  return (
    <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`px-2 py-1 text-xs transition-colors ${
            theme === opt.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          } ${opt.value === 'light' ? 'rounded-l-md' : ''} ${opt.value === 'system' ? 'rounded-r-md' : ''}`}
          aria-label={`Switch to ${opt.label} theme`}
          title={opt.label}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
