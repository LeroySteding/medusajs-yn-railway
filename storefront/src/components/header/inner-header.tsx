import { MobileNav } from "@/components/header/mobile-nav"
import { Navigation } from "@/components/header/Navigation"
import { StoreProductCategory } from "@medusajs/types"
import CartButton from "@/components/header/cart-button"
import Logo from "../Logo"
import Link from "next/link"

interface InnerHeaderProps {
    isScrolled?: boolean;
    categories: StoreProductCategory[];
  }

export const InnerHeader: React.FC<InnerHeaderProps> = async ({ isScrolled, categories }) => {

return (
<div className="flex items-center justify-between  px-8 lg:px-20 py-8 w-full">
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
  <CartButton />
</div>
</div>
)
}