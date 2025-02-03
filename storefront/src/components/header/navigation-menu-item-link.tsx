import React from 'react';
import Link from 'next/link';
import { NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"

interface NavigationMenuItemLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isScrolled?: boolean;
}

export const NavigationMenuItemLink: React.FC<NavigationMenuItemLinkProps> = ({ href, children, className, isScrolled }) => (
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href={href} className={`${className} ${isScrolled ? "text-black" : "text-white"}`}>
        {children}
      </Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
);