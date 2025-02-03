"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { Heading } from "@radix-ui/themes"

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
  {
    id: 7,
    image: "/images/inst-test.png",
    link: "https://instagram.com/p/6",
    alt: "Black leather goods on white background",
  },
]

export function InstagramCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section className="">
        <Heading size="8" className={"ml-20"}>Captures @younithyofficial</Heading>
        <div className="relative mt-6 items-center">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-2">
              {instagramPosts.map((post) => (
                <Link
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex-[0_0_280px] min-w-0 group"
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
          <div className="px-20 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-22 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous posts</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-22 mr-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next posts</span>
          </Button>
          </div>
        </div>
    </section>
  )
}

