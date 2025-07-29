import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import ProductShowcase from "@/components/ProductShowcase"
import HirePurchase from "@/components/HirePurchase"
import HowItWorks from "@/components/HowItWorks"
import Testimonials from "@/components/Testimonials"
import FAQ from "@/components/FAQ"
import Newsletter from "@/components/Newsletter"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <Features />
      <ProductShowcase />
      <HirePurchase />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  )
}
