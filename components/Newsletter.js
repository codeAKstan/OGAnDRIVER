import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function Newsletter() {
  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="bg-orange-500 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Updates</h2>
              <p className="text-white/90 mb-6">
                Stay informed about new vehicles, special offers, and platform updates. Subscribe to our newsletter for
                the latest news and exclusive deals.
              </p>
              <div className="flex gap-4">
                <Input type="email" placeholder="Enter your email" className="bg-white text-black flex-1" />
                <Button className="bg-black text-white hover:bg-gray-800 px-8">Subscribe</Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/complete.png?height=300&width=400"
                alt="Newsletter signup"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
