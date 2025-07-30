"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="OGA Driver Logo"
              width={154}
              height={154}
              className="object-contain"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/hire-rent" className="text-gray-300 hover:text-white transition-colors">
              Hire & Rent
            </Link>
            <Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors">
              Testimonials
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact Us
            </Link>

            <Link
              href="/signup"
              className="bg-gray-800 text-white rounded-full px-4 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors"
            >
              <span>Get Started Today</span>
              <Plus className="w-4 h-4" />
            </Link>
          </nav>

          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/hire-rent" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hire & Rent
              </Link>
              <Link 
                href="/testimonials" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                href="/signup"
                className="bg-gray-800 text-white rounded-full px-4 py-2 flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Get Started Today</span>
                <Plus className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}