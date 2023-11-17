import { ChartPieIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ISidebarProps {
  toggleOpen?: boolean;
}

const naviItems = [
  {
    icon: <ChartPieIcon className="w-6 h-6 text-gray-300" />,
    name: "Dashboard",
    url: "/admin",
  },
];

export default function Sidebar({ toggleOpen = true }: ISidebarProps) {
  const path = usePathname();
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
                {naviItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.url}
                      className={`flex items-center p-2 text-base rounded-lg group text-gray-200 hover:bg-gray-700 ${
                        item.url === path ? "bg-gray-700" : ""
                      }`}
                    >
                      {item.icon}
                      {toggleOpen && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                ))}
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
