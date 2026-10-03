import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LazyMotion, MotionConfig, domMax } from 'motion/react'
import { Shell } from '@/components/layout/Shell'
import { Home } from '@/pages/Home'
import { ProjectPage } from '@/pages/Project'
import { Verify } from '@/pages/Verify'
import { Review } from '@/pages/Review'
import { Defaults } from '@/pages/Defaults'
import { Launch } from '@/pages/Launch'
import { Rules } from '@/pages/Rules'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <LazyMotion features={domMax} strict>
      {/* reduced motion: transforms drop, fades stay; loops check useReducedMotion() themselves */}
      <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="p/:id" element={<ProjectPage />} />
          <Route path="launches" element={<Home />} />
          <Route path="verify" element={<Verify />} />
          <Route path="verify/:id" element={<Review />} />
          <Route path="defaults" element={<Defaults />} />
          <Route path="launch" element={<Launch />} />
          <Route path="rules" element={<Rules />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </MotionConfig>
    </LazyMotion>
  )
}
