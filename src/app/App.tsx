import { Navigate, Route, Routes } from 'react-router'

import { AppShell } from '@/components/product/AppShell'
import { CountriesPage } from '@/features/countries/CountriesPage'
import { IntelligenceDetailPage } from '@/features/details/IntelligenceDetailPage'
import { FoundationDiagnostic } from '@/features/foundation/FoundationDiagnostic'
import { MarketsPage } from '@/features/markets/MarketsPage'
import {
  DataManagementPage,
  DevelopmentsPage,
  ReportsPage,
} from '@/features/pages/ProductPages'
import { SecurityAssessmentPage } from '@/features/security/SecurityAssessmentPage'
import { SecurityPage } from '@/features/security/SecurityPage'
import { WorldMonitorPage } from '@/features/world/WorldMonitorPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/world" replace />} />
      <Route element={<AppShell />}>
        <Route path="/world" element={<WorldMonitorPage />} />
        <Route path="/developments" element={<DevelopmentsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/security/assessment" element={<SecurityAssessmentPage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/data" element={<DataManagementPage />} />
        <Route path="/details/:kind/:id" element={<IntelligenceDetailPage />} />
      </Route>
      <Route path="/foundation" element={<FoundationDiagnostic />} />
      <Route path="*" element={<Navigate to="/world" replace />} />
    </Routes>
  )
}
