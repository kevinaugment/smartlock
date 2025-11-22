import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { ArticleEditorPage } from './pages/ArticleEditorPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CalculatorsPage } from './pages/CalculatorsPage'
import { PagesPage } from './pages/PagesPage'
import { SettingsPage } from './pages/SettingsPage'
import { MediaPage } from './pages/MediaPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/new" element={<ArticleEditorPage />} />
        <Route path="articles/:id" element={<ArticleEditorPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="calculators" element={<CalculatorsPage />} />
        <Route path="pages" element={<PagesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
