import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { messages, type MessageCatalog } from '@/localization/messages'
import { getLocaleMeta, type Locale } from '@/localization/settings'

export type Theme = 'light' | 'dark'

interface PreferencesValue {
  locale: Locale
  theme: Theme
  copy: MessageCatalog
  setLocale: (locale: Locale) => void
  setTheme: (theme: Theme) => void
}

const PreferencesContext = createContext<PreferencesValue | null>(null)

function readInitialPreference<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const value = new URLSearchParams(window.location.search).get(key)
  if (value && allowed.includes(value as T)) return value as T
  const stored = localStorage.getItem(`didehban.preference.${key}`)
  return stored && allowed.includes(stored as T) ? (stored as T) : fallback
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() =>
    readInitialPreference('locale', ['fa', 'en'], 'fa'),
  )
  const [theme, setTheme] = useState<Theme>(() =>
    readInitialPreference('theme', ['light', 'dark'], 'light'),
  )

  useEffect(() => {
    const meta = getLocaleMeta(locale)
    document.documentElement.lang = meta.languageTag
    document.documentElement.dir = meta.direction
    document.documentElement.dataset.theme = theme
    document.title =
      locale === 'fa' ? 'دیده‌بان جهان — نمونهٔ تصویری' : 'Didehban Jahan — Visual MVP'
    localStorage.setItem('didehban.preference.locale', locale)
    localStorage.setItem('didehban.preference.theme', theme)
  }, [locale, theme])

  const value = useMemo(
    () => ({ locale, theme, copy: messages[locale], setLocale, setTheme }),
    [locale, theme],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }

  return context
}
