import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Database, Brain, Globe, CheckCircle } from 'lucide-react'
import Hero from '../components/Hero'
import ServicesSection from '../components/ServicesSection'
import StatsSection from '../components/StatsSection'
import CTA from '../components/CTA'

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <ServicesSection />
      <StatsSection />
      <CTA />
    </div>
  )
}

export default Home

