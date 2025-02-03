"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    title: "Clothing",
    image: "/placeholder.svg?height=600&width=400",
    href: "/categories/clothing",
  },
  {
    title: "Jewellery",
    image: "/placeholder.svg?height=600&width=400",
    href: "/categories/jewellery",
  },
  {
    title: "Footwear",
    image: "/placeholder.svg?height=600&width=400",
    href: "/categories/footwear",
  },
  {
    title: "Lifestyle",
    image: "/placeholder.svg?height=600&width=400",
    href: "/categories/lifestyle",
  },
  {
    title: "Sneakers",
    image: "/placeholder.svg?height=600&width=400",
    href: "/categories/sneakers",
  },
]

export function CategoryGrid() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-normal">Your lifestyle boutique</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="relative group block"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-30" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-normal text-white">{category.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

