import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Adebayo Adebisi",
      role: "Tricycle Owner",
      content:
        "OGANDRIVER made it so easy for me to purchase my tricycle. The process was transparent and stress-free.",
      rating: 5,
    },
    {
      name: "Khadijah Abubakar",
      role: "Business Owner",
      content: "Excellent service! I was able to hire a tricycle for my business needs quickly and affordably.",
      rating: 5,
    },
    {
      name: "Chidi Okafor",
      role: "Driver",
      content: "The hire purchase option helped me start my transportation business. Highly recommended!",
      rating: 5,
    },
  ]

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What People Are <span className="text-orange-500">Saying</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
