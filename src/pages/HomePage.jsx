import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { GallerySection } from '@/components/sections/GallerySection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <GallerySection />
      <PortfolioSection />
      <ContactSection />
    </>
  )
}
