import { render, screen } from '@testing-library/react'
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
  it('opens Persian World Monitor and populates the Inspector from a map event', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    renderProduct()

    expect(screen.getByRole('heading', { level: 1, name: 'رصد جهان' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')

    await user.click(screen.getAllByRole('button', { name: /افزایش بازرسی کشتی‌ها/ })[0])
    const inspector = screen.getByRole('dialog', { name: /افزایش بازرسی کشتی‌ها/ })
    expect(inspector).toBeInTheDocument()
    expect(screen.getByText('چرا مهم است؟')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'تحلیل هوش مصنوعی' }))
    expect(screen.getByRole('tab', { name: 'تحلیل هوش مصنوعی' })).toHaveAttribute(
      'data-state',
      'active',
    )

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /افزایش بازرسی کشتی‌ها/ })).not.toBeInTheDocument()
  })

  it('shows a clear restricted Data Management state for viewers', () => {
    localStorage.clear()
    renderProduct('/data')

    expect(screen.getByText('این بخش برای نقش فعلی در دسترس نیست')).toBeInTheDocument()
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
    localStorage.clear()
    localStorage.setItem('didehban.prototype.role', 'data-manager')
    const user = userEvent.setup()
    renderProduct('/data')

    const search = screen.getByPlaceholderText('جست‌وجوی منبع…')
    await user.type(search, 'Reuters')
    expect(search).toHaveValue('Reuters')
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
