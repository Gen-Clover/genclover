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
 * Homepage. Section order is fixed by the spec (§5.2):
 * 01 Hero · 02 Selected Work · 03 What We Do · 04 Why Gen Clover ·
 * 05 How We Work · 06 Industries · 07 Continuous Care · 08 Proof · 09 Final CTA
 */
const Home = () => {
  usePageMeta(pageMeta.home)

  return (
    <>
      <Hero />
      <SelectedWork />
      <WhatWeDo />
      <WhyGenClover />
      <HowWeWorkPreview />
      <IndustriesStrip />
      <ContinuousCare />
      <Proof />
      <FinalCTA />
    </>
  )
}

export default Home
