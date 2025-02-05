"use client"
// Components
import { Layout, LayoutColumn } from "@/components/Layout"
import { NewsletterForm } from "@/components/NewsletterForm"
import { LocalizedLink } from "@/components/LocalizedLink"
import { InfiniteSlider } from "@/components/InfiniteSlider"
import  Image  from "next/image";
import { DivideCircleIcon } from "lucide-react"
import Logo from "./Logo"


export const Footer: React.FC = () => {
  return (
    <div className="bg-black text-white">
      <InfiniteSlider />
      <div className="grid gap-20 grid-cols-2 md:grid-cols-4 px-8 md:mx-20  py-6 md:py-20">
        <div className="hidden md:flex items-center justify-center">
        <Logo
                colorY="#ffffff"
                colorO="#ffffff"
                colorU="#ffffff"
                colorN="#ffffff"
                colorI="#ffffff"
                colorT="#ffffff"
                colorH="#ffffff"
                colorY2="#C73C35"
                className="w-56"
              />
        </div>

        <div className="flex items-center justify-center">
          <ul className="flex flex-col gap-6 md:gap-3.5  justify-center">
            <li>
              <LocalizedLink href="/returns">Retouren</LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/shipping">Verzending & Bezorging</LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/faq">Veelgestelde vragen</LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/terms-of-use">Algemene voorwaarden</LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/privacy-policy">Privacybeleid</LocalizedLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <ul className="flex  flex-col gap-6 md:gap-3.5">
            <li>
              <LocalizedLink href="/over-ons">Over ons</LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/winkel">Winkel</LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/younithy">Younithy</LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/vacatures">Vacatures</LocalizedLink>
            </li>
          </ul>
        </div>
  
      
        <div className="col-span-2 md:col-span-1 flex items-center justify-center">
        <NewsletterForm className="" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start md:justify-between mx-8 md:mx-20 pb-8">
      <ul className="flex flex-row gap-6 md:gap-3.5 text-xs mags-auto text-center mt-5">
            <li>
              <LocalizedLink href="/privacy-policy">
                Privacy Policy
              </LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/cookie-policy">
                Cookie Policy
              </LocalizedLink>
            </li>
            <li>
              <LocalizedLink href="/terms-of-use">
                Terms of Use
              </LocalizedLink>
            </li>
          </ul>

        <p className="text-xs mags-auto text-center mt-5">
          &copy; {new Date().getFullYear()}, Hifive. All rights reserved
        </p> 
       
      </div>
    </div>
  )
}
