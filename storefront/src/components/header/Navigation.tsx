"use client"

import React, { useState, useEffect } from 'react';
import { listCategories } from "@lib/data/categories"
import { NavigationMenuItemMultiColumn } from "@/components/header/navigation-menu-item-multi-column"
import { NavigationFeaturedBlock } from "@/components/header/navigation-featured-block"
import { NavigationMenuItemLink } from "@/components/header/navigation-menu-item-link"
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Heading } from "@radix-ui/themes"
import { StoreProductCategory } from "@medusajs/types"

interface NavigationProps {
  isScrolled?: boolean;
  categories: StoreProductCategory[];
}

export const Navigation: React.FC<NavigationProps> = ({ isScrolled, categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState<any | null>(null);

  useEffect(() => {
    console.log('Hovered Category:', hoveredCategory);
  }, [hoveredCategory]);

  const generateMenuItems = (categories: any[]) => {
    return categories.map((category) => {
      if (!category.parent_category && category.category_children.length > 0) {
        // @ts-ignore
        return (
          <NavigationMenuItemMultiColumn
            key={category.id}
            isScrolled={isScrolled}
            trigger={category.name}
            allCategories={categories}
            href={`/categories/${category.handle}`}
            columns={[
              {
                title: category.name,
                items: category.category_children.map((child: any) => ({
                  label: child.name,
                  subCategoryHref: `/categories/${child.handle}`,
                })),
              },
              {
                title: hoveredCategory
                  ? hoveredCategory.name
                  : "Subcategorieën",
                items:
                  hoveredCategory && hoveredCategory.category_children
                    ? hoveredCategory.category_children.map(
                      (grandchild: any) => ({
                        label: grandchild.name,
                        subCategoryHref: `/categories/${grandchild.handle}`,
                      }),
                    )
                    : [],
              },
            ]}
            // @ts-ignore
            setHoveredCategory={setHoveredCategory}
            category={category}
          >

              <NavigationFeaturedBlock
                imageSrc="/images/collection/arte-antwerp/arte-header.png"
                altText="Arte Antwerp"
                title="Arte Antwerp"
              />
              <NavigationFeaturedBlock
                imageSrc="/images/collection/arte-antwerp/arte-header.png"
                altText="Arte Antwerp"
                title="Arte Antwerp"
              />
          </NavigationMenuItemMultiColumn>
        )
      } else if (
        category.category_children.length === 0 &&
        !category.parent_category
      ) {
        return (
          <NavigationMenuItemLink
            key={category.id}
            href={`/categories/${category.handle}`}
            isScrolled={isScrolled}
          >
            <Heading size="3" className="uppercase"  weight="medium">{category.name}</Heading>
          </NavigationMenuItemLink>
        )
      }
    })
  }

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {generateMenuItems(categories)}
        <NavigationMenuItemLink
          key="younithy"
          href="younithy"
          isScrolled={isScrolled}
        >
          <Heading size="3" className="uppercase"  weight="medium">Younithy</Heading>
        </NavigationMenuItemLink>

        <NavigationMenuItemLink
          key="brands"
          href="brands"
          isScrolled={isScrolled}
        >
          <Heading size="3" className="uppercase"  weight="medium">Brands</Heading>
        </NavigationMenuItemLink>
        <NavigationMenuItemLink key="sale" href="sale" isScrolled={isScrolled}>
          <Heading size="3" color="red" weight="bold" className="uppercase">Sale</Heading>
        </NavigationMenuItemLink>
      </NavigationMenuList>
    </NavigationMenu>
  )
};