"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"

const instagramPosts = [
  {
    id: 1,
    image: "/images/inst-test.png",
    link: "https://instagram.com/p/1",
    alt: "Store entrance with wreath and bicycle",
  },
  {
    id: 2,
    image: "/images/inst-test.png",
    link: "https://instagram.com/p/2",
    alt: "Person wearing red t-shirt",
  },
  {
    id: 3,
    image: "/images/inst-test.png",
    link: "https://instagram.com/p/3",
    alt: "Striped button-down shirt",
  },
  {
    id: 4,
    image: "/images/inst-test.png",
    link: "https://instagram.com/p/4",
    alt: "Artistic window display",
  },
  {
    id: 5,
    image: "/images/inst-test.png",
    link: "https://instagram.com/p/5",
    alt: "Person browsing retail shelves",
  },
  {
    id: 6,
    image: "/images/inst-test.png",
    link: "https://instagram.com/p/6",
    alt: "Black leather goods on white background",
  },
]

export function InstagramFeed() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section className="py-12 md:py-24">
      <div className="container">
        <h2 className="text-4xl mb-12">Moments captured with @basketsstores</h2>
        
        {/* Mobile Carousel */}
        <div className="relative md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {instagramPosts.map((post) => (
                <Link
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex-[0_0_85%] min-w-0 pl-4 first:pl-0 group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous posts</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next posts</span>
          </Button>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <Link
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

