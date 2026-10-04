import HeroBuilder from '../components/home/HeroBuilder'
import ServicesRibbon from '../components/home/ServicesRibbon'
import ProcessJourney from '../components/home/ProcessJourney'
import WorkPanels from '../components/home/WorkPanels'
import CityTeaser from '../components/home/CityTeaser'
import Commitments from '../components/home/Commitments'
import CareGarden from '../components/home/CareGarden'
import FinalCTA from '../components/home/FinalCTA'
import { usePageMeta, pageMeta } from '../lib/seo'

/**
 * Homepage. Every section shows rather than tells:
 * a product assembling itself, the services as moving illustrations, the
 * process as a road you travel by scrolling, the work as panels that open,
 * the sectors as a city, the commitments as cards that turn over, and the
 * care plans as a garden that grows. Then the closing call to action.
 */
const Home = () => {
  usePageMeta(pageMeta.home)

  return (
    <>
      <HeroBuilder />
      <ServicesRibbon />
      <ProcessJourney />
      <WorkPanels />
      <CityTeaser />
      <Commitments />
      <CareGarden />
      <FinalCTA />
    </>
  )
}

export default Home
