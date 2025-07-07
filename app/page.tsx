import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Shield,
  BarChart3,
  Car,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Users,
  TrendingUp,
  Play,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"], // We'll use the bold weight
});
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo.webp" alt="OGAnDRIVER" width={74} height={60} />
            {/* <span className="text-xl font-bold font-mono">
              <span className="text-black">OGA</span>
              <span className="text-orange-600 text-xs align-middle">n</span>
              <span className="text-black">DRIVER</span>
            </span> */}
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors scroll-smooth">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-orange-600 transition-colors scroll-smooth">
              How it Works
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition-colors scroll-smooth">
              Testimonials
            </a>
            <Link href="/login" className="text-gray-600 hover:text-orange-600 transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              opacity: 0.1,
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Manage Your Fleet
                  <br />
                  <span className="text-orange-500">Maximize Profits</span>
                </h1>

                <div className="flex items-center space-x-3 text-white/90">
                  <Users className="w-6 h-6 text-orange-500" />
                  <span className="text-xl font-medium">Smart Driver-Owner Partnerships</span>
                </div>

                <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                  Revolutionary platform enabling seamless vehicle fleet management and driver partnerships. Connect
                  with reliable drivers, track payments automatically, and grow your business with data-driven insights
                  in the Nigerian transportation market.
                </p>
              </div>

              {/* Feature Icons */}
              <div className="grid grid-cols-3 gap-6 py-8">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-orange-500 font-semibold text-sm">Payment</p>
                    <p className="text-white/80 text-sm">Tracking</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-orange-500 font-semibold text-sm">Risk</p>
                    <p className="text-white/80 text-sm">Assessment</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-orange-500 font-semibold text-sm">Fleet</p>
                    <p className="text-white/80 text-sm">Analytics</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Car className="w-5 h-5 mr-2" />
                  Start Managing Fleet
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold bg-transparent"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Analytics Demo
                </Button>
              </div>
            </div>

            {/* Right Content - Vehicle Image */}
            {/* Right Content - Vehicle Image */}
            <div className="relative min-h-[400px]"> {/* Added min-height to ensure container has space */}
              {/* Position the image container absolutely to the right edge */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-0">
                <Image
                  src="/hero.png"
                  alt="OGAnDRIVER Vehicle"
                  width={650}
                  height={520}
                  className="drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Floating Elements will remain positioned relative to the main container */}
              <div className="absolute bottom-1 left-10  bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-sm rounded-lg py-1 px-4 border border-white/20 z-10">
                <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="absolute bottom-1 right-12 bg-white backdrop-blur-sm rounded-lg p-4 border border-white/20 z-10">
                <div className="flex items-center space-x-2 text-black">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">Empowering Nigerian Fleet Owners</span>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full blur-3xl transform scale-150"></div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Vehicle Owners Choose <span className="font-mono">
              <span className="text-black">OGA</span>
              <span className="text-orange-600 text-xs align-middle">n</span>
              <span className="text-black">DRIVER</span>
            </span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop relying on notebooks and guesswork. Manage your fleet with modern tools designed for Nigerian vehicle
              owners.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-100 hover:border-orange-200 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Payment Tracking</h3>
                <p className="text-gray-600">
                  No more notebooks. See all payments in real-time and get automatic alerts for overdue accounts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-orange-200 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Data-Driven Risk Score</h3>
                <p className="text-gray-600">
                  Don't guess. Our smart algorithm helps you assess a driver's reliability before you hand over the
                  keys.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-orange-200 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">All Your Vehicles in One Place</h3>
                <p className="text-gray-600">Manage your entire fleet, from Keke to Korope, on one simple dashboard.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in minutes with our simple 4-step process</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Account",
                description: "Sign up in minutes with your basic information",
              },
              {
                step: "2",
                title: "Add Your Vehicles",
                description: "List the assets in your fleet with photos and details",
              },
              {
                step: "3",
                title: "Assess & Assign Drivers",
                description: "Use our risk score to make smart choices",
              },
              {
                step: "4",
                title: "Track Your Earnings",
                description: "Watch your investment grow with real-time analytics",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Vehicle Owners Say</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Since using Oga Driver, I've reduced my defaults by 70%. I finally have peace of mind.",
                author: "Chinedu O.",
                location: "Vehicle Owner in Enugu",
                rating: 5,
              },
              {
                quote:
                  "The risk scoring system helped me avoid a driver who would have cost me ₦200,000. Worth every kobo!",
                author: "Fatima A.",
                location: "Fleet Owner in Kano",
                rating: 5,
              },
              {
                quote: "I can now manage 15 vehicles from my phone. My business has never been more organized.",
                author: "Emeka N.",
                location: "Transport Business Owner in Lagos",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 border-gray-100">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Vehicle Business?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of vehicle owners who are already using  
            <span className="font-mono">
              <span className="text-black"> OGA</span>
              <span className="text-white text-xs align-middle">n</span>
              <span className="text-black">DRIVER</span>
            </span> to grow their business safely and
            efficiently.
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg">
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Image src="/logo.webp" alt="OGAnDRIVER" width={60} height={60} />
                <span className="text-white">OGA</span>
              <span className="text-orange-600 text-xs align-middle">n</span>
              <span className="text-white">DRIVER</span>
              </div>
              <p className="text-gray-400">
                Empowering Nigerian vehicle owners with smart technology for better fleet management and driver
                partnerships.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} <span className="font-mono">
              <span className="text-gray-400">OGA</span>
              <span className="text-orange-600 text-xs align-middle">n</span>
              <span className="text-gray-400">DRIVER</span>
            </span>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
