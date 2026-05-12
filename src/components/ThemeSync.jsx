import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectEffectiveTheme,
  setSystemDark,
} from '../features/theme/themeSlice'

/** Applies `dark` on `<html>` and tracks OS color scheme when preference is “system”. */
export default function ThemeSync() {
  const theme = useSelector(selectEffectiveTheme)
  const dispatch = useDispatch()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    dispatch(setSystemDark(mq.matches))
    const onChange = (e) => dispatch(setSystemDark(e.matches))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [dispatch])

  return null
}
