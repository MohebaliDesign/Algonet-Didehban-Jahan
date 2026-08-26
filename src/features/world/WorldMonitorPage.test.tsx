import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { App } from '@/app/App'
import { PreferencesProvider } from '@/app/PreferencesProvider'
import { WorkspaceProvider } from '@/app/WorkspaceProvider'
import { DirectionProvider } from '@/components/ui/direction'
import { TooltipProvider } from '@/components/ui/tooltip'

function renderProduct(path = '/world') {
  window.history.pushState({}, '', path)
  return render(
    <BrowserRouter>
      <PreferencesProvider>
        <DirectionProvider dir="rtl">
          <TooltipProvider>
            <WorkspaceProvider>
              <App />
            </WorkspaceProvider>
          </TooltipProvider>
        </DirectionProvider>
      </PreferencesProvider>
    </BrowserRouter>,
  )
}

describe('visual MVP shell', () => {
  it('opens Persian World Monitor and populates the map detail panel from the shared list', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    renderProduct()

    expect(screen.getByRole('heading', { level: 1, name: 'رصد جهان' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')

    await user.click(screen.getByRole('radio', { name: 'فهرست' }))
    const mapList = screen.getByLabelText('فهرست جایگزین نقشه')
    await user.click(within(mapList).getByRole('button', { name: /افزایش بازرسی کشتی‌ها/ }))
    const inspector = screen.getByRole('dialog', { name: /افزایش بازرسی کشتی‌ها/ })
    expect(inspector).toBeInTheDocument()
    expect(screen.getByText('شواهد و منابع')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /افزایش بازرسی کشتی‌ها/ })).not.toBeInTheDocument()
  })

  it('shows a clear restricted Data Management state for viewers', () => {
    localStorage.clear()
    renderProduct('/data')

    expect(screen.getByText('این بخش برای نقش فعلی در دسترس نیست')).toBeInTheDocument()
  })

  it('keeps the six approved destinations in order and hides Data Management from primary navigation', () => {
    renderProduct()

    const navigation = screen.getByRole('navigation', { name: 'ناوبری اصلی' })
    const links = Array.from(navigation.querySelectorAll('a')).map((link) =>
      link.textContent?.trim(),
    )
    expect(links).toEqual([
      'رصد جهان',
      'تحولات و پیش‌بینی‌ها',
      'امنیت و ژئوپلیتیک',
      'اقتصاد و بازارها',
      'کشورها و مسیرها',
      'گزارش‌ها و تحلیل‌ها',
    ])
    expect(navigation.querySelector('a[href="/data"]')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'رصد جهان' })).toHaveAttribute('aria-current', 'page')
  })

  it('opens Command search and selects a deterministic mock result', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    renderProduct()

    await user.click(screen.getByRole('button', { name: /رویداد، گزارش، کشور یا منبع/ }))
    const searchDialog = screen.getByRole('dialog', { name: 'جست‌وجوی سراسری' })
    expect(searchDialog).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('رویداد، گزارش، کشور یا منبع…'), 'قفقاز')
    await user.click(screen.getByRole('option', { name: /اختلال موقت در کریدور قفقاز/ }))

    expect(screen.getByRole('dialog', { name: /اختلال موقت در کریدور قفقاز/ })).toBeInTheDocument()
  })

  it('renders a shadcn chart and exposes its semantic table alternative', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    const { container } = renderProduct()

    expect(container.querySelectorAll('[data-slot="chart"]').length).toBeGreaterThan(0)
    await user.click(screen.getAllByRole('button', { name: 'جدول دادهٔ نمودار' })[0])
    expect(screen.getAllByRole('table').length).toBeGreaterThan(0)
  })

  it('supports the data-manager form and shadcn operational table', async () => {
    const user = userEvent.setup()
    renderProduct('/data')

    await user.click(screen.getByRole('button', { name: 'بازکردن منوی کاربر' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'مدیر منابع و داده‌ها' }))

    const search = screen.getByPlaceholderText('جست‌وجوی منبع…')
    await user.type(search, 'Reuters')
    expect(search).toHaveValue('Reuters')
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('gates Sources & Data in the profile menu and opens the existing management experience', async () => {
    const user = userEvent.setup()
    renderProduct()

    await user.click(screen.getByRole('button', { name: 'بازکردن منوی کاربر' }))
    expect(screen.queryByRole('menuitem', { name: 'منابع و داده‌ها' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('menuitemradio', { name: 'مدیر سازمان' }))
    await user.click(screen.getByRole('button', { name: 'بازکردن منوی کاربر' }))
    await user.click(screen.getByRole('menuitem', { name: 'منابع و داده‌ها' }))

    expect(screen.getByRole('dialog', { name: 'مدیریت منابع و داده‌ها' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('جست‌وجوی منبع…')).toBeInTheDocument()
  })

  it('uses localized sidebar controls and keeps the compact trigger keyboard accessible', async () => {
    const user = userEvent.setup()
    renderProduct()

    const collapse = screen.getByRole('button', { name: 'جمع‌کردن نوار کناری' })
    await user.click(collapse)
    expect(
      screen
        .getAllByRole('button', { name: 'بازکردن نوار کناری' })
        .some((button) => button.classList.contains('nav-collapse')),
    ).toBe(true)
  })
})
