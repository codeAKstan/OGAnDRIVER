import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Newsletter() {
  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="relative bg-orange-500 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row gap-8 p-8 md:p-12">
            {/* Left column: Image */}
            <div className="md:w-1/2 relative">
              <Image
                src="/complete.png?height=300&width=400"
                alt="Newsletter signup"
                width={400}
                height={300}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Right column: Text and form */}
            <div className="md:w-1/2 bg-orange-500 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Updates</h2>
              <p className="text-white/90 mb-6">
                Get updates on new Keke listings, platform upgrades and tips to grow your hustle straight to your inbox. No spamming, just value.
              </p>

              {/* Input + Button with gap */}
              <div className="flex items-center gap-3">
                {/* Input: fully rounded */}
                <Input
                  type="email"
                  placeholder="Enter email here"
                  className="bg-white/20 text-gray-200 placeholder:text-gray-200 border-0 
                             rounded-l-2xl py-8 px-2 flex-1 
                             focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                {/* Button: rounded only on right */}
                <Button 
                  className="bg-black text-white hover:bg-gray-800 
                             px-2 py-8 rounded-r-2xl rounded-l-none
                             flex items-center gap-1"
                >
                  Subscribe Now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}