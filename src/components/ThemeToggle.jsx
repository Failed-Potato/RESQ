import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      <button
        type="button"
        className="theme-toggle-option"
        aria-label="Light mode"
        aria-pressed={theme === 'light'}
        title="Light mode"
        onClick={() => setTheme('light')}
      >
        <Sun size={16} aria-hidden="true" />
        <span>Light</span>
      </button>
      <button
        type="button"
        className="theme-toggle-option"
        aria-label="Dark mode"
        aria-pressed={theme === 'dark'}
        title="Dark mode"
        onClick={() => setTheme('dark')}
      >
        <Moon size={16} aria-hidden="true" />
        <span>Dark</span>
      </button>
    </div>
  )
}
