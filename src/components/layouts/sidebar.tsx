"use client";
import {
  ChartPieIcon,
  WrenchScrewdriverIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface ISidebarProps {
  toggleOpen?: boolean;
}

const naviItems = [
  {
    icon: <ChartPieIcon className="w-6 h-6 text-gray-400" />,
    name: "Dashboard",
    url: "/admin",
  },
  {
    icon: <WrenchScrewdriverIcon className="w-6 h-6 text-gray-400" />,
    name: "Mantenedores",
    url: "#",
    insider: true,
    showChildren: false,
    children: [
      {
        name: "Categoría",
        url: "/admin/categories",
      },
      {
        name: "Productos",
        url: "/admin/products",
      },
    ],
  },
];

export default function Sidebar({ toggleOpen = true }: ISidebarProps) {
  const [navigation, setNavigation] = useState(naviItems);
  const path = usePathname();
  const toggleChildMenu = (index: number) => {
    navigation[index].showChildren = !navigation[index].showChildren;
    setNavigation([...navigation]);
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden ${
          toggleOpen ? "w-64" : "w-16"
        } h-full pt-16 font-normal duration-75 lg:flex transition-width`}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col flex-1 min-h-0 pt-0 border-r bg-gray-800 border-gray-700 transition-all duration-300 ease-in-out">
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1 bg-gray-800 divide-gray-700">
              <ul className="pb-2 space-y-2">
                {navigation.map((item, index) => {
                  if (item.insider) {
                    return (
                      <li key={index}>
                        <button
                          onClick={() => toggleChildMenu(index)}
                          className="flex items-center w-full p-2 text-base transition duration-75 rounded-lg group text-gray-200 hover:bg-gray-700"
                        >
                          {item.icon}
                          {toggleOpen && (
                            <span className="ml-3">{item.name}</span>
                          )}
                          {toggleOpen && (
                            <ChevronDownIcon className="w-4 h-4 ml-auto text-gray-300 group-hover:text-gray-200" />
                          )}
                        </button>
                        <ul
                          key={`sidebar-second-level-${index}`}
                          className={`${
                            item.showChildren ||
                            item.children?.some((child) => child.url === path)
                              ? "max-h-auto block"
                              : "hidden max-h-0"
                          } py-2 space-y-2 transition-all duration-300 ease-in-out`}
                        >
                          {item.children?.map((child, index) => (
                            <li key={index}>
                              <Link
                                href={child.url}
                                className={`flex pl-11 items-center p-2 text-base rounded-lg group text-gray-200 hover:bg-gray-700 ${
                                  child.url === path ? "bg-gray-700" : ""
                                }`}
                              >
                                {toggleOpen && (
                                  <span className="ml-3">{child.name}</span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  } else {
                    return (
                      <li key={index}>
                        <Link
                          href={item.url}
                          className={`flex items-center p-2 text-base rounded-lg group text-gray-200 hover:bg-gray-700 ${
                            item.url === path ? "bg-gray-700" : ""
                          }`}
                        >
                          {item.icon}
                          {toggleOpen && (
                            <span className="ml-3">{item.name}</span>
                          )}
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          </div>
        </div>
      </aside>
      <div
        className="fixed inset-0 z-10 hidden bg-gray-900/90"
        id="sidebarBackdrop"
      ></div>
    </>
  );
}
