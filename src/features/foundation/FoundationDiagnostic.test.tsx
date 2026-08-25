import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { App } from '@/app/App'
import { PreferencesProvider } from '@/app/PreferencesProvider'

describe('foundation diagnostic', () => {
  it('starts Persian RTL and can verify the English LTR foundation', async () => {
    window.history.pushState({}, '', '/foundation')
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <PreferencesProvider>
          <App />
        </PreferencesProvider>
      </BrowserRouter>,
    )

    expect(document.documentElement).toHaveAttribute('lang', 'fa-IR')
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('بنیاد فنی')

    await user.click(screen.getByRole('button', { name: 'نمایش انگلیسی' }))

    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('technical foundation')
  })
})
