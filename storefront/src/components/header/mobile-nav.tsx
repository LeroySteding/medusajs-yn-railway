"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Logo from "@/components/Logo"

interface NavItem {
  title: string
  href?: string
  items?: { title: string; href: string; items?: { title: string; href: string }[] }[]
}

const navigation: NavItem[] = [
  { title: "NIEUW", href: "/nieuw" },
  {
    title: "KLEDING",
    items: [
      {
        title: "T-Shirts",
        href: "/kleding/t-shirts",
      },
      {
        title: "Sweaters",
        href: "/kleding/sweaters",
        items: [
          { title: "Crews", href: "/kleding/sweaters/crews" },
          { title: "Hoodies", href: "/kleding/sweaters/hoodies" },
          { title: "Knit", href: "/kleding/sweaters/knit" },
          { title: "Half-Zip", href: "/kleding/sweaters/half-zip" },
        ],
      },
      {
        title: "Broeken",
        href: "/kleding/broeken",
        items: [
          { title: "Trousers", href: "/kleding/broeken/trousers" },
          { title: "Sweatpants", href: "/kleding/broeken/sweatpants" },
          { title: "Zwembroek", href: "/kleding/broeken/zwembroek" },
          { title: "Korte broek", href: "/kleding/broeken/korte-broek" },
          { title: "Jeans", href: "/kleding/broeken/jeans" },
        ],
      },
      { title: "Jassen", href: "/kleding/jassen" },
      { title: "Overhemden / Shirts", href: "/kleding/overhemden-shirts" },
      { title: "Longsleeves", href: "/kleding/longsleeves" },
    ],
  },
  {
    title: "ACCESSOIRES",
    items: [
      {
        title: "Headwear",
        href: "/accessoires/headwear",
        items: [
          { title: "Petten", href: "/accessoires/headwear/petten" },
          { title: "Mutsen", href: "/accessoires/headwear/mutsen" },
          { title: "Bucket Hats", href: "/accessoires/headwear/bucket-hats" },
        ],
      },
      { title: "Zonnebrillen", href: "/accessoires/zonnebrillen" },
      { title: "Tassen", href: "/accessoires/tassen" },
      {
        title: "Sjaals / Handschoenen",
        href: "/accessoires/sjaals-handschoenen",
        items: [
          { title: "Sjaal", href: "/accessoires/sjaals-handschoenen/sjaal" },
          { title: "Handschoenen", href: "/accessoires/sjaals-handschoenen/handschoenen" },
        ],
      },
      { title: "Sokken", href: "/accessoires/sokken" },
      { title: "Riemen", href: "/accessoires/riemen" },
      { title: "Overig", href: "/accessoires/overig" },
    ],
  },
  { title: "GIFTS", href: "/gifts" },
  { title: "SALE", href: "/sale" },
  { title: "MERKEN", href: "/merken" },
  { title: "YOUNITHY", href: "/younithy" },
]

function NavItems({ items }: { items: NavItem[] }) {
  return (
    <div className="flex flex-col gap-4 h">
      {items.map((item) => (
        <div key={item.title}>
          {!item.items ? (
            <Link
              href={item.href || "#"}
              className="text-md font-medium hover:text-primary"
            >
              {item.title}
            </Link>
          ) : (
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-md font-medium hover:text-primary">
                {item.title}
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-2 flex flex-col space-y-2">
                {item.items.map((subItem) => (
                  <div key={subItem.title}>
                    {!subItem.items ? (
                      <Link
                        href={subItem.href}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {subItem.title}
                      </Link>
                    ) : (
                      <Collapsible>
                        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-primary">
                          {subItem.title}
                          <ChevronDown className="h-3 w-3" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-4 mt-2 flex flex-col space-y-2">
                          {subItem.items.map((subSubItem) => (
                            <Link
                              key={subSubItem.title}
                              href={subSubItem.href}
                              className="text-sm text-muted-foreground hover:text-primary"
                            >
                              {subSubItem.title}
                            </Link>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      ))}
    </div>
  )
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="24"
            width="24"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm bg-white">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <Logo
              colorY="#000000"
              colorO="#000000"
              colorU="#000000"
              colorN="#000000"
              colorI="#000000"
              colorT="#000000"
              colorH="#000000"
              colorY2="#C73C35"
              className="w-48 left-0"
            />

          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 overflow-y-auto">
          <NavItems items={navigation} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

