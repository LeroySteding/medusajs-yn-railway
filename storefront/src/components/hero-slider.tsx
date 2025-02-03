"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export interface SlideData {
  image: string
  title: string
  description?: string
  cta?: string
}

interface HeroSliderProps {
  slides: SlideData[]
  isSingleSlide?: boolean
}

export function HeroSlider({ slides, isSingleSlide = false }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  React.useEffect(() => {
    if (!isSingleSlide) {
      const timer = setInterval(nextSlide, 8000)
      return () => clearInterval(timer)
    }
  }, [isSingleSlide])

  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <div className={`relative ${isSingleSlide ? 'h-[40vh]' : 'h-[70vh]'} overflow-hidden`}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide || isSingleSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end justify-begin p-20">
            <div className="text-left text-white">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              {slide.description && <p className="text-xl mb-6">{slide.description}</p>}
              {slide.cta && (
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black">
                  {slide.cta}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
      {!isSingleSlide && slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}
    </div>
  )
}