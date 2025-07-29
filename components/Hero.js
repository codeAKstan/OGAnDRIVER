import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trusted Hire <span className="text-orange-500">Purchase</span> Platform
            <br />
            for Brand New Tricycle (Keke)
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Stay Accurate, Informed, Fast and Reliable. Discover the Cheapest, Transparent, Friendly and Stress-free
            Keke Ogbon Experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 rounded-lg text-lg bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Image
            src="/hero-img.svg?height=400&width=800"
            alt="People in tricycle"
            width={800}
            height={400}
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
