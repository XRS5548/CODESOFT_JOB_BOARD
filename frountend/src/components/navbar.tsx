// Importing HeroUI Components
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
  
  GithubIcon,
  
  SearchIcon,
} from "@/components/icons";
import { useEffect } from "react";
import AuthButton from "./AuthButton";
import API from "@/config/API";

export const Navbar = () => {

 

  // const API = "http://localhost:5000/"; // ya jo bhi tumhara backend ka base URL hai

  function verifyUser() {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    fetch(API + "userinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          
  
          localStorage.setItem("role", response.role);
          localStorage.setItem("name", response.name);
          localStorage.setItem("email", response.email);
        } else {
          localStorage.removeItem("token")
          console.warn("User verification failed:", response.message);
        }
      })
      .catch(err => {
        console.error("Request failed:", err);
      });
  }
  

  useEffect(() => {
    verifyUser();


  }, []);


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
            <img src="/logo.png" width="40px" alt="" />
            <p className="font-bold text-3xl text-inherit flex items-center">JOB BOSS</p>
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
          
         <AuthButton />
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
