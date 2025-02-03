import React from 'react';
import {
  NavigationMenuContent,
  NavigationMenuItem, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface NavigationMenuItemDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const NavigationMenuItemDropdown: React.FC<NavigationMenuItemDropdownProps> = ({ trigger, children }) => (
  <NavigationMenuItem>
    <NavigationMenuTrigger>{trigger}</NavigationMenuTrigger>
    <NavigationMenuContent>
      {children}
    </NavigationMenuContent>
  </NavigationMenuItem>
);