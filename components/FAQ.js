"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Is OGANDRIVER free to use?",
      answer: "Yes, creating an account and browsing vehicles is free. We only charge when you complete a transaction.",
    },
    {
      question: "How do I apply for a Keke as a driver?",
      answer:
        "Simply sign up, complete your profile, submit required documents, and apply for available vehicles in your area.",
    },
    {
      question: "How do I track driver payments as an Oga?",
      answer:
        "Our dashboard provides real-time payment tracking, notifications, and detailed transaction history for all your vehicles.",
    },
    {
      question: "What if I miss a payment as a driver?",
      answer:
        "We offer flexible payment plans and will work with you to find a solution. Contact our support team immediately.",
    },
    {
      question: "Can I use the platform on my phone?",
      answer: "Yes, our platform is fully mobile-responsive and we also have mobile apps available for download.",
    },
  ]

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            We know you've
            <br />
            got <span className="text-orange-500">questions</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Here are some of the most common questions we get about our platform and services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-800 last:border-b-0">
              <button
                className="w-full py-6 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-white font-medium pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="pb-6">
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
