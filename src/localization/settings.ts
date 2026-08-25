export type Locale = 'fa' | 'en'

export interface LocaleMeta {
  languageTag: string
  direction: 'rtl' | 'ltr'
  localTimeZone: string
  calendar: 'persian' | 'gregory'
}

const localeSettings: Record<Locale, LocaleMeta> = {
  fa: {
    languageTag: 'fa-IR',
    direction: 'rtl',
    localTimeZone: 'Asia/Tehran',
    calendar: 'persian',
  },
  en: {
    languageTag: 'en',
    direction: 'ltr',
    localTimeZone: 'Asia/Tehran',
    calendar: 'gregory',
  },
}

export function getLocaleMeta(locale: Locale) {
  return localeSettings[locale]
}

export function formatFutureDate(isoDate: string, locale: Locale, timeZone = 'UTC') {
  const meta = getLocaleMeta(locale)
  return new Intl.DateTimeFormat(meta.languageTag, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
    calendar: meta.calendar,
  }).format(new Date(isoDate))
}
