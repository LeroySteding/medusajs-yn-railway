import Image from "next/image"
import Link from "next/link"
import { Heading } from "@radix-ui/themes"
import { Button } from "@/components/ui/button"

const brands = [
  {
    name: "EDWIN",
    image: "/images/collection/edwin/edwin-header.jpg",
    href: "/collections/flaneur",
  },
  {
    name: "Flaneur",
    image: "/images/collection/flaneur/flaneur-header.png",
    href: "/collections/flaneur",
  },
  {
    name: "OLAF",
    image: "/images/collection/olaf/olaf-header.jpg",
    href: "/collections/flaneur",
  },
  {
    name: "NN.07",
    image: "/images/collection/nn07/nn07-header.jpg",
    href: "/collections/flaneur",
  },
]

export function FeaturedBrands() {
  return (
    <section className="mx-20">
      <div className="flex items-center justify-between pb-8">
        <Heading size="8">Featured Brands</Heading>
        <Button variant="secondary" className="rounded-full">
          Discover all
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[800px]">
        {/* Large brand - Arc'teryx */}
        <Link
          href={brands[0].href}
          className="relative w-full h-full overflow-hidden group"
        >
          <Image
            src={brands[0].image}
            alt={brands[0].name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 className="text-3xl md:text-4xl font-normal text-white">{brands[0].name}</h3>
          </div>
        </Link>

        {/* Right column grid */}
        <div className="grid grid-rows-2 gap-4 h-full">
          {/* Large brand - New Balance */}
          <Link
            href={brands[1].href}
            className="relative w-full h-full overflow-hidden group"
          >
            <Image
              src={brands[1].image}
              alt={brands[1].name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-30" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl md:text-4xl font-normal text-white">{brands[1].name}</h3>
            </div>
          </Link>

          {/* Two smaller brands */}
          <div className="grid grid-cols-2 gap-4 h-full">
            {brands.slice(2).map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="relative w-full h-full overflow-hidden group"
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-30" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl md:text-2xl font-normal text-white">{brand.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

