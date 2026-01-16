"use client";

import {
  ChartPieIcon,
  WrenchScrewdriverIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { Accordion, AccordionItem } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ISidebarProps {
  toggleOpen?: boolean;
}

const naviItems = [
  {
    icon: ChartPieIcon,
    name: "Dashboard",
    url: "/admin",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    name: "Cotizador",
    url: "/admin/quoter",
  },
  {
    icon: WrenchScrewdriverIcon,
    name: "Mantenedores",
    url: "#",
    insider: true,
    children: [
      {
        name: "Productos",
        url: "/admin/categories",
      },
      {
        name: "Stock",
        url: "/admin/types",
      },
    ],
  },
];

export default function Sidebar({ toggleOpen = true }: ISidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden ${
          toggleOpen ? "w-64" : "w-16"
        } h-full pt-16 font-normal duration-200 lg:flex transition-all border-r border-divider`}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-content1 transition-all duration-200 ease-in-out">
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-3 space-y-1">
              <ul className="pb-2 space-y-1">
                {naviItems.map((item, index) => {
                  if (item.insider && item.children) {
                    const isChildActive = item.children.some(
                      (child) => child.url === pathname
                    );

                    return (
                      <li key={index}>
                        {toggleOpen ? (
                          <Accordion 
                            className="px-0"
                            defaultExpandedKeys={isChildActive ? [index.toString()] : []}
                          >
                            <AccordionItem
                              key={index.toString()}
                              aria-label={item.name}
                              title={
                                <div className="flex items-center gap-3">
                                  <item.icon className="w-5 h-5 text-default-500" />
                                  <span className="text-sm font-medium">
                                    {item.name}
                                  </span>
                                </div>
                              }
                              indicator={<ChevronDownIcon className="w-4 h-4" />}
                              classNames={{
                                trigger: "py-2 hover:bg-default-100 rounded-lg transition-colors",
                                title: "text-default-700",
                              }}
                            >
                              <ul className="space-y-1 ml-8">
                                {item.children.map((child, childIndex) => (
                                  <li key={childIndex}>
                                    <Link
                                      href={child.url}
                                      className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                        child.url === pathname
                                          ? "bg-primary text-primary-foreground font-medium"
                                          : "text-default-600 hover:bg-default-100 hover:text-default-900"
                                      }`}
                                    >
                                      {child.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </AccordionItem>
                          </Accordion>
                        ) : (
                          <button
                            className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-default-100 transition-colors"
                            title={item.name}
                          >
                            <item.icon className="w-5 h-5 text-default-500" />
                          </button>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={index}>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          item.url === pathname
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-default-700 hover:bg-default-100"
                        }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {toggleOpen && (
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
