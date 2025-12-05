import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { ExternalRedirect } from '@/components/common/ExternalRedirect'
import { CONTENT_ROUTES } from '@/data/navigation'
import { AppLayout } from '@/layouts/AppLayout'
import { GalleryPage } from '@/pages/Gallery/GalleryPage'
import { ContentPage } from '@/pages/Content/ContentPage'
import { EventsPage } from '@/pages/Events/EventsPage'
import { HomePage } from '@/pages/Home/HomePage'
import { AlbumPage } from '@/pages/Album/AlbumPage'
import { AuthProvider } from '@/providers/AuthProvider'
import { EventProvider } from '@/providers/EventProvider'

function AppRoutes() {
  const location = useLocation()
  
  return (
    <Routes key={location.pathname}>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/eventi/:type" element={<EventsPage />} />
        <Route path="/progetti/album" element={<AlbumPage />} />
        {CONTENT_ROUTES.filter(({ key }) => !key.startsWith('eventi/') && key !== 'progetti/album').map(({ key, path }) => (
          <Route key={path} path={path} element={<ContentPage pageKey={key} />} />
        ))}
        <Route path="/galleria" element={<GalleryPage />} />
        <Route path="/silarte" element={<ExternalRedirect href="https://associazionesilarte.ch" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppRoutes />
      </EventProvider>
    </AuthProvider>
  )
}

export default App

