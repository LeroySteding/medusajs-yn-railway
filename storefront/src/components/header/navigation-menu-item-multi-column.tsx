import React, { useState } from 'react';
import Link from "next/link"
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Heading } from "@radix-ui/themes"

interface NavigationMenuItemMultiColumnProps {
  href?: string;
  isScrolled?: boolean;
  trigger: React.ReactNode;
  columns: Column[];
  children?: React.ReactNode;
  textColor?: string;
  category: any;
  allCategories: any[];
}

interface Column {
  title: string;
  items: {
    label: string;
    subCategoryHref: string;
  }[];
}

export const NavigationMenuItemMultiColumn: React.FC<NavigationMenuItemMultiColumnProps> = ({
                                                                                              href,
                                                                                              isScrolled,
                                                                                              trigger,
                                                                                              columns,
                                                                                              children,
                                                                                              textColor,
                                                                                              category,
                                                                                              allCategories,
                                                                                            }) => {
  const [hoveredCategory, setHoveredCategory] = useState<any>(null);

  const getSubcategories = (category: any, allCategories: any[]) => {
    if (!category || !allCategories) return [];

    return allCategories
      .filter((child: any) => child.parent_category_id === category.id)
      .map((child: any) => ({
        label: child.name,
        subCategoryHref: `/categories/${child.handle}`,
      }));
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={`${isScrolled ? "text-black" : textColor || "text-white"}`}
      >
        <Heading size="3" className="uppercase"  weight="medium"> {trigger}</Heading>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="flex flex-row justify-between w-full mx-20 py-10">
          <div className="w-1/3 grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
            {/* First column */}
            <div className="row-span-2">
              {/*<h3 className="font-bold">{columns[0].title}</h3>*/}
              <ul className="mt-2 space-y-2">
                {columns[0].items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.subCategoryHref}
                      className="text-grayscale-400 hover:text-black block select-none space-y-1 rounded-md py-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      onMouseEnter={() => {
                        const childCategory = category.category_children.find(
                          (child: any) => child.name === item.label
                        )
                        setHoveredCategory(childCategory)
                      }}
                    >
                      <Heading size="5"> {item.label}</Heading>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Second column (subcategories) */}
            <div className="row-span-3">
              {/*<h3 className="font-bold">{hoveredCategory ? hoveredCategory.name : "Subcategorieën"}</h3>*/}
              <ul className="mt-2 space-y-2">
                {getSubcategories(hoveredCategory, allCategories).map(
                  (item: any, itemIndex: number) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.subCategoryHref}
                        className="text-black block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <Heading size="4"> {item.label}</Heading>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="w-2/3 justify-end gap-4 flex flex-row">
            {children}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
};