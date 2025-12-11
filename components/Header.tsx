"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#2B2F33]/80 backdrop-blur-md border-b border-[#E1E5E8] dark:border-[#2E485C]">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0">
              <Image src="/logo-color.png" alt="Pulse Fitness" fill className="object-contain" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#1D71B1] dark:text-[#ffffff]">
              Pulse Fitness
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#features" className="text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] transition-colors">
              Características
            </Link>
            <Link href="#how-it-works" className="text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] transition-colors">
              Cómo Funciona
            </Link>
            <Link href="#benefits" className="text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] transition-colors">
              Beneficios
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2 bg-[#2D6086] hover:bg-[#1D71B1] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-[#E1E5E8] dark:border-[#2E485C] pt-4">
            <Link
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] hover:bg-[#E1E5E8]/50 dark:hover:bg-[#2E485C]/50 rounded-lg transition-colors"
            >
              Características
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] hover:bg-[#E1E5E8]/50 dark:hover:bg-[#2E485C]/50 rounded-lg transition-colors"
            >
              Cómo Funciona
            </Link>
            <Link
              href="#benefits"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] hover:bg-[#E1E5E8]/50 dark:hover:bg-[#2E485C]/50 rounded-lg transition-colors"
            >
              Beneficios
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-center text-[#2E485C] dark:text-[#E1E5E8] hover:text-[#007CDB] dark:hover:text-[#2DC086] transition-colors border border-[#E1E5E8] dark:border-[#2E485C] rounded-lg"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-center bg-[#2D6086] hover:bg-[#1D71B1] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
