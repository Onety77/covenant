import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { Home } from '@/pages/Home'
import { ProjectPage } from '@/pages/Project'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="p/:id" element={<ProjectPage />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
