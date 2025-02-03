"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from "embla-carousel-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@radix-ui/themes"
import { ProductCategory } from "@medusajs/client-types"

interface CategoryProps {
  categories: ProductCategory[]
}
export function CategoryCarousel({ categories }: CategoryProps) {
  const [activeTab, setActiveTab] = React.useState("clothing")

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  })
  const [tabsRef, tabsApi] = useEmblaCarousel({
    align: "start",
    containScroll: "keepSnaps",
    dragFree: true,
  })
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(true)
  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
    if (tabsApi) tabsApi.scrollPrev()
  }, [emblaApi, tabsApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
    if (tabsApi) tabsApi.scrollNext()
  }, [emblaApi, tabsApi])

  const updateScrollButtonVisibility = React.useCallback(() => {
    if (emblaApi) {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }
  }, [emblaApi])

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", updateScrollButtonVisibility)
      updateScrollButtonVisibility()
    }
    return () => {
      if (emblaApi) {
        emblaApi.off("select", updateScrollButtonVisibility)
      }
    }
  }, [emblaApi, updateScrollButtonVisibility])

  const activeCategory = categories.find(
    (category) => category.name === activeTab
  )

  return (
    <div className="relative overflow-hidden">
      <div className="pb-8 lg:mx-20 mx-10 md:mx-10">
        <Heading size="8">Our collections</Heading>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden px-10">
        <div className="relative">
          <div className="overflow-hidden" ref={tabsRef}>
            <div className="flex h-12 w-full space-x-6">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveTab(category.name)}
                  className={`flex-none px-4 text-base ${
                    activeTab === category.name
                      ? "border-b-2 border-black font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          {canScrollPrev && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10 h-8 w-8"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {canScrollNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10 h-8 w-8"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        {activeCategory && (
          <div className="mt-6">
            <Link
              href={"/categories/" + activeCategory.handle}
              className="block"
            >
              <div className="aspect-[2/3] relative overflow-hidden">
                <Image
                  src={"/images/collection/arte-antwerp/arte-header.png"}
                  alt={activeCategory.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-normal text-white">
                    {activeCategory.name}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="relative hidden lg:block ml-20">
        <div className="overflow-visible" ref={emblaRef}>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={"/categories/" + category.handle}
                className="relative flex-[0_0_calc(20%-24px)] min-w-0 group"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={"/images/collection/arte-antwerp/arte-header.png"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-30" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-normal text-white">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {canScrollPrev && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous categories</span>
          </Button>
        )}
        {canScrollNext && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-20 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full shadow-lg z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next categories</span>
          </Button>
        )}
      </div>
    </div>
  )
}

