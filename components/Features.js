import Image from "next/image"

export default function Features() {
  const features = [
    {
      icon: "/stat.png",
      title: "Track Payment in Real Time",
      description:
        "Monitor your payment progress with real-time tracking and transparent updates throughout the process.",
    },
    {
      icon: "/search.png",
      title: "Get Started with Real Quick",
      description: "Quick and easy onboarding process to get you started with your tricycle hire or purchase journey.",
    },
    {
      icon: "/shield.png",
      title: "Professional Service for All Prices",
      description: "Premium quality service regardless of your budget, ensuring satisfaction for every customer.",
    },
  ]

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Know More About
            <br />
            Our Key <span className="text-orange-500">Features</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover what makes OGANDRIVER the preferred choice for tricycle hire and purchase services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 border border-gray-800 rounded-lg hover:border-orange-500 transition-colors"
            >
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Image 
                  src={feature.icon} 
                  alt={feature.title}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}