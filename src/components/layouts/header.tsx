"use client";

import { ArrowLeftOnRectangleIcon, Bars3Icon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useActionState } from "react";
import { logout } from "@/lib/actions";
import { useEffect, useState } from "react";

interface IHeaderProps {
  setToggleOpen: (toggleOpen: boolean) => void;
  toggleOpen?: boolean;
}

export default function Header({ setToggleOpen, toggleOpen }: IHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [state, dispatch] = useActionState(logout, undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setToggleOpen(!toggleOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed z-30 w-full border-b border-divider bg-content1 backdrop-blur-md">
      <div className="px-3 py-3 md:px-5 md:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <Button
              isIconOnly
              variant="light"
              className="hidden sm:flex"
              onPress={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="w-5 h-5" />
            </Button>
            
            <Button
              isIconOnly
              variant="light"
              className="md:hidden"
              aria-label="Toggle mobile sidebar"
            >
              <Bars3Icon className="w-5 h-5" />
            </Button>

            <a href="/admin/" className="flex items-center">
              <span className="text-xl font-semibold whitespace-nowrap bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Admin Panel
              </span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                isIconOnly
                variant="light"
                onPress={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </Button>
            )}

            <form action={dispatch}>
              <Button
                type="submit"
                isIconOnly
                variant="light"
                color="danger"
                aria-label="Logout"
                onPress={() => {
                  setTimeout(() => window.location.reload(), 1000);
                }}
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
