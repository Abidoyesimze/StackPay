import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DemoPage } from './pages/DemoPage'
import { WidgetPage } from './pages/WidgetPage'
import { Layout } from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DemoPage />} />
          <Route path="/widget" element={<WidgetPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
