import Header from "@/components/Header"
import AboutUs from "@/components/AboutUs"
import Footer from "@/components/Footer"

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20">
        <AboutUs />
        <Footer />
      </div>
    </div>
  )
}