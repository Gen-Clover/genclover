import Hero from '../components/home/Hero'
import SelectedWork from '../components/home/SelectedWork'
import WhatWeDo from '../components/home/WhatWeDo'
import WhyGenClover from '../components/home/WhyGenClover'
import HowWeWorkPreview from '../components/home/HowWeWorkPreview'
import IndustriesStrip from '../components/home/IndustriesStrip'
import ContinuousCare from '../components/home/ContinuousCare'
import Proof from '../components/home/Proof'
import FinalCTA from '../components/home/FinalCTA'
import { usePageMeta, pageMeta } from '../lib/seo'

/**
 * Homepage. Section order (§5.2, revised in content QA so the brand pillars
 * sit in the hero and the process is the second screen):
 * 01 Hero + pillars · 02 How We Work · 03 Selected Work · 04 What We Do ·
 * 05 Why Gen Clover · 06 Industries · 07 Continuous Care · 08 Proof · 09 Final CTA
 */
const Home = () => {
  usePageMeta(pageMeta.home)

  return (
    <>
      <Hero />
      <HowWeWorkPreview />
      <SelectedWork />
      <WhatWeDo />
      <WhyGenClover />
      <IndustriesStrip />
      <ContinuousCare />
      <Proof />
      <FinalCTA />
    </>
  )
}

export default Home
