import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import 'iconsax'

import { App } from '@/app/App'
import { PreferencesProvider } from '@/app/PreferencesProvider'
import { WorkspaceProvider } from '@/app/WorkspaceProvider'
import '@/styles/index.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element was not found')
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <PreferencesProvider>
        <WorkspaceProvider>
          <App />
        </WorkspaceProvider>
      </PreferencesProvider>
    </BrowserRouter>
  </StrictMode>,
)
