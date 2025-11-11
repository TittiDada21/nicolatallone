import { Navigate, Route, Routes } from 'react-router-dom'

import { ExternalRedirect } from '@/components/common/ExternalRedirect'
import { CONTENT_ROUTES } from '@/data/navigation'
import { AppLayout } from '@/layouts/AppLayout'
import { GalleryPage } from '@/pages/Gallery/GalleryPage'
import { ContentPage } from '@/pages/Content/ContentPage'
import { HomePage } from '@/pages/Home/HomePage'
import { AuthProvider } from '@/providers/AuthProvider'
import { EventProvider } from '@/providers/EventProvider'

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            {CONTENT_ROUTES.map(({ key, path }) => (
              <Route key={path} path={path} element={<ContentPage pageKey={key} />} />
            ))}
            <Route path="/galleria" element={<GalleryPage />} />
            <Route path="/silarte" element={<ExternalRedirect href="https://silarte.org" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </EventProvider>
    </AuthProvider>
  )
}

export default App

