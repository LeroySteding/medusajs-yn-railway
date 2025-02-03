"use client"
import * as React from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"
import { MobileNav } from "@/components/header/mobile-nav"
import { Navigation } from "@/components/header/Navigation"
import { StoreProductCategory } from "@medusajs/types"

interface SiteHeaderProps {
  isScrolled?: boolean;
  categories: StoreProductCategory[];
}
export const SiteHeader: React.FC<SiteHeaderProps> = ({ categories }) => {

    const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white border-b text-black" : "bg-transparent text-white"}`}
    >
      <div className="flex items-center justify-between  px-20 py-8 w-full">
        <MobileNav />
        <div className="flex">
          <Link href="/" className="text-md  font-bold">
            {!isScrolled ? (
              <Logo
                colorY="#ffffff"
                colorO="#ffffff"
                colorU="#ffffff"
                colorN="#ffffff"
                colorI="#ffffff"
                colorT="#ffffff"
                colorH="#ffffff"
                colorY2="#C73C35"
                className="w-48"
              />
            ) : (
              <Logo
                colorY="#000000"
                colorO="#000000"
                colorU="#000000"
                colorN="#000000"
                colorI="#000000"
                colorT="#000000"
                colorH="#000000"
                colorY2="#C73C35"
                className="w-48"
              />
            )}
          </Link>
        </div>
        <div className="hidden lg:flex">
            <Navigation isScrolled={isScrolled} categories={categories}/>
        </div>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className={`relative h-12 w-12  ${isScrolled ? "text-black" : "text-white"}`}
          >
            <ShoppingBag className="h-20 w-20" />
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
