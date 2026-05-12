import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectThemePreference,
  setThemePreference,
} from '../features/theme/themeSlice'

const modes = [
  { value: 'light', label: 'Light', title: 'Light theme' },
  { value: 'dark', label: 'Dark', title: 'Dark theme' },
  { value: 'system', label: 'Auto', title: 'Match system' },
]

function ThemeToggle() {
  const dispatch = useDispatch()
  const preference = useSelector(selectThemePreference)

  const onSelect = useCallback(
    (value) => {
      dispatch(setThemePreference(value))
    },
    [dispatch],
  )

  return (
    <div
      className="inline-flex rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 shadow-sm dark:border-slate-600 dark:bg-slate-800/80"
      role="group"
      aria-label="Color theme"
    >
      {modes.map(({ value, label, title }) => {
        const active = preference === value
        return (
          <button
            key={value}
            type="button"
            title={title}
            aria-pressed={active}
            onClick={() => onSelect(value)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 ${
              active
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default memo(ThemeToggle)
