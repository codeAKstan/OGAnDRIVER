import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HirePurchase() {
  const vehicles = [
    {
      image: "/keke1.png?height=200&width=300",
      title: "Brand New Tricycle Keke RE 2024",
      location: "Abuja, Nigeria",
      price: "₦3,500,000.00",
      features: ["New Engine", "Good Condition", "Warranty Included"],
    },
    {
      image: "/keke2.png?height=200&width=300",
      title: "Piaggio Ape City 2023",
      location: "Lagos, Nigeria",
      price: "₦800,000.00",
      features: ["Good Engine", "Fair Condition", "Tested & Verified"],
    },
    {
      image: "/keke3.png?height=200&width=300",
      title: "Brand New Tricycle Keke RE 2024",
      location: "Port Harcourt, Nigeria",
      price: "₦1,400,000.00",
      features: ["New Engine", "Excellent Condition", "Full Documentation"],
    },
    {
      image: "/keke4.png?height=200&width=300",
      title: "Brand New Tricycle Keke RE 2024",
      location: "Port Harcourt, Nigeria",
      price: "₦1,400,000.00",
      features: ["New Engine", "Excellent Condition", "Full Documentation"],
    },
    {
      image: "/keke5.png?height=200&width=300",
      title: "Brand New Tricycle Keke RE 2024",
      location: "Port Harcourt, Nigeria",
      price: "₦1,400,000.00",
      features: ["New Engine", "Excellent Condition", "Full Documentation"],
    },
    {
      image: "/keke6.png?height=200&width=300",
      title: "Brand New Tricycle Keke RE 2024",
      location: "Port Harcourt, Nigeria",
      price: "₦1,400,000.00",
      features: ["New Engine", "Excellent Condition", "Full Documentation"],
    },
  ]

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Keke for
            <br />
            Hire <span className="text-orange-500">Purchase</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {vehicles.map((vehicle, index) => (
            <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
              <Image
                src={vehicle.image || "/keke4.png"}
                alt={vehicle.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">{vehicle.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{vehicle.location}</p>
                <div className="mb-4">
                  {vehicle.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2 text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">{vehicle.price}</span>
                </div>
                <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">Apply Now</Button>
              </div>
            </div>
          ))}
        </div>

     
      </div>
    </section>
  )
}
