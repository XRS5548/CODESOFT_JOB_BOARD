// Importing HeroUI Components
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";

// Navbar specific components from HeroUI
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";

import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

// Site config and custom components
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  SearchIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  // 🔍 Search Input (used in desktop + mobile menus)
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={ // Keyboard shortcut shown inside input
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* 🔹 Left Section: Logo + Main Nav Links (Desktop) */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* Brand/Logo */}
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
          </Link>
        </NavbarBrand>

        {/* Main Navigation Items (visible only on large screens) */}
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      {/* 🔹 Right Section: Social Icons + Theme + Search + Sponsor (Desktop) */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        {/* Social Media Icons */}
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.twitter} title="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.discord} title="Discord">
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          {/* Theme Switcher */}
          <ThemeSwitch />
        </NavbarItem>

        {/* Search Input (only on lg screens) */}
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

        {/* Sponsor Button */}
        <NavbarItem className="hidden md:flex">
          <Button
            color="primary"
            as={Link}
            className="text-sm font-normal  "
            href={siteConfig.links.login}
            variant="flat"
          >
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* 🔹 Mobile Right Section: GitHub + Theme + Menu Toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* 🔹 Mobile Menu Content */}
      <NavbarMenu>
        {/* Search Bar inside Mobile Menu */}
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* Nav items shown in mobile menu */}
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
