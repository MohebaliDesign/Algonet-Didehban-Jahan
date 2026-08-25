import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { App } from '@/app/App'
import { PreferencesProvider } from '@/app/PreferencesProvider'
import { WorkspaceProvider } from '@/app/WorkspaceProvider'

function renderProduct(path = '/world') {
  window.history.pushState({}, '', path)
  return render(
    <BrowserRouter>
      <PreferencesProvider>
        <WorkspaceProvider>
          <App />
        </WorkspaceProvider>
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
    expect(screen.getByRole('complementary', { name: /افزایش بازرسی کشتی‌ها/ })).toBeInTheDocument()
    expect(screen.getByText('چرا مهم است؟')).toBeInTheDocument()
  })

  it('shows a clear restricted Data Management state for viewers', () => {
    localStorage.clear()
    renderProduct('/data')

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'این بخش برای نقش فعلی در دسترس نیست',
    )
  })
})
