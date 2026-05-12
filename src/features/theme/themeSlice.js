import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'multiops_theme_preference'

function readPreference() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    // ignore
  }
  return 'system'
}

function persistPreference(preference) {
  try {
    localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // ignore
  }
}

const initialState = {
  preference: readPreference(),
  systemDark:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemePreference(state, action) {
      state.preference = action.payload
      persistPreference(state.preference)
    },
    setSystemDark(state, action) {
      state.systemDark = action.payload
    },
  },
})

export const { setThemePreference, setSystemDark } = themeSlice.actions

export const selectThemePreference = (state) => state.theme.preference
export const selectSystemDark = (state) => state.theme.systemDark

export const selectEffectiveTheme = (state) => {
  const { preference, systemDark } = state.theme
  if (preference === 'system') return systemDark ? 'dark' : 'light'
  return preference
}

export default themeSlice.reducer
