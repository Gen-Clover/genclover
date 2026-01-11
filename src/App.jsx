import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Services from './pages/Services'
import DataEngineering from './pages/DataEngineering'
import DataScience from './pages/DataScience'
import BISolutions from './pages/BISolutions'
import WebDevelopment from './pages/WebDevelopment'
import AIBots from './pages/AIBots'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'
import Career from './pages/Career'
import JobDetail from './pages/JobDetail'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/data-engineering" element={<DataEngineering />} />
            <Route path="/services/data-science" element={<DataScience />} />
            <Route path="/services/bi-solutions" element={<BISolutions />} />
            <Route path="/services/web-development" element={<WebDevelopment />} />
            <Route path="/services/ai-bots" element={<AIBots />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/career" element={<Career />} />
            <Route path="/career/job/:id" element={<JobDetail />} />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-xl mb-8">Page not found</p>
                  <a href="/" className="text-blue-600 hover:underline">Go back home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

