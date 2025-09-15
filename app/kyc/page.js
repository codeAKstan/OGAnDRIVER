"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Shield,
  Clock
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function KYCPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationality: "Nigerian",
    
    // Contact Information
    phoneNumber: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    
    // Identification
    idType: "",
    idNumber: "",
    
    // Driver Information
    licenseNumber: "",
    licenseExpiry: "",
    yearsOfExperience: "",
    
    // Emergency Contact
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelationship: "",
    
    // Additional Information
    previousEmployment: "",
    criminalRecord: "no",
    medicalConditions: ""
  })

  useEffect(() => {
    // Check if user is logged in and has the right role
    const userData = localStorage.getItem('user')
    const userRole = localStorage.getItem('userRole')
    
    if (!userData || userRole !== 'DRIVER') {
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Pre-fill some data from user registration
    setFormData(prev => ({
      ...prev,
      phoneNumber: parsedUser.phone_number || ""
    }))
    
    setLoading(false)
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.dateOfBirth && formData.gender && formData.nationality
      case 2:
        return formData.phoneNumber && formData.address && formData.city && formData.state
      case 3:
        return formData.idType && formData.idNumber && formData.licenseNumber
      case 4:
        return formData.emergencyName && formData.emergencyPhone && formData.emergencyRelationship
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
      setMessage({ type: "", text: "" })
    } else {
      setMessage({ type: "error", text: "Please fill in all required fields" })
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setMessage({ type: "", text: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })
    
    try {
      // Simulate API call for KYC submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMessage({ 
        type: "success", 
        text: "KYC information submitted successfully! Your application is under review." 
      })
      
      // Redirect to driver dashboard after successful submission
      setTimeout(() => {
        router.push('/driver-dashboard')
      }, 3000)
      
    } catch (error) {
      console.error('KYC submission error:', error)
      setMessage({ type: "error", text: "Failed to submit KYC information. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading KYC form...</p>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth" className="text-white mb-2 block">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                />
              </div>
              
              <div>
                <Label htmlFor="gender" className="text-white mb-2 block">Gender *</Label>
                <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maritalStatus" className="text-white mb-2 block">Marital Status</Label>
                <Select onValueChange={(value) => handleSelectChange('maritalStatus', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="nationality" className="text-white mb-2 block">Nationality *</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  type="text"
                  required
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber" className="text-white mb-2 block">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
              
              <div>
                <Label htmlFor="alternatePhone" className="text-white mb-2 block">Alternate Phone</Label>
                <Input
                  id="alternatePhone"
                  name="alternatePhone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address" className="text-white mb-2 block">Home Address *</Label>
              <Textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                placeholder="Enter your full address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-white mb-2 block">City *</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                />
              </div>
              
              <div>
                <Label htmlFor="state" className="text-white mb-2 block">State *</Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Identification & License</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idType" className="text-white mb-2 block">ID Type *</Label>
                <Select onValueChange={(value) => handleSelectChange('idType', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nin">National ID (NIN)</SelectItem>
                    <SelectItem value="passport">International Passport</SelectItem>
                    <SelectItem value="voters_card">Voter's Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="idNumber" className="text-white mb-2 block">ID Number *</Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  required
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber" className="text-white mb-2 block">Driver's License Number *</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  required
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                />
              </div>
              
              <div>
                <Label htmlFor="licenseExpiry" className="text-white mb-2 block">License Expiry Date</Label>
                <Input
                  id="licenseExpiry"
                  name="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="yearsOfExperience" className="text-white mb-2 block">Years of Driving Experience</Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
              />
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
            
            <div>
              <Label htmlFor="emergencyName" className="text-white mb-2 block">Full Name *</Label>
              <Input
                id="emergencyName"
                name="emergencyName"
                type="text"
                required
                value={formData.emergencyName}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyPhone" className="text-white mb-2 block">Phone Number *</Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  required
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyRelationship" className="text-white mb-2 block">Relationship *</Label>
                <Select onValueChange={(value) => handleSelectChange('emergencyRelationship', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )
      
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
            
            <div>
              <Label htmlFor="previousEmployment" className="text-white mb-2 block">Previous Employment (Optional)</Label>
              <Textarea
                id="previousEmployment"
                name="previousEmployment"
                value={formData.previousEmployment}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                placeholder="Describe your previous work experience"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="criminalRecord" className="text-white mb-2 block">Do you have any criminal record?</Label>
              <Select onValueChange={(value) => handleSelectChange('criminalRecord', value)}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="medicalConditions" className="text-white mb-2 block">Medical Conditions (Optional)</Label>
              <Textarea
                id="medicalConditions"
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-700 text-white focus:border-orange-500"
                placeholder="Any medical conditions that might affect driving"
                rows={3}
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="OGA Driver Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-400">Secure KYC Process</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Complete Your <span className="text-orange-500">KYC Verification</span>
            </h1>
            <p className="text-gray-400">
              Welcome {user?.first_name}! Please complete your Know Your Customer (KYC) verification to start driving.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {currentStep} of 5</span>
              <span className="text-sm text-gray-400">{Math.round((currentStep / 5) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg border flex items-center space-x-2 mb-6 ${
              message.type === "success" 
                ? "bg-green-900/20 border-green-500 text-green-400" 
                : "bg-red-900/20 border-red-500 text-red-400"
            }`}>
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* KYC Form */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                KYC Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                All information provided will be kept confidential and secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={currentStep === 5 ? handleSubmit : (e) => e.preventDefault()}>
                {renderStep()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  
                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-orange-500 hover:bg-orange-600 text-black"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-black"
                    >
                      {isSubmitting ? "Submitting..." : "Submit KYC"}
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="flex items-center justify-center">
              <Shield className="w-4 h-4 mr-2" />
              Your information is encrypted and secure. We comply with all data protection regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}