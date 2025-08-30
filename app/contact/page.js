"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Users, 
  Headphones,
  Building,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  ChevronDown
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    inquiryType: "general",
    subject: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        inquiryType: "general",
        subject: "",
        message: ""
      })
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000)
    }, 2000)
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      contact: "+234 800 123 4567",
      subtext: "Mon-Fri, 8AM-6PM WAT",
      action: "tel:+2348001234567"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us a detailed message",
      contact: "support@ogadriver.com",
      subtext: "We respond within 24 hours",
      action: "mailto:support@ogadriver.com"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help",
      contact: "Start Chat",
      subtext: "Available 24/7",
      action: "#"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come to our office",
      contact: "Enugu, Nigeria",
      subtext: "By appointment only",
      action: "#"
    }
  ]

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "hire", label: "Vehicle Hire/Rent" },
    { value: "purchase", label: "Vehicle Purchase" },
    { value: "partnership", label: "Partnership" },
    { value: "support", label: "Technical Support" },
    { value: "complaint", label: "Complaint" }
  ]

  const faqs = [
    {
      question: "Is OGADRIVER free to use?",
      answer: "Yes, OGADRIVER is completely free to download and use. We believe in making transportation accessible to everyone."
    },
    {
      question: "How do I apply for a Keke as a driver?",
      answer: "Simply download our app, complete your profile, submit required documents, and apply for available Keke in your area. Our team will review and get back to you within 24 hours."
    },
    {
      question: "How do I track driver payments as an Oga?",
      answer: "Our platform provides real-time payment tracking, automated reminders, and detailed financial reports to help you monitor all driver payments efficiently."
    },
    {
      question: "What if I miss a payment as a driver?",
      answer: "Don't worry! Our system sends automatic reminders before due dates. If you miss a payment, you can easily catch up through the app with flexible payment options."
    },
    {
      question: "Can I use this platform on my phone?",
      answer: "Absolutely! OGADRIVER is available as a mobile app for both Android and iOS devices, making it easy to manage your transportation business on the go."
    }
  ]

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="text-orange-500">Touch</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Have questions? Need support? Want to partner with us? We're here to help you every step of the way.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon
                return (
                  <Link 
                    key={index} 
                    href={method.action}
                    className="bg-[#1A1A1A] p-6 rounded-lg text-center hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{method.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{method.description}</p>
                    <div className="bg-[#252525] p-2 rounded">
                      <p className="text-orange-500 font-semibold mb-1">{method.contact}</p>
                      <p className="text-gray-500 text-xs">{method.subtext}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Office Info */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Send Us a <span className="text-orange-500">Message</span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                {submitStatus === 'success' && (
                  <div className="bg-green-900 border border-green-500 text-green-200 p-4 rounded-lg mb-6">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-white mb-2 block">
                        Full Name*
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="bg-[#252525] border-[#FF612859] text-white focus:border-orange-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailAddress" className="text-white mb-2 block">
                        Email Address*
                      </Label>
                      <Input
                        id="emailAddress"
                        name="emailAddress"
                        type="email"
                        required
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        className="bg-[#252525] border-[#FF612859] text-white focus:border-orange-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phoneNumber" className="text-white mb-2 block">
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="bg-[#252525] border-[#FF612859] text-white focus:border-orange-500"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquiryType" className="text-white mb-2 block">
                        Inquiry Type*
                      </Label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        required
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full bg-[#252525] border border-[#FF612859] text-white rounded-md px-3 py-2 focus:border-orange-500"
                      >
                        {inquiryTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-white mb-2 block">
                      Subject*
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-[#252525] border-[#FF612859] text-white focus:border-orange-500"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-white mb-2 block">
                      Message*
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="bg-[#252525] border-[#FF612859] text-white focus:border-orange-500 resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black py-3 text-lg font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
              
              {/* Office Information */}
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Our <span className="text-orange-500">Offices</span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Visit us at any of our locations across Nigeria.
                </p>
                
                <div className="bg-[#252525] p-6 rounded-lg mb-8">
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 mt-1 text-orange-500" />
                      <div>
                        <p className="font-semibold text-white">123 Odenigwe Lane,</p>
                        <p>Nsukka, Enugu, Nigeria</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-orange-500" />
                      <span>+234 801 234 5678</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-orange-500" />
                      <span>enugu@ogadriver.com</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-orange-500" />
                      <span>Mon-Fri: 8AM-6PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                We know you've got <span className="text-orange-500">questions</span>
              </h2>
              <p className="text-gray-400">
                Here are some of the most common questions we get asked. Can't find what you're looking for? Get in touch!
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[#252525] rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {expandedFaq === index ? (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-black"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Plus className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}