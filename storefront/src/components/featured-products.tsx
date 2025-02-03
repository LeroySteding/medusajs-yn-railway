import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heading } from "@radix-ui/themes"

const products = [
  {
    id: 1,
    name: "New Amsterdam Surf Association | Don'T Tee Seneca Rock",
    price: "€64,95",
    image: "/images/test-img.jpg",
    href: "/products/dont-tee-seneca-rock",
  },
  {
    id: 2,
    name: "New Amsterdam Surf Association After Trousers Black",
    price: "€179,95",
    image: "/images/test-img.jpg",
    href: "/products/after-trousers-black",
  },
  {
    id: 3,
    name: "New Amsterdam Surf Association Eyelets Zip Hoodie Black",
    price: "€179,95",
    image: "/images/test-img.jpg",
    href: "/products/eyelets-zip-hoodie-black",
  },
  {
    id: 4,
    name: "New Amsterdam Surf Association Lined Wool Overshirt Black",
    price: "€339,95",
    image: "/images/test-img.jpg",
    href: "/products/lined-wool-overshirt-black",
  },
]

export function FeaturedProducts() {
  return (
    <section className="mx-20">
        <div className="flex items-center justify-between pb-8">
          <Heading size="8">Explore New Amsterdam Surf Association</Heading>
          <Button variant="secondary" className="rounded-full">
            Discover all
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href="#"
              className="group"
            >
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-normal text-base leading-tight">{product.name}</h3>
                <p className="text-base">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
    </section>
  )
}

