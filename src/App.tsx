import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { Home } from '@/pages/Home'
import { ProjectPage } from '@/pages/Project'
import { Launches } from '@/pages/Launches'
import { Verify } from '@/pages/Verify'
import { Review } from '@/pages/Review'
import { Defaults } from '@/pages/Defaults'
import { Launch } from '@/pages/Launch'
import { HowItWorks } from '@/pages/HowItWorks'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="p/:id" element={<ProjectPage />} />
          <Route path="launches" element={<Launches />} />
          <Route path="verify" element={<Verify />} />
          <Route path="verify/:id" element={<Review />} />
          <Route path="defaults" element={<Defaults />} />
          <Route path="launch" element={<Launch />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
