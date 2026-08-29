const refinedModuleTitles: Record<string, string> = {
  'تصویر عملیاتی جهان': 'نقشه تحولات جهان',
  'Global operating picture': 'Global developments map',
  'جریان زنده رویدادها': 'آخرین رویدادها',
  'Live event stream': 'Latest events',
  'نمای سیگنال‌های پرریسک': 'روند سیگنال‌های پرریسک',
  'High-risk signal overview': 'High-risk signal trend',
  'جغرافیاهای تحت پایش': 'کشورهای تحت پایش',
  'Monitored geographies': 'Monitored countries',
  'فهرست پایش': 'بازارهای تحت پایش',
  Watchlist: 'Monitored markets',
  'مقایسه بازارها': 'مقایسه تغییر روزانه بازارها',
  'Market comparison': 'Daily market comparison',
  'پیامدهای هوشمند': 'برداشت تحلیلی بازار',
  'AI implications': 'Market interpretation',
  'کشورها': 'انتخاب و بررسی کشور',
  Countries: 'Country selection & review',
  'مسیرهای راهبردی': 'وضعیت مسیرهای راهبردی',
  'Strategic corridors': 'Strategic corridor status',
  'مقایسه کشورها': 'مقایسه ریسک کشورها',
  'Country comparison': 'Country risk comparison',
  'نقشه تنش‌های منطقه‌ای': 'کانون‌های تنش روی نقشه',
  'Regional tension map': 'Tension hotspots map',
  'مقایسه ریسک منطقه‌ای': 'مقایسه ریسک مناطق',
  'Regional risk comparison': 'Regional risk comparison',
  'خط زمانی تهدید': 'روند زمانی تهدیدها',
  'Threat timeline': 'Threats over time',
  'جمع‌بندی وضعیت راهبردی': 'برداشت راهبردی از وضعیت',
  'Strategic posture summary': 'Strategic situation assessment',
}

export function refineModuleTitle(title: string) {
  return refinedModuleTitles[title] ?? title
}
