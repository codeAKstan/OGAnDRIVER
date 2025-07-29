import { UserPlus, Car, CreditCard } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up as a Customer",
      description: "Create your account and complete your profile to get started with our platform.",
    },
    {
      icon: Car,
      title: "Add Vehicle / Search for Vehicle",
      description: "Browse our extensive collection of tricycles or list your own vehicle for others.",
    },
    {
      icon: CreditCard,
      title: "Track Payments & Receive Notifications",
      description: "Monitor your transactions and stay updated with real-time notifications.",
    },
  ]

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-orange-500">OGANDRIVER</span> Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
