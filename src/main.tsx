import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import 'iconsax'

import { App } from '@/app/App'
import { PreferencesProvider, usePreferences } from '@/app/PreferencesProvider'
import { DirectionProvider } from '@/components/ui/direction'
import { WorkspaceProvider } from '@/app/WorkspaceProvider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import '@/styles/index.css'

const root = document.getElementById('root')

function ProductDirectionProvider({ children }: { children: ReactNode }) {
  const { locale } = usePreferences()
  return <DirectionProvider dir={locale === 'fa' ? 'rtl' : 'ltr'}>{children}</DirectionProvider>
}

if (!root) {
  throw new Error('Root element was not found')
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <PreferencesProvider>
        <ProductDirectionProvider>
          <TooltipProvider delayDuration={300}>
            <WorkspaceProvider>
              <App />
              <Toaster position="bottom-center" />
            </WorkspaceProvider>
          </TooltipProvider>
        </ProductDirectionProvider>
      </PreferencesProvider>
    </BrowserRouter>
  </StrictMode>,
)
