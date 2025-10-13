import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DemoPage } from './pages/DemoPage'
import { WidgetPage } from './pages/WidgetPage'
import { HomePage } from './pages/HomePage'
import { Layout } from './components/Layout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<Layout><DemoPage /></Layout>} />
        <Route path="/widget" element={<Layout><WidgetPage /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
